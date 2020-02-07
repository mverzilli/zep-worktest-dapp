import React from 'react';
import styles from './Grid.module.scss';

export default ({children}) => {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  );
}
