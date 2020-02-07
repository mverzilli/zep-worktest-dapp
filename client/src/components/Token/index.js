import React from 'react';
import { Card, Image, Text, Heading } from 'rimble-ui';
import styles from './Token.module.scss';
import magictoken from '../../images/magictoken.png';

export default ({ token, conversionFunction }) => {
  return (
    <Card className={styles.container}>
      <Image maxWidth={100} src={magictoken} />
      <Heading.h3>Token #{token.id}</Heading.h3>
      <Heading.h5>{conversionFunction(token.price, "ether")} ETH</Heading.h5>
      <Text>({token.price} wei)</Text>
    </Card>
  );
};