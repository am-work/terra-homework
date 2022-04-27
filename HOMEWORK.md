### **Part 0: Env setup**

Read `README.md`!

### Part 1: Deploy Lemon Tokens CW20 contract

- **Goal:** Deploy a contract that supports a fungible token.
- **Skills you’ll practice in this section:**
    - Compiling a smart contract to .wasm
    - Deploying a smart contract to Testnet (a.k.a. `bombay-12`)
    - Using [https://finder.terra.money/testnet/](https://finder.terra.money/testnet/)
    - Querying/Executing a smart contract
- You are going to create a fungible token. Pick a unique name for your token. We are going to use the name “Lemon” throughout the homework, but your token could be called whatever you want. It could be a fruit, metal, chemical element, object or just a made-up word.
- Get familiar with the CW20 spec:
  [https://github.com/CosmWasm/cw-plus/blob/main/packages/cw20/README.md](https://github.com/CosmWasm/cw-plus/blob/main/packages/cw20/README.md).
  This is a spec for fungible tokens. This is similar to the ERC-20 standard
  from the Ethereum world, if you are familiar with that.
- Deploy the `contracts/cw20_token` contract (see intructions in `README.md` on
  how to deploy a contract). The code in `contracts/cw20_token` is a working
  implementation of the CW20 spec, so you don't need to modify the code. I
  recommend reading the code to understand how it works. You'll also need to
  take a look at the `InstantiageMsg` struct to understand what fields to
  provide when deploying the contract.
- Confirm you see your contract on Terra Finder (look it up by address):
  https://finder.terra.money/testnet/
- Find a way to get some Lemon tokens to your wallet (Hint: since you are the
  one deploying the `cw20_token` contract, you control what’s passed to the
  `InstantiateMsg`, so you have two options: 1) use the `initial_balances` field
  or
  2) use the `mint` field to declare yourself a minter and mint tokens for your
  personal wallet. After the contract is deployed, you can write a script in
  `scripts/` to call the Mint operation in your contract.)
- Query your new contract for your Lemon balance (pass your wallet’s address).
- Query the Lemon balance for a friend’s wallet (it should be 0).
- Mint some Lemon tokens and give them to your friend, or use `Transfer` to send
  them from your balance (or both!).
- Query the Lemon balance for your friend’s address (it should be > 0 now).

- **End result of this section:**
    - You have a CW20 contract deployed on Testnet and you understand how to use
      it (you might not understand how it’s implemented internally; that’s OK.
      But free to read the code if you are curious.)

### Part 2: On-chain Oracle Contract

- **Goal:** Write a smart contract that allows importing off-chain data into the
  blockchain
- **Skills you’ll practice in this section:**
    - Executing a smart contract
    - Restricting a contract’s endpoint to specific authorized callers
    - Writing and reading from storage inside the contract
- Write and deploy an oracle contract that tracks the price of Lemons in Luna (Lemon/Luna exchange rate). Use `contracts/oracle` as a skeleton.
- The interface should look something like this:

```rust
enum ExecuteMsg {
  // Stores the given price inside the contract. This price represents how many
  // Lunas you need to provide in exchange for one Lemon.
  // If a price already exists, it is overwitten.
  // Private endpoint (only the owner can call).
  UpdatePrice(new_price: Uint128)
}

enum QueryMsg {
  // Returns the most recently stored price.
  // Public endpoint (like all query methods).
  GetPrice()
}
```

- You can write a script in `scripts/` to write the contract on Testnet. The
  price is completely arbitrary and you can set it to whatever you want. It
  doesn't matter how often the price is updated (it's fine to manually update
  the price once a week. It's also fine to write a script that writes a new
  price every second).
- Write a script in `scripts/` to read the price you just wrote and confirm your
  contract is behaving as expected.
- The goal here is to ilustrate how an oracle works in real life. The important
  concept to grasp is that there is an off-chain process (e.g. you, or a script
  you wrote) that from time to time writes data into the blockchain so that
  smart contracts can read it (Remember, smart contracts can ONLY read that that
  exists in the blockchain; they cannot read external data)

- **End result of this section:**
    - At this point you should have these 2 contracts deployed:
        - Lemon CW20 contract: tracks balances of all Lemon tokens.
        - Lemon Oracle contract: knows the “fair price” of Lemons (in Lunas).
          Note that the “fair price” here is coming from an external off-chain
          data source that we are calling the Oracle. Oracle in this context
          just means “someone we trust blindly”. In a real life scenario you’d
          want to make sure you trust the Oracle that is writing prices to the
          blockchain. For example, Pyth is an Oracle that writes prices into
          multiple blockchains, and it has a decentralized (but off-chain)
          mechanism to make it trustworthy.

### Part 3: Lemon Swap

- **Goal:** Write and deploy a contract that supports selling Lemons at the price stored in the Oracle contract.
- **Skills you’ll practice in this section:**
    - Executing a contract and passing native coins (Luna) to it
    - Querying a contract from another contract
    - Checking for error conditions (e.g. not enough money passed in to complete the transaction)

Write a smart contract with this interface (use `contracts/swap` as a skeleton):

```rust
enum ExecuteMsg {
  // Attempts to buy Lemons. Caller must pass some Luna with this ExecuteMsg
  // and should receive some Lemons in exchange. This contract keeps the Luna.
  // Internally, this method queries the price from the Oracle contract, then
  // computes how many Lemons to send to the buyer (according to the current
  // price and how much Luna they sent).
  // Fails if this contract doesn't own enough Lemons in the CW20 contract.
  // Public endpoint (anyone can call).
  BuyLemons()

  // Withdraws Luna that has been accumulated over time from selling Lemons.
  // Sends that Luna to the caller.
  // Private endpoint (only owner can call).
  WithdrawLuna(amount)
}
```

After the contract is deployed, try this:

- Transfer some Lemons into your LemonSwap contract (call the `Transfer` or `Mint` operation on the CW20 contract) to "stock up" the contract. The contract needs to have some Lemons in order to be able to sell them!
- Ask a friend to buy some of your Lemons (they will provide Luna to your Lemon Swap contract)
- Buy some Papayas (or whatever their token is called) from a friend’s similar Papaya Swap contract.

**End result of this section:**

At this point, you should have 3 contracts deployed:

- Lemon CW20 contract
- Lemon Oracle contract
- Lemon Swap: allows people who are interested in buying Lemons to buy them from you (without you having to manually intervene) by giving you Lunas.

### Part 4: Delegating Luna received from selling Lemons (Lemon Swap v2)

- **Goal:** Learn how staking/delegating Luna to validators work.
- **Skills you’ll practice in this section:**
    - Delegating Luna from a smart contract
    - Undelegating Luna from a smart contract
    - Claiming rewards from delegated Luna
    - Converting native stablecoins to Luna


So far, your Lemon Swap contract is able to automatically sell Lemons in exchange for Luna. Over time, it will accumulate a balance in Luna (especially if you are not calling `WithdrawLuna` frequently). This Luna is safe and yours to keep, but it is just sitting idle inside your contract which is not very productive.

You will now change the Lemon Swap contract to delegate your sitting Luna with a Luna validator. This will be a more productive use of your Luna since your contract will now accrue delegation rewards.

- Create a new contract in `contracts/swap2`. It's fine to use your existing code from `contracts/swap` as an example.
- The interface should look something like this:

```rust
enum ExecuteMsg {
  // Same as before, but now the contract immediately delegates any Luna
  // that was received with a Validator of your choice.
  BuyLemons2()

  // - Calls WithdrawDelegatorReward to receive any accrued rewards from
  //   Luna that was delegated inside BuyLemons2. (This will make the
  //   contract immediately receive rewards in possibly any Terra native
  //   coin (UST, KRT, GBT, etc)).
  // - Converts all those native balances to Luna.
  // - Sends `amount` Luna to caller. Any remaining Luna balance is kept inside
  //   the contract.
  // Private endpoint (only owner can call).
  WithdrawLuna2(amount)

  // Starts the undelegation process of `amount` Luna that was previously
  // delegated in BuyLemons2. This process will take 21 days (i.e.
  // after 21 days the Luna will magically appear in the contract and
  // can be withdrawn with WithdrawLuna2).
  // Private endpoint (only owner can call).
  StartUndelegation2(amount)
}
```

- You can choose a validator from [https://bombay.stake.id/](https://bombay.stake.id/#/). e.g. [https://finder.terra.money/testnet/validator/terravaloper19ne0aqltndwxl0n32zyuglp2z8mm3nu0gxpfaw](https://finder.terra.money/testnet/validator/terravaloper19ne0aqltndwxl0n32zyuglp2z8mm3nu0gxpfaw).
- Just make sure to choose a validator that **doesn't have a 100% comission**, otherwise you won't accrue any rewards!
- Here are some code pointers of how to do all the operations needed. Look for these keywords on open-source projects like [Prism](https://github.com/prism-finance/prism-contracts), TerraSwap, Anchor, etc if you need examples on how to do things and mimic what they are doing. Finding examples is probably the hardest part of Terra development! If you get stuck, ask for help.

    - Converting any native stable coin to Luna:
        - [`terra_cosmwasm::create_swap_msg`](https://github.com/prism-finance/prism-contracts/blob/cff1a14cf7d136de19c43a4b01c05a89ec94c409/contracts/prism-yasset-staking/src/swaps.rs#L44)
    - Delegate:
        - [`CosmosMsg::Staking(StakingMsg::Delegate`](https://github.com/prism-finance/prism-contracts/blob/cff1a14cf7d136de19c43a4b01c05a89ec94c409/contracts/prism-vault/src/bond.rs#L131)
    - Undelegate:
        - [`CosmosMsg::Staking(StakingMsg::Undelegate`](https://github.com/Anchor-Protocol/anchor-bAsset-contracts/blob/70197ff8caddf515952f5696a487fc749c6f48fd/contracts/anchor_basset_hub/src/unbond.rs#L357)
    - Rewards:
        - [`SetWithdrawAddress`](https://github.com/prism-finance/prism-contracts/blob/cff1a14cf7d136de19c43a4b01c05a89ec94c409/contracts/prism-vault/src/config.rs#L144)
        - [`WithdrawDelegatorReward`](https://github.com/prism-finance/prism-contracts-private/blob/cff1a14cf7d136de19c43a4b01c05a89ec94c409/contracts/prism-vault/src/contract.rs#L306)


### **HOMEWORK TECHNICALLY ENDS HERE**. Everything below is optional. These optional parts are more open-ended and you are mostly on your own. Make sure you have mastered everything above before trying these.

### (Optional) Stretch: Part 5: Constant Product Automated Market Maker

Implement a constant-product AMM using [https://www.notion.so/Automated-Market-Maker-Tutorial-b439ae63e7ee448e9e27ca9ec530ebe5](https://www.notion.so/Automated-Market-Maker-Tutorial-b439ae63e7ee448e9e27ca9ec530ebe5) as guideline.

### (Optional) Stretch: Part 6: AMM with oracle-based safety checks

- start with the existing AMM implementation from previous step
- add additional pool config for an oracle contract address (Part 2)
- open ended (?): devise and implement modified AMM logic that incorporates oracle price to protect against the pool bleeding to arbitrageurs.  possible directions:
    - modify the swap method to return less output quantity if the oracle price indicates the trade is negative EV for the pool (effectively higher fee for arb trades)
    - pool maintains arbitrage protection positions which tokens are (virtually) transferred to/from prior to processing swaps such that the pool balances start close to the oracle price when each swap is calculated.  there would be bounds placed on the magnitude of these positions.

### Optional side quests (if you’ve completed everything else):

- **Oracle contract:**
    - support a list of approved publishers and track last price update from each
    - some form of simple aggregation logic to get a collective price that can be queried (e.g. median price)
