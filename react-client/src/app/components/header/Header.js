import { default as React } from 'react';
import Navigation from './Navigation.jsx';

const Header = ({children}) => {
  const isLoggedIn = false;
  const onHomePage = true;

  return (
    <header className="page-header">
      <Navigation showLogo={!onHomePage} isLoggedIn={isLoggedIn} />
    </header>
  );
};

export default Header;