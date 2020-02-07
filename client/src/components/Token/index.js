import React from 'react';
import { Card, Image, Text, Heading, Button } from 'rimble-ui';
import styles from './Token.module.scss';
import magictoken from '../../images/magictoken.png';
import soldImage from '../../images/sold.png';

export default ({ token, conversionFunction, sold, buyable }) => {
  return (
    <Card className={styles.container}>
      <Image maxWidth={100} src={magictoken} />
      { sold ? (<Image className={styles.sold} maxWidth={100} src={soldImage} />) : null }
      <Heading.h3>Token #{token.id}</Heading.h3>
      <Heading.h5>{conversionFunction(token.price, "ether")} ETH</Heading.h5>
      <Text>({token.price} wei)</Text>
      { !sold && buyable && <Button className={styles.buy}>Buy</Button> }
    </Card>
  );
};
