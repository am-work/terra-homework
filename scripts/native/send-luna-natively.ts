import { MsgSend } from "@terra-money/terra.js";
import setup from '../library';

async function SwapLunaNatively() {
  const { wallets, client } = await setup()
  const fromWallet = wallets.wallet1
  const toWallet = wallets.wallet2

  const send = new MsgSend(
    fromWallet.key.accAddress, // from
    toWallet.key.accAddress, // to
    { uluna: "6000000" }
  );

  const tx = await wallets.wallet2.createAndSignTx({ msgs: [send] });
  const result = await client.tx.broadcast(tx);

  console.log(result);
}
SwapLunaNatively()
