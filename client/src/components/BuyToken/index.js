import React, { Component, Fragment } from 'react';
import Grid from '../Grid';
import { Heading, Card, Text, style, Button } from 'rimble-ui';
import styles from './BuyToken.module.scss'
import Token from '../Token';
import Loader from '../Loader';

export default class BuyToken extends Component {
  render() {
    const {
      token,
      conversionFunction,
      account,
      error,
      receipt,
      confirmation
    } = this.props;

    let prompt = "Confirm your purchase in MetaMask and wait a few seconds";

    if (error) {
      if (error === 'user-rejected') {
        prompt = "You cancelled the purchase in MetaMask"
      } else {
        prompt = "The purchase was canceled"
      }
    } else if (confirmation) {
      prompt = `Congrats! Token #${token.id} is now yours!`
    } else if (receipt) {
      prompt = "Confirming your purchase..."
    }


    return (
      <Grid>
        <Card className={styles.container}>
          <div className={styles.heading}>
            <Heading.h3 className={styles.item}>{prompt}</Heading.h3>
            {!error && !receipt && !confirmation && <Text className={styles.item}>Double check the details here - this transaction can't be refunded</Text>}
          </div>
          <div className={styles.tokenDetails}>
            {!error && !confirmation && <Text className={styles.item}>You're buying this token:</Text>}
            <Token
              buyable={false}
              conversionFunction={conversionFunction}
              token={token}
              sold={false}
              className={styles.item}
            />
          </div>
          <div className={styles.otherDetails}>
            {!error && !receipt && !confirmation && (
              <Loader
                label="Waiting for confirmation (make sure to look for the MetaMask popup and confirm your transaction!)"
              />)}
            {!error && receipt && !confirmation && <Loader label="Confirming purchase..." />}
            {!error && confirmation && this.renderSuccess()}
            <Text>Your account is: {account}</Text>
            {error && this.retryPurchase()}
          </div>
        </Card>
      </Grid>
    );
  }

  renderSuccess() {
    const { onBackToGallery } = this.props;

    return (
      <div className={styles.success}>
        <Text>Congrats the token is yours! Get back to the gallery to purchase more!</Text>
        <Button onClick={() => onBackToGallery()}>Go back to gallery</Button>
      </div>
    );
  }

  retryPurchase() {
    const { onRetryPurchase, token, onBackToGallery } = this.props;

    return (
      <div className={styles.retryPurchase}>
        <Text>You cancelled the purchase. Still want the token?</Text>
        <Button onClick={() => onRetryPurchase(token)}>Buy</Button>
        <Button.Outline onClick={() => onBackToGallery()}>Go back to gallery</Button.Outline>
      </div>
    );
  }
}
