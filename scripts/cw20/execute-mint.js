import { client, wallets } from '../library.js';

import {
  MsgExecuteContract,
  Coins,
} from "@terra-money/terra.js";

// Address of the Lemon Swap contract.
const contract = "terra1w3tqfpu9aucjvn9mz99ln5m2up754xj2ef5d6u";

// Wallet to use. Make sure to use the right wallet from library.js.
const wallet = wallets.wallet1;

// Amount of tokens to mint.
const amount = (0.5 * 1e6).toFixed(0);

const msg = new MsgExecuteContract(
  // Address of person who's signing the transaction (minter).
  wallet.key.accAddress,
  // Address of contract to execute.
  contract,
  // ExecuteMsg payload
  {
    mint: {
      // Who's getting the tokens?
      recipient: "terra1c05zxkr8ee40tf2har8yksgk7gdjjmleudeqhq",
      amount: amount,
    },
  },
);

const tx = await wallet.createAndSignTx({ msgs: [msg] });
const result = await client.tx.broadcast(tx);

console.log(result);