import React, { Fragment } from 'react';
import { EthAddress, Text } from 'rimble-ui';
import Token from '../Token';
import styles from './Seller.module.scss';
import tokens from '../../data/tokens';

export default ({ account, conversionFunction }) => {
  return (
    <Fragment>
      <div className={styles.address}>
        <Text className={styles.ethAddress}>Currently connected to Rinkeby with address</Text>
        <EthAddress className={styles.ethAddress} address={account} textLabels />
      </div>
      <div className={styles.wrapper}>
        <div className={styles.gallery}>
          {
            tokens['tokens'].map((t, i) => (
              <Token token={t} conversionFunction={conversionFunction} sold={i % 2 === 0} />
            ))
          }
        </div>
      </div>
    </Fragment>
  );
};
