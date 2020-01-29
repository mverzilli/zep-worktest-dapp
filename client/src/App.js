import React, { Component } from 'react';
import getWeb3, { getGanacheWeb3 } from './utils/getWeb3';
import Header from './components/Header/index.js';
import Footer from './components/Footer/index.js';
import Hero from './components/Hero/index.js';
import Web3Info from './components/Web3Info/index.js';
import CounterUI from './components/Counter/index.js';
import TokenList from './components/TokenList/index.js';
import Wallet from './components/Wallet/index.js';
import Instructions from './components/Instructions/index.js';
import { Loader } from 'rimble-ui';

import { solidityLoaderOptions } from '../config/webpack';

import styles from './App.module.scss';

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null
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
          instance = new web3.eth.Contract(Counter.abi, deployedNetwork && deployedNetwork.address);
        }
      }
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
      this.queryBuyerTokens();
    }
    if (instanceWallet) {
      this.updateTokenOwner();
    }
  };

  queryBuyerTokens = async () => {
    const { contract, accounts } = this.state;
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.balanceOf(accounts[0]).call();
    // Update state with the result.
    this.setState({ count: response });
  };

  updateTokenOwner = async () => {
    const { wallet, accounts } = this.state;
    // Get the value from the contract to prove it worked.
    const response = await wallet.methods.owner().call();
    // Update state with the result.
    this.setState({ tokenOwner: response.toString() === accounts[0].toString() });
  };

  // increaseCount = async number => {
  //   const { accounts, contract } = this.state;
  //   await contract.methods.increaseCounter(number).send({ from: accounts[0] });
  //   this.getCount();
  // };

  onBuyToken = async token => {
    console.log("hello");
    const { contract, accounts } = this.state;
    console.log('goodbye');
    console.log(token);

    await contract.methods.awardItem(
      accounts[0],
      token.id,
      token.uri,
      token.price,
      token.signature
    ).send({ from: accounts[0], value: token.price });
  }

  // decreaseCount = async number => {
  //   const { accounts, contract } = this.state;
  //   await contract.methods.decreaseCounter(number).send({ from: accounts[0] });
  //   this.getCount();
  // };

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
      ganacheAccounts,
      contract,
      web3
    } = this.state;

    const updgradeCommand = networkType === 'private' && !hotLoaderDisabled ? 'upgrade-auto' : 'upgrade';

    if (!accounts) return <div>Loading...</div>;

    return (
      <div className={styles.wrapper}>
        {!web3 && this.renderLoader()}
        {web3 && contract && (
          <div className={styles.contracts}>
            <h1>MagicToken Contract is good to Go!</h1>
            <TokenList
              buyer={accounts[0]}
              onTokenClick={async t => this.onBuyToken(t)}
              contract={contract}
              web3={web3}
            />
            <div className={styles.widgets}>
              <Web3Info {...this.state} />
              <CounterUI decrease={this.decreaseCount} increase={this.increaseCount} {...this.state} />
            </div>
            {this.state.balance < 0.1 && (
              <Instructions ganacheAccounts={ganacheAccounts} name="metamask" accounts={accounts} />
            )}
            {this.state.balance >= 0.1 && (
              <Instructions ganacheAccounts={this.state.ganacheAccounts} name={updgradeCommand} accounts={accounts} />
            )}
          </div>
        )}
      </div>
    );
  }

  render() {
    return (
      <div className={styles.App}>
        {this.renderBody()}
      </div>
    );
  }
}

export default App;
