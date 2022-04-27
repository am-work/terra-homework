import { client, wallets } from '../library.js';

import {
  MsgExecuteContract,
  MnemonicKey,
  Coins,
  LCDClient,
} from "@terra-money/terra.js";

const cw20Contract = "terra1hpajld8zs93md8zrs6sfy42zl0khqpmr07muw0";
const walletAddress = wallets.wallet1.key.accAddress;

const response = await client.wasm.contractQuery(cw20Contract, { balance: { address: walletAddress }});

console.log(response);

