module.exports = ({ wallets, refs, config, client }) => ({
  getCount: () => client.query("counter", { get_count: {} }),
  increment: (signer = wallets.validator) =>
    client.execute(signer, "counter", { increment: {} }),
  mint: (signer=wallets.validator)=>
    client.execute(signer, "driedmango_token", {mint:{"recipient":"terra1ghuwkhhjck7kp44rw8rtfuhf3nzk8eff5xmmyt", "amount":"100000000"}}),
  balance: () => client.query("driedmango_token", {balance:{"address":"terra1ghuwkhhjck7kp44rw8rtfuhf3nzk8eff5xmmyt"}}),
  getPrice: () => client.query("oracle", { query_price: {} }),
  updatePrice: (signer = wallets.validator) =>
    client.execute(signer, "oracle", { update_price: {"price":102} }),
});



