# Terra Hacker Week Homework

This repo contains the homework instructions as well as skeleton code that you
can fill in to complete the homework.

## Getting help

If something is not clear or you get stuck, ask for help in the #homework-help
channel on the event's Discord server.

## Organization

The repo is organized as follows:

* `HOMEWORK.md`: The instructions/spec for the homework. Read this README first,
  then read `HOMEWORK.md`.
* `contracts/`: Contains one subdirectory per contract. Each contract contains
  the CosmWasm entrypoints (`instantiate`, `execute`, `query` and `migrate`).
  * `contracts/counter/`: A very simple contract that just stores one counter in the
    blockchain and allows incrementing it. This is not part of the homework but
    it's here in case you want to refer to it since this is the "Hello World"
    contract in Terra.
  * `contracts/cw20_token/`: This is a working CW20 token implementation. It's
    ready to be deployed (you don't need to change the code).
  * `contracts/oracle/`: This is an empty skeleton for the Oracle contract in
    the homework. You are supposed to write the code.
  * `contracts/swap/`: This is an empty skeleton for the first Lemon Swap
    contract in the homework. You are supposed to write the code.
  * `contracts/swap2/`: This is an empty skeleton for the second Lemon Swap
    contract in the homework. You are supposed to write the code.
* `packages/shared/`:  This is a Rust package that can be used from more than
    one of your contracts. It is necessary because contracts cannot depend on
    each other (doing that will cause linker errors). You should add any code
    that you want to access from two or more contracts here.
* `scripts/`: This contains small scripts that call into the Terra blockchain
  using the Terra JS SDK. You can use these scripts for two purposes:
     * To manually test your smart contracts once they have been deployed to
       testnet (i.e. execute your contracts on the blockchain, query their data,
       etc).
     * As examples on how to call the Terra blockchain from JavaScript, which
       will come handy in your future career as a blockchain developer.

## Set up your environment

Note: All commands in this README are to be run from the root of this Git repo,
unless explicitly noted otherwise.

* Install environment tools (Docker, Rust, NodeJS). Follow the standard
  installation instructions for your platform or distro (e.g.
  https://rustup.rs/, https://nodejs.org/en/download/package-manager/,
  https://docs.docker.com/get-docker/). You may already have some of these
  installed; that's OK, but make sure you have a recent version.
* Make sure that you have Rust >= 1.60. You can check your Rust version by running this:
```
$ rustc --version
rustc 1.60.0 (7737e0b5c 2022-04-04)
```
* Install Terra-specific tools. We are going to use Testnet (a.k.a. as
  `bombay-12`), so you don't need to worry about LocalTerra if you see it
  mentioned online. Something like this should install everything you need:
```bash
rustup default stable
rustup target add wasm32-unknown-unknown
cargo install cargo-generate --features vendored-openssl
cargo install cargo-run-script
npm install @terra-money/terrain
npm install scripts/
```

  If you get stuck, read
  https://docs.terra.money/docs/develop/dapp/quick-start/initial-setup.html or
  ask an instructor or another participant for help.
* Create a Terra wallet (basically a Terra address + private key). There
  are two ways to do this:
  * Use the Terra Station Chrome extension (instructions for that are here:
    https://docs.terra.money/docs/learn/terra-station/download/terra-station-extension.html#create-a-wallet).
    The Terra Station extension is a UI tool that lets you create a wallet, see
    its balance, convert Luna to UST, etc. It is recommended to get familiar
    with it, but it's not strictly necessary for this homework.
  * Run the `scripts/native/generate-new-wallet.js` script (more details on how
    to run scripts below). This generates a new key programatically and prints
    it to stdout.
* Once you have created a wallet (and saved a copy of its private key), send
  yourself some Luna using https://faucet.terra.money/.
* Copy the file `keys.terrain.js.sample` to `keys.terrain.js`. Then add your new private key to `keys.terrain.js`. Just add a new entry called
  "myKey" (or whatever name you want, really) similar to the keys that are
  already there. You'll need to remember the name "myKey" for later commands.
  `keys.terrain.js` should NEVER be pushed to a public repo (that is why it is in `.gitignore`) to avoid leaking your new private key! You
  should treat your private key just like a password since anyone that has it
  will be able to take your balance from the blockchain. NEVER publish your
  private keys, even if they are only used on testnet!

## Workflow

In general, your workflow should be as follows:

* Write Rust code inside `contracts/` and `packages/shared`.
* Write unit tests; run them; fix bugs.
* Once your code seems stable enough, **deploy** your contracts for the first
  time to testnet.
* Use the scripts inside `scripts/` to test your contracts on testnet.
* Make some changes on the Rust code and unit tests.
* **Migrate** your contracts on testnet (i.e. re-deploy existing contracts).

Let's see more details about each step.

### Running unit tests

Just run:

```
cargo test
```

This will compile your Rust code and run the unit tests.

See `contracts/counter/contract.rs` for an example of how to write unit tests
and mock dependencies. You can also look at open source projects, for example:
https://github.com/terraswap/terraswap/blob/main/packages/terraswap/src/testing.rs.

### Deploying a smart contract

Once your code seems to be in good shape (it should at least compile and pass
unit tests), you can deploy it to Testnet. You should only deploy each contract
once. The reason is that every time you deploy, a new independent copy of the
contract is created on the blockchain, and usually you only want one copy. (You
can update an existing copy if you modify your code. This is called migrating a
contract and is explained later).

 There are three things you need to do:

1) First, update the file called `config.<contract name>.json`. For example, if
   you want to deploy the `cw20_token`, update `config.cw20_token.json`. You
   only need to update the `InstantiateMsg` section -- this is the data that
   will be passed to the Rust `instantiate` method in your contract. Make sure
   you understand what this data means! If you don't understand it, ask around.
   Do not blindly deploy the contract without changing the `InstantiateMsg`
   section; otherwise you'll run into trouble later.
2) Make sure your wallet has some UST (it's needed to pay for the deployment). You can get some UST by using https://faucet.terra.money/ to send yourself some Luna, then use the Terra Station Chrome extension to convert that Luna to UST (or use `scripts/native/convert-luna-to-ust.js`; see instructions on how to run the scripts in `scripts/` later).
3) Run these commands to deploy it to Testnet:

```bash
CONTRACT_NAME=cw20_token # Replace this with whatever contract you want to deploy
SIGNER=sampleKey1 # Replace with the name of your key from keys.terrain.js.
./build_optimized_wasm.sh
npx @terra-money/terrain deploy $CONTRACT_NAME --signer $SIGNER --set-signer-as-admin --network testnet --config-path config.$CONTRACT_NAME.json --no-rebuild
```


The `./build_optimized_wasm.sh` part just compiles all of your Rust contracts
into optimized WASM files that are small enough to be pushed to Terra (Terra has
limits on how large the compiled WASM bytecode can be). Feel free to look at
this script if you are curious to see how it's done (hint: it's not pretty).

The `npx @terra-money/terrain deploy` part takes the existing optimized WASM
file from the previous step as input (the `--no-rebuild` flag is important!) and
deploys it to Testnet. Here are some important things to know:
  * The `--signer` flag refers to one of the keys in `keys.terrain.js`.
  * The `--set-signer-as-admin` flag means that whoever has the `--signer`
    private key will be able to migrate (i.e. update the code of) this contract
    later.
  * This command will also update `refs.terrain.json` to memorize the address of
    the newly instantiated contract. This will be useful to migrate the contract
    later.

You may find examples online where both compilation and deployment happen with a
single `terrain deploy` command (without the `--no-rebuild` flag), but
unfortunately we couldn't get `terrain` to play nicely with multiple contracts
in the same repo so for now just stick to running both steps separately.

### Migrating a smart contract

Migrating a contract is similar to deploying it, but you should use these
commands instead:

```bash
CONTRACT_NAME=cw20_token # Replace this with whatever contract you want to deploy
SIGNER=sampleKey1 # Replace with the name of your key from keys.terrain.js.
./build_optimized_wasm.sh
npx @terra-money/terrain contract:migrate $CONTRACT_NAME --signer $SIGNER --network testnet --config-path config.$CONTRACT_NAME.json
```

When you migrate a contract like this, the `migrate` Rust method of your
contract will be executed (with the new code), giving you a chance to update
whatever data is stored in the contract to be compatible with the new code.

### Running scripts inside `scripts/`

The `scripts/` directory contains handy scripts that will let you test your contracts, build automation, run one-time operations, etc.

First, copy your private key to `scripts/library.js` (private keys in this file can be imported from other files in the `scripts/` directory, so having your private key in this file will make your life easier since you don't need to copy it to all scripts. Keep in mind that not all scripts need a private key -- public operations like querying a smart contract don't require a private key).

Then run any script you want with this:

```bash
cd scripts/
# You only need to run npm install the first time, to make sure you have all JS dependencies installed.
npm install

# This is the important line that actually executes the script.
node scripts/native/generate-new-wallet.js
```

All the scripts are very simple and take no flags. Just open them and
change whatever you need (e.g. use a different amount, a different wallet, a different contract address, etc).

These scripts are meant to be a playground. You can modify them, copy them,
extend them, chain them, add flags, or whatever makes sense to you. In my case,
I just open them, change the amount/contract address and run them. I find that
simpler than fiddling with flags, but you can change them to do whatever makes
your life easier.

You can also use these scripts as inspiration to build more sophisticated automation, like an off-chain oracle for example. If you want to do that, the most important file to read is `scripts/library.js`; this is were we initialize the `LCDClient` object (the actual JavaScript object that we use to hit the Terra HTTP API).

## Homework

Now that you are done with this README, continue by reading [`HOMEWORK.md`](https://github.com/am-work/terra-homework/blob/master/HOMEWORK.md)!