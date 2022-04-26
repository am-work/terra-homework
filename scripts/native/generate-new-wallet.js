// This script generates a new random Terra private key. Then it prints the
// private key as well as its matching address.
import { client } from '../library.js';

import { MnemonicKey } from "@terra-money/terra.js";

let privateKey = new MnemonicKey();
const wallet = client.wallet(privateKey);

let address = wallet.key.accAddress;
console.log("Your new Terra address is:");
console.log("==========================");
console.log(address + "\n");
console.log("The private key in mnemonic format for this address is:");
console.log("=======================================================");
console.log(privateKey.mnemonic);
