import { client, wallets } from '../library.js';

import {
  MsgExecuteContract,
  MnemonicKey,
  Coins,
  LCDClient,
} from "@terra-money/terra.js";

// DriedMango Token
const cw20Contract = "terra10unsuxpm0g9yfy5f02s4ep7mwdkqdemzue6c9l";
const walletAddress = wallets.wallet1.key.accAddress;

const response = await client.wasm.contractQuery(cw20Contract, { balance: { address: walletAddress }});

console.log(response);