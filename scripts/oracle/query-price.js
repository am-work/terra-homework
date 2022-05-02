import { client, wallets } from '../library.js';

import {
  MsgExecuteContract,
  MnemonicKey,
  Coins,
  LCDClient,
} from "@terra-money/terra.js";

const oracleContract = "terra1g3uglpz5nmql6eavvn0ef7cyp8ngqg7n0u2tuj";
const walletAddress = wallets.wallet1.key.accAddress;

const response = await client.wasm.contractQuery(
  oracleContract,
  // QueryMsg payload.
  {
    get_price: {}
  }
);

console.log(response);

