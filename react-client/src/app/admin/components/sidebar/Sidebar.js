import { default as React } from 'react';
import { Link } from 'react-router-dom';

import * as Routes from '../../../routes';
import Navigation from './Navigation';

import './Sidebar.scss';

const Sidebar = ({children, className}) => {
  return (
    <div className={className} id="sidebar">
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to={Routes.BACKOFFICE_LANDING}>
        <div className="sidebar-brand-icon">
          <i className="fas fa-laugh-wink"></i>
        </div>
        <div className="sidebar-brand-text mx-3">GDM Admin <sup>2</sup></div>
      </Link>
      <Navigation className="sidebar-nav" />
    </div>
  );
};

export default Sidebar;