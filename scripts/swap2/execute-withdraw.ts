import setup from '../library';

import { MsgExecuteContract } from "@terra-money/terra.js";


async function executeWithdrawl() {
  const { wallets, client, network } = await setup()
  const wallet = wallets.wallet1
  const contract = network.swapContract

  const msg = new MsgExecuteContract(
    wallet.key.accAddress,
    contract,
    {
      withdraw: { amount: 1 },
    },
  );

  const tx = await wallet.createAndSignTx({ msgs: [msg] });
  const result = await client.tx.broadcast(tx);

  console.log(result);
}
executeWithdrawl()
