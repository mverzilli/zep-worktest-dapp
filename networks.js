require('dotenv').config();
// const mnemonic = process.env.MNEMONIC;

const { projectId, mnemonic } = require('./secrets.json');

const HDWalletProvider = require("truffle-hdwallet-provider");
// Create your own key for Production environments (https://infura.io/)
const INFURA_ID = process.env.INFURA_ID || 'd6760e62b67f4937ba1ea2691046f06d';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    rinkeby: {
      provider: () => new HDWalletProvider(
        mnemonic, `https://rinkeby.infura.io/v3/${projectId}`
      ),
      networkId: 4,
      gasPrice: 10e9
    },
  },
};
