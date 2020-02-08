import React from 'react';
import styles from './TokenGallery.module.scss';

import Token from '../Token';

export default ({
  tokens,
  soldTokens,
  conversionFunction,
  buyable,
  onBuyToken
}) => {
  return (
    <div className={styles.gallery}>
      {tokens.map(t => (
        <Token
          key={t.id}
          token={t}
          conversionFunction={conversionFunction}
          sold={soldTokens.includes(t.id)}
          buyable={buyable}
          onBuyToken={onBuyToken}
        />
      ))}
    </div>
  );
};
