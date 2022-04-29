import setup from '../library';

async function queryBalance() {
  const { client, wallets, network } = await setup()

  const { cw20Contract } = network
  const walletAddress = wallets.wallet1.key.accAddress;

  const response = await client.wasm.contractQuery(cw20Contract, { balance: { address: walletAddress } });

  console.log(response);
}

queryBalance()
