import setup from '../library';

import {
  MsgExecuteContract,
  Coins,
} from "@terra-money/terra.js";

async function executeBuy() {
  const { wallets, client, network } = await setup()
  const wallet = wallets.wallet1
  const contract = network.swapContract

  const amount = (0.5 * 1e6).toFixed(0);

  const msg = new MsgExecuteContract(
    wallet.key.accAddress,
    contract,
    {
      buy: {},
    },
    new Coins({ uluna: amount }),
  );

  const tx = await wallet.createAndSignTx({ msgs: [msg] });
  const result = await client.tx.broadcast(tx);

  console.log(result);
}
executeBuy()
