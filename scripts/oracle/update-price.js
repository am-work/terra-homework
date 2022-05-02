import { client, wallets } from '../library.js';

import {
  MsgExecuteContract,
  MnemonicKey,
  Coins,
  LCDClient,
} from "@terra-money/terra.js";

const oracleContract = "terra1g3uglpz5nmql6eavvn0ef7cyp8ngqg7n0u2tuj";
const wallet = wallets.wallet1;

const msg = new MsgExecuteContract(
    // Address of wallet that is signing the transaction
    wallet.key.accAddress,
    oracleContract,
    // ExecuteMsg payload
    {
      update_price: {
        price: "666",
      },
    },
  );

  const tx = await wallet.createAndSignTx({ msgs: [msg] });
  const result = await client.tx.broadcast(tx);

console.log(result);