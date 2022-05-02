import { client, wallets } from '../library.js';

import {
  MsgExecuteContract,
  MnemonicKey,
  Coins,
  LCDClient,
} from "@terra-money/terra.js";

const cw20Contract = "terra1w3tqfpu9aucjvn9mz99ln5m2up754xj2ef5d6u";
const walletAddress = wallets.wallet1.key.accAddress;

const response = await client.wasm.contractQuery(
  // Address of CW20 contract.
  cw20Contract,
  // QueryMsg payload.
  {
    balance: {
      address: walletAddress
    }
  }
);

console.log(response);

