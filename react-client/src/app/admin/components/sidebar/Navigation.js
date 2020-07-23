import { default as React } from 'react';
import { NavLink } from 'react-router-dom';

import * as Routes from '../../../routes';

import './Sidebar.scss';

const Navigation = ({children, className}) => {
  return (
    <ul className={className}>
      <li className="sidebar-nav-item">        
        <NavLink to={Routes.BACKOFFICE_DASHBOARD} activeClassName="active" className="sidebar-nav-link"><i className="fas fa-tachometer-alt"></i><span>Dasboard</span></NavLink>
      </li>
      <li className="sidebar-nav-item">        
        <NavLink to={Routes.BACKOFFICE_ITEMS} activeClassName="active" className="sidebar-nav-link"><i className="fas fa-edit"></i><span>Items</span></NavLink>
      </li>
      <li className="sidebar-nav-item">        
        <NavLink to={Routes.BACKOFFICE_CATEGORIES} activeClassName="active" className="sidebar-nav-link"><i className="fas fa-tags"></i><span>Categories</span></NavLink>
      </li>      
      <li className="sidebar-nav-item">        
        <NavLink to={Routes.BACKOFFICE_MESSAGES} activeClassName="active" className="sidebar-nav-link"><i className="fas fa-comment-alt"></i><span>Messages</span></NavLink>
      </li>
      <li className="sidebar-nav-item">        
        <NavLink to={Routes.BACKOFFICE_USERS} activeClassName="active" className="sidebar-nav-link"><i className="fas fa-users"></i><span>Users</span></NavLink>
      </li>
      <li className="sidebar-nav-item">        
        <NavLink to={Routes.BACKOFFICE_ROLES} activeClassName="active" className="sidebar-nav-link"><i className="fas fa-users"></i><span>Roles</span></NavLink>
      </li>
      <li className="sidebar-nav-item">        
        <NavLink to={Routes.BACKOFFICE_REVIEWS} activeClassName="active" className="sidebar-nav-link"><i className="fas fa-users"></i><span>Reviews</span></NavLink>
      </li>
      <li className="sidebar-nav-item">        
        <NavLink to={Routes.HOME} activeClassName="active" className="sidebar-nav-link"><i className="fas fa-home"></i><span>Home</span></NavLink>
      </li>
    </ul>
  );
};

export default Navigation;