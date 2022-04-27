import { client, wallets } from "../library.js";

import { LCDClient, MnemonicKey, MsgExecuteContract } from "@terra-money/terra.js";

// burn feature

const wallet = wallets.wallet1;

// ANC on bombay-12
const tokenAddress = "terra1a0ym2ml0p95w33hw2tqwql3e06k59gg8eqks89"; // 사용하는 토큰 주소
const recipient_addr = ""; // test wallet 2

// Transfer 1 ANC.
const cw20Send = new MsgExecuteContract(
  wallet.key.accAddress, // 보내는 주소
  tokenAddress,
  {
    burn: {
      // transfer / mint / burn 3 중 하나 command 이용 (burn 은 amount recipient 중 amount 만 이용)
      amount: "7000000",
    },
  }
);

const tx = await wallet.createAndSignTx({ msgs: [cw20Send] });
const result = await client.tx.broadcast(tx);

console.log(result);
