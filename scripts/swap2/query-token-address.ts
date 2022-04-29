import setup from '../library';

async function queryTokenAddress() {
    const { client, network } = await setup()
    const contract = network.swapContract

    const response = await client.wasm.contractQuery(contract, { query_token_address: {} });

    console.log(response);
}
queryTokenAddress()
