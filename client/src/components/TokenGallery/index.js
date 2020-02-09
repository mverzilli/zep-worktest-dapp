import React from 'react';
import styles from './TokenGallery.module.scss';
import { Text } from 'rimble-ui';
import Token from '../Token';

export default ({
  tokens,
  soldTokens,
  conversionFunction,
  buyable,
  onBuyToken,
  emptyGalleryCopy
}) => {
  if (tokens && tokens.length === 0) {
    return (
      <Text>{emptyGalleryCopy}</Text>
    )
  }

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
