#!/bin/bash

# This should be run from the root of the git repo.

# This command takes all the Rust packages in this repo as input, and compiles
# them to WASM bytecode. Then it runs an optimizer that somehow makes those WASM
# files smaller (this is necessary because Terra has limits on how large a
# compiled smart contract can be, and by default Rust will produce large WASM
# files). The final output consists of one optimized *.wasm file per contract.
# These are left in the artifacts/ subdirectory.
# https://github.com/CosmWasm/rust-optimizer
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/workspace-optimizer-arm64:0.12.6
#  ^ Output is left at artifacts/*.wasm

# Copy artifacts to where `terrain deploy` expects them. This is a bit hacky,
# but unfortunately `terrain deploy` doesn't play nicely with repos that have
# more than one contract.
cp -r artifacts contracts/counter
cp -r artifacts contracts/cw20_token
cp -r artifacts contracts/oracle
cp -r artifacts contracts/swap
cp -r artifacts contracts/swap2