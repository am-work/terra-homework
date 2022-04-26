module.exports = ({ wallets, refs, config, client }) => ({
  getCount: () => client.query("counter", { get_count: {} }),
  increment: (signer = wallets.validator) =>
    client.execute(signer, "counter", { increment: {} }),
  mint: (signer=wallets.validator)=>
    client.execute(signer, "cw20_token", {mint:{"recipient":"terra1c05zxkr8ee40tf2har8yksgk7gdjjmleudeqhq", "amount":"1000000000"}}),
  balance: () => client.query("cw20_token", {balance:{"address":"terra1c05zxkr8ee40tf2har8yksgk7gdjjmleudeqhq"}}),
  getPrice: () => client.query("oracle", { query_price: {} }),
  updatePrice: (signer = wallets.validator) =>
    client.execute(signer, "oracle", { update_price: {"price":102} }),
});



