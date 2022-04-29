import fetch from 'isomorphic-fetch';
import { LCDClient, Wallet } from '@terra-money/terra.js';
import { MnemonicKey } from '@terra-money/terra.js';

const walletData: { keyName: { mnemonic: string } } = require("../keys.terrain")
import networks from '../networks'

async function setup() {
  const { local, bombay, mainnet } = networks
  const network = bombay

  const gasPrices = await fetch(`${network.fcdUrl}/v1/txs/gas_prices`);
  const gasPricesJson = await gasPrices.json();

  // LCD stands for "Light Client Daemon". This is how you talk to Terra from JS.
  const client = new LCDClient({
    URL: network.lcdUrl, // "https://bombay-lcd.terra.dev/", // Use "https://lcd.terra.dev" for prod "http://localhost:1317" for localterra.
    chainID: network.chainId, // "bombay-12", // Use "columbus-5" for production or "localterra".
    gasPrices: { uluna: gasPricesJson['uluna'] }, // Always pay fees in Luna. You can change this to pay fees in other currencies like UST, if you prefer.
    gasAdjustment: network.gasAdjustment, // Increase gas price slightly so transactions go through smoothly.
  });

  // transforms the wallets in ../keys.terrain.js into an object with
  const wallets = Object.entries(walletData)
    .reduce<{ [walletName: string]: Wallet }>((accum, wallet) => {
      accum[wallet[0]] = client.wallet(new MnemonicKey({
        mnemonic: wallet[1].mnemonic
      }))
      return accum
    }, Object())

  return { client, wallets, network };
}

export default setup
