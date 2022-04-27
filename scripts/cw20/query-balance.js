import { client, wallets } from '../library.js';

import {
  MsgExecuteContract,
  MnemonicKey,
  Coins,
  LCDClient,
} from "@terra-money/terra.js";

const cw20Contract = "terra1xdmun04xuphlu4vej0zyrkgtezn269heg259ya";
const walletAddress = wallets.wallet1.key.accAddress;

const response = await client.wasm.contractQuery(cw20Contract, { balance: { address: walletAddress }});

console.log(response);

