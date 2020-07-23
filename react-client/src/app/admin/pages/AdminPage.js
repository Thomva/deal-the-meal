import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as Routes from '../../routes';
import DashboardPage from './DashboardPage';
import ItemsPage from './ItemsPage';
import ItemEditPage from './ItemEditPage';
import CategoriesPage from './CategoriesPage';
import MessagesPage from './MessagesPage';
import UsersPage from './UsersPage';
import RolesPage from './RolesPage';
import ReviewsPage from './ReviewsPage';
import CategoryEditPage from './CategoryEditPage';
import RoleEditPage from './RoleEditPage';
import MessageEditPage from './MessageEditPage';
import UserEditPage from './UserEditPage';
import ReviewEditPage from './ReviewEditPage';

const AdminPage = ({children}) => {

  return (
    <Fragment>
      <Route exact path={Routes.BACKOFFICE_LANDING}>
        <Redirect to={Routes.BACKOFFICE_DASHBOARD} />
      </Route>
      <Route exact path={Routes.BACKOFFICE_DASHBOARD} component={DashboardPage} />
      <Route exact path={Routes.BACKOFFICE_ITEMS} component={ItemsPage} />
      <Route exact path={Routes.BACKOFFICE_ITEMS_EDIT} component={ItemEditPage} />
      <Route exact path={Routes.BACKOFFICE_ITEMS_CREATE} component={ItemEditPage} />
      <Route exact path={Routes.BACKOFFICE_CATEGORIES} component={CategoriesPage} />
      <Route exact path={Routes.BACKOFFICE_CATEGORIES_CREATE} component={CategoryEditPage} />
      <Route exact path={Routes.BACKOFFICE_CATEGORIES_EDIT} component={CategoryEditPage} />
      <Route exact path={Routes.BACKOFFICE_MESSAGES} component={MessagesPage} />
      <Route exact path={Routes.BACKOFFICE_MESSAGES_CREATE} component={MessageEditPage} />
      <Route exact path={Routes.BACKOFFICE_MESSAGES_EDIT} component={MessageEditPage} />
      <Route exact path={Routes.BACKOFFICE_USERS} component={UsersPage} />
      <Route exact path={Routes.BACKOFFICE_USERS_CREATE} component={UserEditPage} />
      <Route exact path={Routes.BACKOFFICE_USERS_EDIT} component={UserEditPage} />
      <Route exact path={Routes.BACKOFFICE_ROLES} component={RolesPage} />
      <Route exact path={Routes.BACKOFFICE_ROLES_CREATE} component={RoleEditPage} />
      <Route exact path={Routes.BACKOFFICE_ROLES_EDIT} component={RoleEditPage} />
      <Route exact path={Routes.BACKOFFICE_REVIEWS} component={ReviewsPage} />
      <Route exact path={Routes.BACKOFFICE_REVIEWS_CREATE} component={ReviewEditPage} />
      <Route exact path={Routes.BACKOFFICE_REVIEWS_EDIT} component={ReviewEditPage} />
    </Fragment>
  );
};

AdminPage.prototypes = {
  children: PropTypes.any
};

export default AdminPage;