import React from 'react';
import styles from './header.module.scss';
import logo from './stater-kits-logo.png';

const Header = ({current, onSwitchPage}) => (
  <div className={styles.header}>
    <nav id="menu" className="menu">
      <div className={styles.brand}>
        <a href="/" className={styles.logo}>
          {' '}
          The MagicToken Shop
        </a>
      </div>
      <ul>
        <li>
          <a href="#" className={current === 'seller' ? styles.currentLink : styles.link} onClick={() => onSwitchPage('seller')}>
            {' '}
            Seller
          </a>
        </li>
        <li>
          <a href="#" className={current === 'buyer' ? styles.currentLink : styles.link} onClick={() => onSwitchPage('buyer')}>
            {' '}
            Buyer
          </a>
        </li>
      </ul>
    </nav>
  </div>
);

export default Header;
