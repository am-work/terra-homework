import { client, wallets } from '../library.js';

import {
  MsgExecuteContract,
  MnemonicKey,
  Coins,
  LCDClient,
} from "@terra-money/terra.js";

const cw20Contract = "terra1sex6wuv9sarmkva8ylccxaqlr5cwt0urx86sd6";
const walletAddress = wallets.wallet1.key.accAddress;

const msg = new MsgExecuteContract(
    walletAddress,
    cw20Contract,
    {
        transfer: { recipient: "terra1cvuvzffnjrsz96ee6ms0pr9lgpwpgre4fqzjwl", amount: "1000" },
    },
  );
  
  const tx = await wallets.wallet1.createAndSignTx({ msgs: [msg] });
  const result = await client.tx.broadcast(tx);

console.log(result);