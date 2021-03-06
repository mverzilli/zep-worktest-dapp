import React, { Fragment } from 'react';
import { Heading } from 'rimble-ui';
import styles from './Buyer.module.scss';
import TokenList from '../TokenList';
import Grid from '../Grid';
import AccountStatus from '../AccountStatus';
import Loader from '../Loader';
import tokenData from '../../data/tokens';
import TokenGallery from '../TokenGallery';

const tokenStatus = (tokens, soldTokens, ownTokens) => {
  let availableTokens = [];
  let userTokens = [];

  if (soldTokens && ownTokens) {
    for (const token of tokens) {
      if (soldTokens.includes(token.id)) {
        if (ownTokens.includes(token.id)) {
          userTokens.push(token);
        }
      } else {
        availableTokens.push(token);
      }
    }
  }

  return { availableTokens, userTokens };
};

export default ({
  soldTokens,
  ownTokens,
  account,
  conversionFunction,
  onBuyToken
}) => {
  const tokens = tokenData["tokens"];

  const { availableTokens, userTokens } = tokenStatus(tokens, soldTokens, ownTokens);

  return (
    <Fragment>
      <AccountStatus account={account} />
      <Grid>
        <div className={styles.catalog}>
          <Heading.h1 className={styles.heading}>
            Get your MagicToken's here!
          </Heading.h1>
          { (!soldTokens || !ownTokens)  && <Loader label="Loading token catalog..." /> }
          { soldTokens && ownTokens && (
            <TokenGallery
              soldTokens={[]}
              tokens={availableTokens}
              conversionFunction={conversionFunction}
              buyable={true}
              onBuyToken={onBuyToken}
              emptyGalleryCopy={"We ran out of tokens! Stay tuned, we'll cook some more soon :)"}
            />) }
        </div>
        <div className={styles.userTokens}>
          <Heading.h2 className={styles.yourTokens}>
            Your tokens
          </Heading.h2>
          { !soldTokens && <Loader label="Loading token catalog..." /> }
          { soldTokens && (
            <TokenGallery
              soldTokens={[]}
              tokens={userTokens}
              conversionFunction={conversionFunction}
              buyable={false}
              emptyGalleryCopy={"You haven't bought tokens so far. Let's fix that! Pick a token from the list above and click 'Buy'. Go go go! :)"}
            />) }
        </div>
      </Grid>
    </Fragment>
  );
};
