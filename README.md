# Readme

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
4. After a couple of seconds, the script will print the token's signature and signed hash (the latter just for debugging purposes).

