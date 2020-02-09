# Readme

This repo contains a contract that manages a non-fungible ERC-721 token we very creatively named `MagicToken` and dapp to interact with it as an end user.

Tokens are minted upon purchase, so they need to be generated and signed off chain. There's a couple of utilities in this repo to help with that. The contract verifies the signature of the token the user intends to purchase before minting it. Of course it also validates the token is actually available.

The dapp is built upon Zeppelin's Starter Kit tutorial project (https://docs.openzeppelin.com/starter-kits/tutorial). As a consequence, and because of time limitations, there certainly is a lot of code that could be removed to tidy up the implementation.

## Using the dapp

If you just want to interact with the dapp, head to: https://mverzilli.github.io/zep-worktest-dapp.

## About the dapp

The dapp has two main entry points you can see in the navigation header. One is "Seller" and other one is "Buyer". This navigation scheme is just a convenience in the context of the worktest and not really how it'd would look in a real world situation.

In such a real world situation, you'd probably build two dapps, one for the Seller and the other one for Buyers. That is of course provided you are not interested in helping users resell their tokens.

For the purposes of this project, think of "Seller" and "Buyer" as two different apps.

### Seller

The Seller page is simply a listing of all tokens, detailing which ones were sold and which ones haven't been yet.

### Buyer

Most of this project's features are provided through this entry point. This page displays two different listings of tokens:

1. Tokens available for purchase.
2. Tokens owned by the current account.

The list of tokens for purchase lets you trigger the token purchase flow. The token purchase flow handles the following aspects:

1. User rejection of the transaction at MetaMask.
2. Receipt and confirmation monitoring.
3. Navigating back to the gallery (or retrying in case of accidental or unwanted rejection).

### Out of scope

There's arguably a lot more that should be done would this dapp be intended for production. I'll list here just some of the shortcomings I'm aware of and I'd have liked to have enough time to address:

1. Handling of wallet and network issues (it's currently assuming the happy path where you already have MetaMask set up, are connected to Rinkeby, and have an account there).
2. Microinteractions to deal with more nuanced cases: eg someone front ran you, or the transaction got rolled back even when there were one or more confirmations (the token listings should be truthful nevertheless, I'm not applying optimistic UI updates there).
3. Some niceties such as displaying ETH to USD current rates, your balance in comparison to the price of the token you're buying, etc.
4. A ton of UI cosmetics love.

## Developing the project

To Be Expanded: Setting up the dev env

## Configuring Infura

This project assumes you have deployed an instance of the `MagicToken` contract to the Rinkeby test network.

To do so, follow the steps described here: https://docs.openzeppelin.com/learn/connecting-to-public-test-networks#accessing-a-testnet-node.

Note that it is important that at the end of this configuration you have a `secrets.json` file at the root level of the project with proper `mnemonics` and `projectId` keys, as there are other project artifacts that rely on this.


## Deploying the contract

Use the OpenZeppelin CLI to deploy MagicToken to Rinkeby. Important: use the first address you have in the network to deploy this contract. Other artifacts in the project asume that will be the owner of the contract and will fail otherwise.

See https://docs.openzeppelin.com/learn/deploying-and-interacting#deploying-a-smart-contract for more details.

## Generating signed tokens for the app

For simplicity, at the moment tokens are embedded in the application source code. For the tokens to be buyable, they need to have been signed by the contract owner. This project includes a js script that provides the signing functionality.

Before running the script, there are some necessary configuration steps:

1. [Configure Infura](#configuring-infura)
2. [Deploy the MagicToken contract to Rinkeby](#deploying-the-contract). Write down the address of the contract you deployed, as it is a necessary parameter for this script.
3. Invoke the script by running `npx run signToken.js` and setting the following environment variables:
   1. CONTRACT_ADDRESS: the hex address of the MagicToken you just deployed.
   2. TOKEN_ID: the id for the token you want to sign.
   3. TOKEN_URI: the uri of the token you want to sign.
   4. TOKEN_PRICE: the price for the token you want to sign.
4. After a couple of seconds, the script will print the token object. You can copy it from the console and add it to the `data/tokens.json` file, so the dapp picks it up.

