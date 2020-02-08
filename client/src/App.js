import React, { Component } from 'react';
import getWeb3, { getGanacheWeb3 } from './utils/getWeb3';
import Header from './components/Header/index.js';
import Footer from './components/Footer/index.js';
import Hero from './components/Hero/index.js';
// import Web3Info from './components/Web3Info/index.js';
import CounterUI from './components/Counter/index.js';
import TokenList from './components/TokenList/index.js';
import Wallet from './components/Wallet/index.js';
import Instructions from './components/Instructions/index.js';
import { Loader } from 'rimble-ui';

import { solidityLoaderOptions } from '../config/webpack';

import styles from './App.module.scss';
import Seller from './components/Seller';
import Buyer from './components/Buyer';
import BuyToken from './components/BuyToken';

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    route: { id: 'seller' },
    soldTokens: null,
    ownTokens: null
  };

  getGanacheAddresses = async () => {
    if (!this.ganacheProvider) {
      this.ganacheProvider = getGanacheWeb3();
    }
    if (this.ganacheProvider) {
      return await this.ganacheProvider.eth.getAccounts();
    }
    return [];
  };

  componentDidMount = async () => {
    const hotLoaderDisabled = solidityLoaderOptions.disabled;
    let Counter = {};
    let Wallet = {};
    try {
      Counter = require('../../contracts/MagicToken.sol');
      Wallet = require('../../contracts/Wallet.sol');
    } catch (e) {
      console.log(e);
    }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      let ganacheAccounts = [];
      try {
        ganacheAccounts = await this.getGanacheAddresses();
      } catch (e) {
        console.log('Ganache is not running');
      }
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const networkType = await web3.eth.net.getNetworkType();
      const isMetaMask = web3.currentProvider.isMetaMask;
      let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]) : web3.utils.toWei('0');
      balance = web3.utils.fromWei(balance, 'ether');
      let instance = null;
      let instanceWallet = null;
      let deployedNetwork = null;
      if (Counter.networks) {
        deployedNetwork = Counter.networks[networkId.toString()];
        if (deployedNetwork) {
          window.contractAbi = Counter.abi;
          instance = new web3.eth.Contract(Counter.abi, deployedNetwork && deployedNetwork.address);
        }
      }
      window.contractInstance = instance;
      console.log(instance);
      if (Wallet.networks) {
        deployedNetwork = Wallet.networks[networkId.toString()];
        if (deployedNetwork) {
          instanceWallet = new web3.eth.Contract(Wallet.abi, deployedNetwork && deployedNetwork.address);
        }
      }
      if (instance || instanceWallet) {
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState(
          {
            web3,
            ganacheAccounts,
            accounts,
            balance,
            networkId,
            networkType,
            hotLoaderDisabled,
            isMetaMask,
            contract: instance,
            wallet: instanceWallet,
          },
          () => {
            this.refreshValues(instance, instanceWallet);
            setInterval(() => {
              this.refreshValues(instance, instanceWallet);
            }, 5000);
          },
        );
      } else {
        this.setState({
          web3,
          ganacheAccounts,
          accounts,
          balance,
          networkId,
          networkType,
          hotLoaderDisabled,
          isMetaMask,
        });
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  refreshValues = (instance, instanceWallet) => {
    if (instance) {
      this.queryTokens();
    }
    if (instanceWallet) {
      this.updateTokenOwner();
    }
  };

  queryTokens = async () => {
    const { contract, accounts } = this.state;
    // Get the value from the contract to prove it worked.
    const totalSupply = await contract.methods.totalSupply().call();

    let indexes = [];
    for (let index = 0; index < totalSupply; index++) {
      indexes.push(index);
    }

    const soldTokens = await Promise.all(indexes.map(tokenIndex => {
      return contract.methods.tokenByIndex(tokenIndex).call();
    }));

    const ownTokensSupply = await contract.methods.balanceOf(accounts[0]);
    const ownTokens = await Promise.all([...Array(ownTokensSupply).keys()].map(tokenIndex => {
      return contract.methods.tokenOfOwnerByIndex(accounts[0], tokenIndex).call();
    }));

    // Update state with the result.
    this.setState({ soldTokens, ownTokens });
  };

  updateTokenOwner = async () => {
    const { wallet, accounts } = this.state;
    // Get the value from the contract to prove it worked.
    const response = await wallet.methods.owner().call();
    // Update state with the result.
    this.setState({ tokenOwner: response.toString() === accounts[0].toString() });
  };

  onBuyToken = async token => {
    const { accounts, contract } = this.state;

    this.setState({
      route: {
        id: 'buyToken',
        currentToken: token
      }
    }, async () => {
      await contract.methods.awardItem(
        accounts[0],
        token.id,
        token.uri,
        token.price,
        token.signature
      ).send({ from: accounts[0], value: token.price });
    });
  }

  renounceOwnership = async number => {
    const { accounts, wallet } = this.state;
    await wallet.methods.renounceOwnership().send({ from: accounts[0] });
    this.updateTokenOwner();
  };

  renderLoader() {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, and contract...</h3>
        <p> Unlock your metamask </p>
      </div>
    );
  }

  renderBody() {
    const {
      hotLoaderDisabled,
      networkType,
      accounts,
      route,
      web3,
      soldTokens,
      ownTokens,
      contract
    } = this.state;

    const updgradeCommand = networkType === 'private' && !hotLoaderDisabled ? 'upgrade-auto' : 'upgrade';

    if (!accounts || !web3) return <div>Loading...</div>;

    switch (route.id) {
      case 'buyer':
        return (
          <Buyer
            account={accounts[0]}
            conversionFunction={web3.utils.fromWei}
            soldTokens={soldTokens}
            ownTokens={ownTokens}
            onBuyToken={token => this.onBuyToken(token)}
          />
        );
      case 'buyToken':
        return (
          <BuyToken
            token={route.currentToken}
            conversionFunction={web3.utils.fromWei}
            account={accounts[0]}
          />
        );
      default:
        return (
          <Seller
            account={accounts[0]}
            conversionFunction={web3.utils.fromWei}
            soldTokens={soldTokens}
          />
        );
    }
  }

   render() {
    const { route } = this.state;
    return (
      <div className={styles.App}>
        <Header current={route.id} onSwitchPage={page => this.onSwitchPage(page)} />
        {this.renderBody()}
      </div>
    );
  }

  onSwitchPage(page) {
    this.setState({route: { id: page }});
  }
}

export default App;
