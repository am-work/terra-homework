import { client, wallets } from "../library.js";

import { LCDClient, MnemonicKey, MsgExecuteContract } from "@terra-money/terra.js";

// mint feature - when minting, burn first if it overflows supply cap

const wallet = wallets.wallet_testnetyk;

// ANC on bombay-12
const tokenAddress = "terra1a0ym2ml0p95w33hw2tqwql3e06k59gg8eqks89";
const recipient_addr = "terra189awj4vhaapjvsqtsvw57egkv8k6cgxlzw0yfe"; // test wallet 2

// mint 1 ANC.
const cw20Send = new MsgExecuteContract(
  wallet.key.accAddress, tokenAddress, {
  mint: {
    amount: "7000000",
    recipient: recipient_addr,
  },
});

const tx = await wallet.createAndSignTx({ msgs: [cw20Send] });
const result = await client.tx.broadcast(tx);

console.log(result);
