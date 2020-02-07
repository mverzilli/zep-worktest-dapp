import React, { Fragment } from 'react';
import { Button } from 'rimble-ui';
import styles from './TokenList.module.scss';

function fixSignature (signature) {
  // in geth its always 27/28, in ganache its 0/1. Change to 27/28 to prevent
  // signature malleability if version is 0/1
  // see https://github.com/ethereum/go-ethereum/blob/v1.8.23/internal/ethapi/api.go#L465
  let v = parseInt(signature.slice(130, 132), 16);
  if (v < 27) {
    v += 27;
  }
  const vHex = v.toString(16);
  return signature.slice(0, 130) + vHex;
}

const sign = async (web3, contract, address, token) => {
  console.log(token);

  const hash = await contract.methods.hashTokenUri(
    token.id,
    token.uri,
    token.price
  ).call();

  const signature = fixSignature(await web3.eth.sign(hash, address));

  return signature;
};

const buildToken = (web3, contract, address, id) => {
  return {
    id: `${id}`,
    uri: `${id}`,
    price: 1,
    owner: null,
    signature: '0xdcad33b5b85d0814b75e63da0add29a6de9f883c19e00699fbe306a8f5c1b4c26d20db40466838786159e74de17e9b7273915d8a61404f2774ae390f4d6e1bb81b'
  };
}

const resolveOwnership = (buyer, token) => {
  if (token.owner && token.owner === buyer) {
    return "is yours";
  }

  return "is not yours";
}

// For simplicity, we're assuming the buyer is also the seller of the token
// of course this is not realistic, but it's enough to demo the mechanics
// of buying tokens
export default class TokenList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokens: null,
      status: 'init'
    }
  }

  async onTokenSign(t) {
    const { web3, contract, buyer } = this.props;
    const tokens = [...this.state.tokens];

    this.setState({
      status: 'awaiting_signature'
    }, async () => {
      try {
        const signature = await sign(web3, contract, buyer, t);
        t.signature = signature;

        for (let i = tokens; i < tokens.length; i++) {
          const token = tokens[i];

          if (token.id === t.id) {
            tokens[i] = {
              ...t,
              signature
            };
            break;
          }
        }

        this.setState({ tokens, status: 'init' });
      } catch(e) {
        if (e.code === 4001) {
          this.setState({ status: 'init' });
        } else {
          this.setState({ stauts: 'inconsistent' });
        }
      }
    });
  }

  componentDidMount() {
    const { web3, contract, buyer } = this.props;

    const tokens = [
      buildToken(web3, contract, buyer, 1),
      buildToken(web3, contract, buyer, 2),
      buildToken(web3, contract, buyer, 3),
      buildToken(web3, contract, buyer, 4)
    ];

    this.setState({ tokens });
  }

  render() {
    const { buyer, onTokenClick, contract, web3 } = this.props;
    const { tokens, status } = this.state;

    if (!web3 || !tokens) return "Loading tokens...";

    if (status === 'awaiting_signature')  {
      return "Metamask is now asking you to sign a token. \
      It appears as a popup or you can click on the Metamask icon in the top right corner of your browser \
      and find the pending signature request there.";
    }

    if (status === 'inconsistent') {
      return "There was an error when the app tried to interact with your wallet. \
      Don't worry, it's nothing serious, but you should refresh this page to be on the safe side :)."
    }

    return (
      <Fragment>
        {
          tokens.map(t => {
            return (
              <div className={styles.token} key={t.id}>
                Token {t.id} {resolveOwnership(buyer, t)}
                {
                  !t.owner ? (
                    <Fragment>
                      {
                        t.signature ?
                        (
                          <Button
                            className={styles.tokenBuy}
                            onClick={() => onTokenClick(t)}
                            size="small"
                          >
                            Buy!
                          </Button>
                        )
                        :
                        (
                          <Button
                            className={styles.tokenBuy}
                            onClick={() => this.onTokenSign(t)}
                            size="small"
                            variant="danger"
                          >
                            Sign
                          </Button>
                        )
                      }
                    </Fragment>
                  ) : null
                }
              </div>
            )
          })
        }
      </Fragment>
    );
  }
}