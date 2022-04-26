import { client, wallets } from '../library.js';

const contract = "terra1f7vnhhk24jmaxp2tdgf906yy980yg3c4h8f05h";

const response = await client.wasm.contractQuery(contract, { query_token_address: {} });

console.log(response);