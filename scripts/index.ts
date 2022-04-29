import setup from './library';

async function index() {
    const { wallets, client, network } = await setup()

    console.log("Run other scripts...");
}

index()
