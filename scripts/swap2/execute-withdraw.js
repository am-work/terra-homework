import { client, wallets } from '../library.js';

import {
  MsgExecuteContract,
  MnemonicKey,
  Coins,
} from "@terra-money/terra.js";

const contract = "terra1f7vnhhk24jmaxp2tdgf906yy980yg3c4h8f05h";
const wallet = wallets.wallet1;

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