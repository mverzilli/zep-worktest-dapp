import React, { Component } from 'react';
import { Button } from 'rimble-ui';
import styles from './Instructions.module.scss';

export default class Instructions extends Component {
  renderCounterSetup() {
    return (
      <div className={styles.instructions} />
    );
  }

  render() {
    return this.renderCounterSetup();
  }
}
