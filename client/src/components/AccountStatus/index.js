import React from 'react';
import styles from './AccountStatus.module.scss';
import { Text, EthAddress } from 'rimble-ui';

export default ({account}) => {
  return (
    <div className={styles.address}>
      <Text className={styles.ethAddress}>Currently connected to Rinkeby with address</Text>
      <EthAddress className={styles.ethAddress} address={account} textLabels />
    </div>
  );
}
