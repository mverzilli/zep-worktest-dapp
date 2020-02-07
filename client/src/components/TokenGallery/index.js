import React from 'react';
import styles from './TokenGallery.module.scss';

import Token from '../Token';

export default ({ tokens, soldTokens, conversionFunction, buyable }) => {
  return (
    <div className={styles.gallery}>
      {tokens.map(t => (
        <Token
          token={t}
          conversionFunction={conversionFunction}
          sold={soldTokens.includes(t.id)}
          buyable={buyable}
        />
      ))}
    </div>
  );
};
