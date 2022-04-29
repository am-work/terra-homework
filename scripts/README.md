# Playground Scripts

This directory contains short scripts that call into the Terra blockchain.

This gives you more flexibility than using the Terrain framework. Feel free to
modify existing scripts or add new ones.

The examples at https://docs.terra.money/docs/develop/sdks/terra-js/common-examples.html can be pretty handy.


## Private keys

Configure your private keys in [/keys.terrain.js](/keys.terrain.js).

## Network config

Configure your network details in [/networks.ts](/networks.ts).

Choose which network is passed to the LCD client in [./library.ts](./library.ts)

## How to run

```bash
# From git repo root
cd scripts
npm install
npn run get-balance
```


You may also run these scripts with the VSCode NodeJS debugger. Press `F5`, or start the debugger from the debug pane, then choose the script to run. You can set breakpoints in scripts, and use all the VSCode debugger features. See `.vscode/launch.json` for the debugger configuration, or to register new scripts.
