import { MsgSend } from "@terra-money/terra.js";
import { client, wallets } from '../library.js';

const send = new MsgSend(
  wallets.wallet2.key.accAddress, // from
  wallets.wallet1.key.accAddress, // to
  { uluna: "6000000" }
);

const tx = await wallets.wallet2.createAndSignTx({ msgs: [send] });
const result = await client.tx.broadcast(tx);

console.log(result);


