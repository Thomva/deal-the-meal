import { default as React, useState } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';

import * as Routes from '../../routes';

import Logo from '../../_static/images/logos/Logo-Long.svg';
import { useAuth } from '../../services';
import { Button } from '../../components';
import { MenuIcon } from '../icons';
import { default as classnames } from 'classnames';
import { useEffect } from 'react';
import { LoginSignup } from '../buttons';

const Navigation = ({children, showLogo, isLoggedIn}) => {
  const { currentUser, logout, checkIsAdmin } = useAuth();
  const [ showMenu, setShowMenu ] = useState(false);
  const [ isAdmin, setIsAdmin ] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const setAdmin = async () => {
      currentUser && setIsAdmin(await checkIsAdmin(currentUser));
    }
    setAdmin();
  }, [currentUser, checkIsAdmin]);
  
  const handleLogout = async () => {
    await logout();
    history.push(Routes.LANDING);
    history.location.pathname === Routes.LANDING && history.go(0);
  }

  const menuClickHandler = () => {
    setShowMenu(!showMenu);
  }

  return (
    <nav className="navbar">
      <div className="navbar__left">
        {true &&
            <Link to={Routes.LANDING}>
              <img src={Logo} width="30" height="30" className="logo" alt="Deal the Meal Logo" />
            </Link>
        }
      </div>
      <div className="navbar__center">
        <NavLink className="clickableText clickableText--nav" activeClassName="clickableText--active" exact to={Routes.LANDING}>Home</NavLink>
        <NavLink className="clickableText clickableText--nav" activeClassName="clickableText--active" to={Routes.ABOUT}>About</NavLink>
        {currentUser && <>
          <NavLink className="clickableText clickableText--nav" activeClassName="clickableText--active" to={`${Routes.USER_DETAIL.replace(':id', currentUser.id)}`}>My Profile</NavLink>
          <NavLink className="clickableText clickableText--nav" activeClassName="clickableText--active" to={Routes.MESSAGES}>Messages</NavLink>
          {isAdmin && <NavLink className="clickableText clickableText--nav" activeClassName="clickableText--active" to={Routes.BACKOFFICE_LANDING}>Manage</NavLink>}
        </>}
      </div>

      <div className="navbar__right">
        {currentUser
          ? (
          <>
          <Link to={Routes.ITEM_CREATE}>
            <Button text="Create Item" />
          </Link>
          <div className="menu">
            <div className={classnames('menu__button', showMenu && 'menu__button--open')} onClick={menuClickHandler} >
              <MenuIcon color={showMenu ? '#ffffff' : '#ff6c31'} expanded={showMenu} />
            </div>
            <div className={classnames('menu__list', !showMenu && 'menu__list--hide')}>
              <div className="menu__item">
                <div className="menuLink clickableText clickableText--darkLight" onClick={handleLogout}>Log Out</div>
              </div>
            </div>
          </div>
          </>
          ) 
          : (
          <LoginSignup classes="navbar__loginSignup" />
          )
        }
      </div>
    </nav>
  );
};

export default Navigation;