let _initialized = false;
let _StellarWalletsKit: any = null;

export async function getKit() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (_initialized && _StellarWalletsKit) {
    return _StellarWalletsKit;
  }

  // Dynamic imports to prevent SSR crashes (localStorage issues in external modules)
  const { StellarWalletsKit, Networks } = await import('@creit.tech/stellar-wallets-kit');
  const { FreighterModule } = await import('@creit.tech/stellar-wallets-kit/modules/freighter');
  const { AlbedoModule } = await import('@creit.tech/stellar-wallets-kit/modules/albedo');

  if (!_initialized) {
    StellarWalletsKit.init({
      network: Networks.TESTNET,
      modules: [new FreighterModule(), new AlbedoModule()],
    });
    _initialized = true;
  }
  
  _StellarWalletsKit = StellarWalletsKit;
  return _StellarWalletsKit;
}

export async function initKit() {
  await getKit();
}
