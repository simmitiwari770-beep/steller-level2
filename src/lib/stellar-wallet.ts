/**
 * stellar-wallet.ts
 *
 * StellarWalletsKit is a STATIC class — all its methods (init, authModal,
 * signTransaction, disconnect, …) are called directly on the class itself,
 * not on an instance.  We lazy-init once on the client and cache that reference.
 */

let _initialized = false;
let _Kit: any = null; // Holds the StellarWalletsKit class (static) after init

export async function getKit() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (_initialized && _Kit) {
    return _Kit;
  }

  // Dynamic import keeps this 100 % client-side (never runs during SSR)
  const { StellarWalletsKit, Networks } = await import('@creit.tech/stellar-wallets-kit');

  // Helper: resolve the constructor regardless of named vs default export layout
  const getConstructor = async (importPromise: Promise<any>, name: string) => {
    const module = await importPromise;
    if (module[name]) return module[name];
    if (module.default && module.default.name === name) return module.default;
    if (module.default) return module.default;
    return null;
  };

  const FreighterCtor = await getConstructor(import('@creit.tech/stellar-wallets-kit/modules/freighter'), 'FreighterModule');
  const AlbedoCtor    = await getConstructor(import('@creit.tech/stellar-wallets-kit/modules/albedo'),    'AlbedoModule');
  const XBullCtor     = await getConstructor(import('@creit.tech/stellar-wallets-kit/modules/xbull'),     'XBullModule');
  const RabetCtor     = await getConstructor(import('@creit.tech/stellar-wallets-kit/modules/rabet'),     'RabetModule');
  const HanaCtor      = await getConstructor(import('@creit.tech/stellar-wallets-kit/modules/hana'),      'HanaModule');
  const LobstrCtor    = await getConstructor(import('@creit.tech/stellar-wallets-kit/modules/lobstr'),    'LobstrModule');

  const modules: any[] = [];
  if (FreighterCtor) modules.push(new FreighterCtor());
  if (AlbedoCtor)    modules.push(new AlbedoCtor());
  if (XBullCtor)     modules.push(new XBullCtor());
  if (RabetCtor)     modules.push(new RabetCtor());
  if (HanaCtor)      modules.push(new HanaCtor());
  if (LobstrCtor)    modules.push(new LobstrCtor());

  // StellarWalletsKit.init() is a STATIC method — correct usage per the SDK types
  StellarWalletsKit.init({
    network: Networks.TESTNET,
    modules,
  });

  _initialized = true;
  _Kit = StellarWalletsKit; // Cache the class itself (static API)
  return _Kit;
}

export async function initKit() {
  await getKit();
}
