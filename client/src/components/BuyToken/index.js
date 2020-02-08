import React, { Component } from 'react';
import Grid from '../Grid';
import { Heading, Card, Text, style } from 'rimble-ui';
import styles from './BuyToken.module.scss'
import Token from '../Token';
import Loader from '../Loader';

export default class BuyToken extends Component {
  componentDidMount() {

  }

  render() {
    const { token, conversionFunction, account } = this.props;

    return (
      <Grid>
        <Card className={styles.container}>
          <div className={styles.heading}>
            <Heading.h3 className={styles.item}>Confirm your purchase in MetaMask</Heading.h3>
            <Text className={styles.item}>Double check the details here - this transaction can't be refunded</Text>
          </div>
          <div className={styles.tokenDetails}>
            <Text className={styles.item}>You're buying this token:</Text>
            <Token
              buyable={false}
              conversionFunction={conversionFunction}
              token={token}
              sold={false}
              className={styles.item}
            />
          </div>
          <div className={styles.otherDetails}>
            <Loader label="Waiting for confirmation (look for the MetaMask popup)" />
            <Text>Your account is: {account}</Text>
          </div>
        </Card>
      </Grid>
    );
  }
}