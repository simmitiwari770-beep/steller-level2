import { create } from 'zustand';
import * as StellarSdk from '@stellar/stellar-sdk';

interface StellarState {
  address: string | null;
  balance: string;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  updateBalance: () => Promise<void>;
}

export const useStellar = create<StellarState>((set, get) => ({
  address: null,
  balance: '0',
  isConnecting: false,
  error: null,

  connect: async () => {
    try {
      set({ isConnecting: true, error: null });

      // Dynamic import keeps this 100% client-side (never runs during SSR)
      const { getKit } = await import('@/lib/stellar-wallet');
      const StellarWalletsKit = await getKit();
      
      if (!StellarWalletsKit) {
         throw new Error('Wallet kit not available');
      }

      // Open the built-in auth modal so user picks their wallet
      const { address } = await StellarWalletsKit.authModal();
      if (!address) throw new Error('Wallet returned no address');
      set({ address });
      await get().updateBalance();
    } catch (e: any) {
      const msg = (e?.message || '') as string;
      if (msg.includes('No wallet') || msg.includes('not installed')) {
        set({ error: 'No Stellar wallet found. Install Freighter or Albedo.' });
      } else if (
        msg.toLowerCase().includes('reject') ||
        msg.toLowerCase().includes('denied') ||
        msg.toLowerCase().includes('cancel')
      ) {
        set({ error: 'Connection cancelled by the user.' });
      } else {
        set({ error: msg || 'Failed to connect wallet.' });
      }
    } finally {
      set({ isConnecting: false });
    }
  },

  disconnect: async () => {
    try {
      const { getKit } = await import('@/lib/stellar-wallet');
      const StellarWalletsKit = await getKit();
      if (StellarWalletsKit) {
        await StellarWalletsKit.disconnect();
      }
    } catch (_) {}
    set({ address: null, balance: '0', error: null });
  },

  updateBalance: async () => {
    const { address } = get();
    if (!address) return;
    try {
      const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
      const account = await server.loadAccount(address);
      const native = account.balances.find((b: any) => b.asset_type === 'native');
      set({ balance: native?.balance || '0', error: null });
    } catch (e: any) {
      // If the account isn't found on Horizon, it just means it hasn't been funded yet.
      // We handle this gracefully by setting balance to 0 instead of crashing.
      if (e.response?.status === 404 || e.name === 'NotFoundError') {
        set({ balance: '0', error: 'Account not funded. Please get testnet XLM from Friendbot.' });
      } else {
        console.error('Failed to fetch balance', e);
      }
    }
  },
}));
