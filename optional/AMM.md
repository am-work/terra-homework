# Automated Market Maker Idea

This is an optional exercise. It's more open-ended so you are free to do changes
if you want. It has also been reviewed less extensively so it might be less
clear. Use at your own risk, and let us know if you have suggestions.

The idea is build a very basic AMM that’ll allow users to deposit and withdraw
liquidity as well as swap between two tokens. 

### **What is an AMM?**

Automated Market Maker(AMM) is a type of decentralized exchange which is based
on a mathematical formula of price assets. It allows digital assets to be traded
without any permissions and automatically by using liquidity pools instead of
any traditional buyers and sellers which uses an order book that was used in
traditional exchange, here assets are priced according to a pricing algorithm.
For example, Uniswap uses `p * q = k`, where `p` is the amount of one token in the
liquidity pool, and `q` is the amount of the other. Here `k` is a fixed constant
which means the pool’s total liquidity always has to remain the same. For
further explanation let us take an example if an AMM has coin A and Coin B, two
volatile assets, every time A is bought, the price of A goes up as there is less
A in the pool than before the purchase. Conversely, the price of B goes down as
there is more B in the pool. The pool stays in constant balance, where the total
value of A in the pool will always equal the total value of B in the pool. The
size will expand only when new liquidity providers join the pool.

### OPTIONAL:  MINT TOKENS

As a step 0, we can optionally mint the two tokens that we’ll be using in our pool. Alternatively we can skip this step and pick any two available tokens to use.

### DEPOSIT

Next we keep track of a couple variables and set up deposit functionality for tokens. 

```rust
totalShares //Stores the total amount of shares issues for the pool
totalTokenA //Stores the amount of Token1 locked in the pool
totalTokenB //Stores the amount of Token2 locked in the pool
K // Algorithmic constant used to determine price (K=totalTokenA * totalTokenB). We also need to define a few functions to allow depositing tokens as well as getting our balance
getBalance() -> Returns shares
getPoolDetails() -> Returns totalTokenA/B and totalShares
```

The deposit function takes two parameters, amount of token 1 and amount of token 2 the user wants to lock in the pool. If the pool is initially empty then the equivalence rate is set as **_amountTokenA : _amountTokenB** and the user is issued 100 shares for it. Otherwise, it is checked whether the two amounts provided by the user have equivalent value or not. This is done by checking if the two amounts are in equal proportion to the total number of their respective token locked in the pool i.e. **_amountTokenA : totalTokenA :: _amountTokenB : totalTokenB** should hold. 

In layman’s terms, if the current pool has 60 token A and 40 token B, then the user could deposit 6 tokens A, and 4 tokens B since the ratio would be 3:2 as the current pool ratio. 

```rust
fn deposit(_amtTokenA:u64, _amtTokenB:u64) {
	if(totalShares == 0){
		user_shares = 100;
	} else {
		shares_tokenA = (totalShares * _amtTokenA)/ totalTokenA;
		shares_tokenB = (totalShares * _amtTokenB)/ totalTokenB;
		assert!(shares_tokenA == shares_tokenB, "Equal value of tokens must be provided on deposit");
		user_shares = shares_tokenA;
	}
	assert!(shares > 0, "Gotta contribute minimum threshold amount")

	totalTokenA += _amtTokenA;
	totalTokenB += _amtTokenB;
	K = totalTokenA * totalTokenB;
	totalShares += user_shares;
	//mint shares as a token and give them to the user probably
}
```

Withdraw is used when a user wishes to burn a given amount of share to get back
their tokens. Token1 and Token2 are released from the pool in proportion to the
share burned with respect to total shares issued i.e. **share : totalShare ::
amountTokenX : totalTokenX**.

```rust
fn widthdraw(shares:u64) {
	amtTokenA = (shares*totalTokenA)/totalShares;
	amtTokenB = (shares*totalTokenB)/totalShares;
	
	//burn user shares
	totalShares -= shares;
	totalTokenA -= amtTokenA;
	totalTokenB -= amtTokenB;
	k = totalTokenA*totalTokenB;

	//send amtTokenA and amtTokenB back to user
}
```

### SWAP

The Swap Token function uses the formula `p*q = k` to determine a price for a given
token given the other token in the pool. `K`, the value of the pool, should remain
the same before and after the operation. 
This gives us `K = (totalTokenA + amtTokenA)*(totalTokenB - amtTokenB)` and we
get `amtTokenB` from solving this equation. 

It’s important that we also check to make sure that the pool isn’t completely
drained using swaps, else we’ll get errors when computing `K` for deposit and
withdraw. 

```rust
fn swapTokenA(amtTokenA:u64){
	tokenA_postSwap = totalTokenA + amtTokenA;
	totalB_postSwap = K/tokenA_postSwap

	amountTokenB = totalTokenB - totalB_postSwap;
	if(amountTokenB == totalTokenB) {
		//Don't allow max withdraw of token so the pool won't be empty and error out
		amountTokenB -= 1; 
	}

	//Deposit tokenA into pool
	//Send amountTokenB to User
	totalTokenA += amtTokenA;
	totalTokenB -= amountTokenB;

	//K should NOT change
}

fn swapTokenB(){
	//reverse of previous function
}
```