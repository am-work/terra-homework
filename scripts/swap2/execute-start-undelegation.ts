import setup from '../library';

import { MsgExecuteContract } from "@terra-money/terra.js";

async function executeStartUndelegation() {
  const { wallets, client, network } = await setup()
  const wallet = wallets.wallet1
  const contract = network.swapContract

  const amount = (0.1 * 1e6).toFixed(0);

  const msg = new MsgExecuteContract(
    wallet.key.accAddress,
    contract,
    {
      start_undelegation: { amount: amount },
    },
  );

  const tx = await wallet.createAndSignTx({ msgs: [msg] });
  const result = await client.tx.broadcast(tx);

  console.log(result);
}
executeStartUndelegation()
