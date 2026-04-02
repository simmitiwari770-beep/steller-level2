import * as StellarSdk from '@stellar/stellar-sdk';

const RPC_URL = 'https://soroban-testnet.stellar.org';
const PASSPHRASE = StellarSdk.Networks.TESTNET;
const TX_HASH = 'b73fe646c1ba95af4750684c5a3abc352514609b3ecdf19d674e7d827a352143';

async function fetchId() {
  const server = new StellarSdk.rpc.Server(RPC_URL);
  const status = await server.getTransaction(TX_HASH);
  
  // v3 meta extraction (it is already parsed by the SDK version 15.0.x)
  const meta = status.resultMetaXdr;
  const sorobanMeta = meta.value().sorobanMeta();
  const address = StellarSdk.Address.fromScAddress(sorobanMeta.returnValue().address()).toString();
  
  console.log(`CONTRACT_ID=${address}`);
}

fetchId().catch(console.error);
