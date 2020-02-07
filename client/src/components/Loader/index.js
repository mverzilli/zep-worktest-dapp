import React from 'react';
import styles from './Loader.module.scss';
import { Loader, Text } from 'rimble-ui';

export default ({ label }) => {
  return (
    <div className={styles.loading}>
      <Loader size="60px" />
      <Text className={styles.loadingLabel}>{label}</Text>
    </div>
  );
}