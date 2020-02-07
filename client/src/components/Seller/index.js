import React, { Fragment } from 'react';
import { EthAddress, Text, Loader, Heading } from 'rimble-ui';
import Token from '../Token';
import styles from './Seller.module.scss';
import tokens from '../../data/tokens';

export default ({ account, conversionFunction, soldTokens }) => {
  return (
    <Fragment>
      <div className={styles.address}>
        <Text className={styles.ethAddress}>Currently connected to Rinkeby with address</Text>
        <EthAddress className={styles.ethAddress} address={account} textLabels />
      </div>
      <div className={styles.wrapper}>
        <Heading.h1 className={styles.heading}>
          Token Gallery
        </Heading.h1>
        <Text className={styles.subheading}>Monitor which tokens you have sold so far.</Text>
        { soldTokens ?
          (
            <div className={styles.gallery}>
              {tokens['tokens'].map(t => (
                <Token token={t} conversionFunction={conversionFunction} sold={soldTokens.includes(t.id)} />
              ))}
            </div>
          )
          : (
            <div className={styles.loadingTokens}>
              <Loader size="60px" />
              <Text className={styles.loadingTokensLabel}>Loading token list...</Text>
            </div>
          )
        }
      </div>
    </Fragment>
  );
};
