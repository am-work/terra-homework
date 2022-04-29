import setup from '../library';

import {
  MsgExecuteContract,
  Coins,
} from "@terra-money/terra.js";

async function executeBuy() {
  const { wallets, client, network } = await setup()
  // Wallet to use. Make sure to use the right wallet from library.js.
  const wallet = wallets.wallet1
  // Address of the Lemon Swap contract.
  const contract = network.swapContract

  const amount = (0.5 * 1e6).toFixed(0); // 0.5 Luna

  const msg = new MsgExecuteContract(
    // Address of person who's signing the transaction.
    wallet.key.accAddress,
    // Address of contract to execute.
    contract,
    // ExecuteMsg payload
    {
      buy: {},
    },
    // Send Luna with this execute message.
    new Coins({ uluna: amount }),
  );

  const tx = await wallet.createAndSignTx({ msgs: [msg] });
  const result = await client.tx.broadcast(tx);

  console.log(result);
}
executeBuy()
