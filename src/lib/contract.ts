import * as StellarSdk from '@stellar/stellar-sdk';

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || '';
const RPC_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

export interface Campaign {
  title: string;
  goal_amount: bigint;
  total_raised: bigint;
  owner: string;
  token: string;
}

export interface HistoryItem {
  id: string;
  from: string;
  amount: string;
  ledger: number;
  createdAt: string;
}

export function formatStroopsToXLM(stroops: bigint): string {
  if (!stroops) return '0';
  const val = Number(stroops) / 10_000_000;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 7,
  }).format(val);
}

export async function getCampaign(): Promise<Campaign | null> {
  if (!CONTRACT_ID) return null;
  try {
    const server = new StellarSdk.rpc.Server(RPC_URL);
    const contract = new StellarSdk.Contract(CONTRACT_ID);

    const dummyKey = StellarSdk.Keypair.random();
    
    // Use simulateTransaction to read state
    const tx = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(dummyKey.publicKey(), '0'),
      { fee: '100', networkPassphrase: NETWORK_PASSPHRASE }
    )
      .addOperation(contract.call('get_campaign'))
      .setTimeout(30)
      .build();

    const sim = await server.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationError(sim)) {
      console.error('Simulation error:', sim.error);
      return null;
    }

    const scVal = (sim as StellarSdk.rpc.Api.SimulateTransactionSuccessResponse).result?.retval;
    if (!scVal) return null;

    const parsed = StellarSdk.scValToNative(scVal);
    console.log('Campaign data fetched:', parsed);
    
    return {
      title: parsed.title?.toString() || 'GlobalGrant',
      goal_amount: BigInt(parsed.goal_amount?.toString() || '0'),
      total_raised: BigInt(parsed.total_raised?.toString() || '0'),
      owner: parsed.owner?.toString() || '',
      token: parsed.token?.toString() || '',
    };
  } catch (e) {
    console.error('getCampaign error:', e);
    return null;
  }
}

export async function donateToCampaign(
  donorAddress: string,
  amountXLM: string
): Promise<{ hash: string }> {
  const server = new StellarSdk.rpc.Server(RPC_URL);
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const amountStroops = BigInt(Math.floor(parseFloat(amountXLM) * 10_000_000));

  let account;
  try {
    account = await server.getAccount(donorAddress);
  } catch (e: any) {
    if (e.response?.status === 404 || e.name === 'NotFoundError') {
      throw new Error('Your account is not yet funded on the Testnet. Please fund it via Friendbot before donating.');
    }
    throw e;
  }

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: '1000000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'donate',
        StellarSdk.nativeToScVal(StellarSdk.Address.fromString(donorAddress), { type: 'address' }),
        StellarSdk.nativeToScVal(amountStroops, { type: 'i128' })
      )
    )
    .setTimeout(30)
    .build();

  const preparedTx = await server.prepareTransaction(tx);
  const txXDR = preparedTx.toXDR();

  const { getKit } = await import('@/lib/stellar-wallet');
  const StellarWalletsKit = await getKit();
  if (!StellarWalletsKit) {
    throw new Error('Wallet kit not available');
  }

  const { signedTxXdr } = await StellarWalletsKit.signTransaction(txXDR, {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE);
  const result = await server.sendTransaction(signedTx);

  if (result.status === 'ERROR') {
    throw new Error('Transaction failed: ' + JSON.stringify(result.errorResult));
  }

  // Poll for completion
  let response = await server.getTransaction(result.hash);
  let retries = 0;
  while (
    response.status === StellarSdk.rpc.Api.GetTransactionStatus.NOT_FOUND &&
    retries < 10
  ) {
    await new Promise((r) => setTimeout(r, 1000));
    response = await server.getTransaction(result.hash);
    retries++;
  }

  if (response.status === StellarSdk.rpc.Api.GetTransactionStatus.FAILED) {
    throw new Error('Transaction failed on-chain');
  }

  return { hash: result.hash };
}

export async function getTransactionHistory(): Promise<HistoryItem[]> {
  if (!CONTRACT_ID) return [];
  try {
    const server = new StellarSdk.rpc.Server(RPC_URL);
    
    // Fetch Soroban events for the contract
    // We look for events with the 'donate' topic
    const eventsResponse = await server.getEvents({
      startLedger: 0,
      filters: [
        {
          type: 'contract',
          contractIds: [CONTRACT_ID!],
        }
      ],
      limit: 20
    });

    console.log('Contract events fetched:', eventsResponse.events.length);

    return eventsResponse.events
      .map(event => {
        try {
          const topics = event.topic.map(t => StellarSdk.scValToNative(t));
          if (topics[0] !== 'donate') return null; // We only care about donate events
          
          const amountValue = StellarSdk.scValToNative(event.value);
          const fromAddr = topics[1]?.toString() || 'Unknown';
          
          return {
            id: event.id,
            from: fromAddr.length > 10 ? fromAddr.slice(0, 6) + '...' + fromAddr.slice(-6) : fromAddr,
            amount: formatStroopsToXLM(BigInt(amountValue?.toString() || '0')),
            ledger: event.ledger,
            createdAt: event.ledgerClosedAt || new Date().toISOString()
          };
        } catch (err) {
          console.error('Event parse error:', err);
          return null;
        }
      })
      .filter((item): item is HistoryItem => item !== null)
      .reverse(); // Newest first
  } catch (e) {
    console.error('getTransactionHistory error:', e);
    return [];
  }
}
