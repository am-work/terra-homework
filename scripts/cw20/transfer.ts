import setup from '../library';

import { MsgExecuteContract } from "@terra-money/terra.js";

async function transfer() {

  const { client, wallets, network } = await setup()
  const { cw20Contract } = network
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
        recipient: wallets.wallet2.key.accAddress,
        // Amount of tokens to transfer, in microunits
        amount: "1000000",
      },
    },
  );

  const tx = await wallet.createAndSignTx({ msgs: [msg] });
  const result = await client.tx.broadcast(tx);

  console.log(result);

}

transfer()
