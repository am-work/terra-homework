import { client, wallets } from '../library.js';

import {
  MsgExecuteContract,
  MnemonicKey,
  Coins,
  LCDClient,
} from "@terra-money/terra.js";

const cw20Contract = "terra1hpajld8zs93md8zrs6sfy42zl0khqpmr07muw0";
const wallet = wallets.wallet1;

const msg = new MsgExecuteContract(
    // Address of wallet that is signing the transaction
    wallet.key.accAddress,
    // Address of CW20 contract
    cw20Contract,
    // ExecuteMsg payload
    {
        transfer: {
          // Address of wallet or contract that is getting the tokens
          recipient: "terra1cvuvzffnjrsz96ee6ms0pr9lgpwpgre4fqzjwl",
          // Amount of tokens to transfer, in microunits
          amount: "1000",
        },
    },
  );

  const tx = await wallet.createAndSignTx({ msgs: [msg] });
  const result = await client.tx.broadcast(tx);

console.log(result);