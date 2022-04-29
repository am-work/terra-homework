import setup from '../library';

async function getBalance() {
    const { wallets, client } = await setup()
    const wallet = wallets.wallet1

    let address = wallet.key.accAddress;
    console.log(address);
    const [balance] = await client.bank.balance(address);
    console.log(balance.toData());
}
getBalance()
