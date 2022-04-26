import { client, wallets } from '../library.js';

import {
  MsgExecuteContract,
  MnemonicKey,
  Coins,
} from "@terra-money/terra.js";

const contract = "terra1f7vnhhk24jmaxp2tdgf906yy980yg3c4h8f05h";
const wallet = wallets.wallet1;

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