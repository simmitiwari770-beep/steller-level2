import * as StellarSdk from '@stellar/stellar-sdk';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const RPC_URL = 'https://soroban-testnet.stellar.org';
const PASSPHRASE = StellarSdk.Networks.TESTNET;
const WASM_PATH = './contracts/crowdfunding/target/wasm32-unknown-unknown/release/crowdfunding.wasm';

async function deploy() {
  console.log('Generating keypair for deployment...');
  const keypair = StellarSdk.Keypair.random();
  const secret = keypair.secret();
  const pubkey = keypair.publicKey();
  console.log(`Public Key: ${pubkey}`);

  console.log('Funding account with Friendbot...');
  await fetch(`https://friendbot.stellar.org?addr=${pubkey}`);
  console.log('Account funded.');

  const server = new StellarSdk.rpc.Server(RPC_URL);
  const account = await server.getAccount(pubkey);

  const wasm = readFileSync(WASM_PATH);

  console.log('Uploading WASM...');
  const uploadTx = new StellarSdk.TransactionBuilder(account, {
    fee: '1000000',
    networkPassphrase: PASSPHRASE,
  })
    .addOperation(StellarSdk.Operation.uploadContractWasm({ wasm }))
    .setTimeout(30)
    .build();

  const preparedUpload = await server.prepareTransaction(uploadTx);
  preparedUpload.sign(keypair);
  const uploadResult = await server.sendTransaction(preparedUpload);
  
  if (uploadResult.status === 'ERROR') {
    throw new Error('Upload failed: ' + JSON.stringify(uploadResult));
  }

  console.log('Waiting for upload status...');
  let uploadStatus = await server.getTransaction(uploadResult.hash);
  while (uploadStatus.status === 'NOT_FOUND') {
    await new Promise(r => setTimeout(r, 2000));
    uploadStatus = await server.getTransaction(uploadResult.hash);
  }
  
  let meta = uploadStatus.resultMetaXdr;
  if (typeof meta === 'string') {
    meta = StellarSdk.xdr.TransactionMeta.fromXDR(meta, 'base64');
  }
  const sorobanMeta = meta.value().sorobanMeta();
  const wasmHash = sorobanMeta.returnValue().bytes().toString('hex');
  console.log(`WASM Hash: ${wasmHash}`);

  console.log('Creating contract instance...');
  const createTx = new StellarSdk.TransactionBuilder(await server.getAccount(pubkey), {
    fee: '1000000',
    networkPassphrase: PASSPHRASE,
  })
    .addOperation(StellarSdk.Operation.createCustomContract({
      wasmHash: Buffer.from(wasmHash, 'hex'),
      address: StellarSdk.Address.fromString(pubkey)
    }))
    .setTimeout(30)
    .build();

  const preparedCreate = await server.prepareTransaction(createTx);
  preparedCreate.sign(keypair);
  const createResult = await server.sendTransaction(preparedCreate);

  console.log('Waiting for create status...');
  let createStatus = await server.getTransaction(createResult.hash);
  while (createStatus.status === 'NOT_FOUND') {
    await new Promise(r => setTimeout(r, 2000));
    createStatus = await server.getTransaction(createResult.hash);
  }

  let metaCreate = createStatus.resultMetaXdr;
  if (typeof metaCreate === 'string') {
    metaCreate = StellarSdk.xdr.TransactionMeta.fromXDR(metaCreate, 'base64');
  }
  const createSorobanMeta = metaCreate.value().sorobanMeta();
  const contractId = StellarSdk.Address.fromScAddress(createSorobanMeta.returnValue().address()).toString();
  console.log(`Contract ID: ${contractId}`);

  console.log('Initializing campaign...');
  const contract = new StellarSdk.Contract(contractId);
  const initTx = new StellarSdk.TransactionBuilder(await server.getAccount(pubkey), {
    fee: '1000000',
    networkPassphrase: PASSPHRASE,
  })
    .addOperation(contract.call(
      'initialize',
      StellarSdk.nativeToScVal('GlobalGrant', { type: 'symbol' }),
      StellarSdk.nativeToScVal(10000000000n, { type: 'i128' }), // 1000 XLM goal
      StellarSdk.nativeToScVal(StellarSdk.Address.fromString(pubkey), { type: 'address' }),
      StellarSdk.nativeToScVal(StellarSdk.Address.fromString('CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'), { type: 'address' }) // Native token
    ))
    .setTimeout(30)
    .build();

  const preparedInit = await server.prepareTransaction(initTx);
  preparedInit.sign(keypair);
  await server.sendTransaction(preparedInit);

  console.log('Deployment complete!');
  console.log(`Update your .env with: NEXT_PUBLIC_CONTRACT_ID=${contractId}`);

  writeFileSync('.env', `NEXT_PUBLIC_CONTRACT_ID=${contractId}\nNEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org\nNEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org\nNEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"\n`);
}

deploy().catch(console.error);
