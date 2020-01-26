import React, { Fragment } from 'react';
import { Button } from 'rimble-ui';
import styles from './TokenList.module.scss';

const buildToken = (id) => {
  return {
    id,
    owner: null
  }
}

const allTokens = [
  buildToken(1),
  buildToken(2),
  buildToken(3),
  buildToken(4)
]

const resolveOwnership = (buyer, token) => {
  if (token.owner && token.owner === buyer) {
    return "is yours";
  }

  return "is not yours";
}

export default (buyer) => {
  return (
    <Fragment>
      {
        allTokens.map(t => {
          return (
            <div className={styles.token} key={t.id}>
              Token {t.id} {resolveOwnership(buyer, t)}
              {
                !t.owner ? (<Button className={styles.tokenBuy} onClick={() => this.props.increase(1)} size="small">Buy!</Button>) : null}
            </div>
          )
        })
      }
    </Fragment>
  );
};