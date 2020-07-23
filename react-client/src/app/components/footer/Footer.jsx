import { default as React } from 'react';

import { ArrowIcon, InstagramIcon, TwitterIcon, FacebookIcon } from '../icons';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_TITLE } from '../../strings';

const Footer = ({ children }) => {
  
  const scrollClickHandler = (e) =>{
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  
  return (
    <footer className="footer">
      <ArrowIcon color='#ff6c31' classes="footer__arrow icon--turn270 icon--clickable" onClick={scrollClickHandler} />
      <div className="footerNav">
        <div className="footerNav__left">
          <div className="footerNav__contact">
            <div className="footerNav__contact--title">{CONTACT_TITLE}</div>
            <div className="footerNav__contact--email">{CONTACT_EMAIL}</div>
            <div className="footerNav__contact--phoe">{CONTACT_PHONE}</div>
          </div>
        </div>
        <div className="footerNav__right">
          <div className="footerNav__social">
            <InstagramIcon />
            <TwitterIcon />
            <FacebookIcon />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;