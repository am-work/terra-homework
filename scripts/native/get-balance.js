import { client, wallets } from '../library.js';

let address = wallets.wallet1.key.accAddress;
console.log(address);
const [balance] = await client.bank.balance(address);
console.log(balance.toData());