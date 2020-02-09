import React, { Fragment } from 'react';
import { EthAddress, Text, Loader, Heading } from 'rimble-ui';
import Token from '../Token';
import styles from './Seller.module.scss';
import tokens from '../../data/tokens';
import AccountStatus from '../AccountStatus';
import Grid from '../Grid';
import TokenGallery from '../TokenGallery';

export default ({ account, conversionFunction, soldTokens }) => {
  return (
    <Fragment>
      <AccountStatus account={account} />
      <Grid>
        <Heading.h1 className={styles.heading}>
          Token Gallery
        </Heading.h1>
        <Text className={styles.subheading}>Monitor which tokens you have sold so far.</Text>
        { soldTokens ?
          (
            <TokenGallery
              tokens={tokens['tokens']}
              soldTokens={soldTokens}
              conversionFunction={conversionFunction}
              emptyGalleryCopy={"Wohoo! We're sold out!"}
            />
          )
          : <Loader label="Loading token list..." />
        }
      </Grid>
    </Fragment>
  );
};
