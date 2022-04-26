import { MsgSwap, Coin } from "@terra-money/terra.js";
import { client, wallets } from '../library.js';

let wallet = wallets.wallet1
let amountToConvert = (1 * 1e6).toFixed(0); // 1 Luna

// Swap Luna to UST.
const swap = new MsgSwap(
  wallet.key.accAddress,
  new Coin('uluna', amountToConvert),
  'uusd' // Currency to convert it to.
);

const tx = await wallet.createAndSignTx({ msgs: [swap] });
const result = await client.tx.broadcast(tx);

console.log(result);