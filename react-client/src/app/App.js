import React from 'react';
import {BrowserRouter as Router, Redirect, Switch} from 'react-router-dom';

import { AboutPage, HomePage, NotFoundPage, ResultsPage, ItemDetailPage, UserDetailPage, ItemEditPage, UserEditPage, MessagePage } from './pages';
import { AdminPage } from './admin/pages';
import { BackofficeLayout, PageLayout, ErrorLayout, PageLayoutNoFooter } from './layouts';
import { AuthRouteWithLayout, RouteWithLayout } from './utilities';
import * as Routes from './routes';
import { ApiProvider, AuthProvider, ModalProvider } from './services';

import './app.scss';

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <ApiProvider>
          <Router basename='/'>
            <ModalProvider>
              <Switch>
                <RouteWithLayout exact path={Routes.LANDING} component={HomePage} layout={PageLayout} />
                <Redirect from={Routes.HOME} to={Routes.LANDING} />
                <RouteWithLayout exact path={Routes.ABOUT} component={AboutPage} layout={PageLayout} />
                <RouteWithLayout exact path={Routes.RESULTS} component={ResultsPage} layout={PageLayout} />
                <RouteWithLayout exact path={Routes.ITEM_CREATE} component={ItemEditPage} layout={PageLayoutNoFooter} />
                <RouteWithLayout exact path={Routes.ITEM_EDIT} component={ItemEditPage} layout={PageLayoutNoFooter} />
                <RouteWithLayout exact path={Routes.ITEM_DETAIL} component={ItemDetailPage} layout={PageLayoutNoFooter} />
                <RouteWithLayout exact path={Routes.USER_DETAIL} component={UserDetailPage} layout={PageLayout} />
                <RouteWithLayout exact path={Routes.USER_EDIT} component={UserEditPage} layout={PageLayoutNoFooter} />
                <RouteWithLayout exact path={Routes.MESSAGES} component={MessagePage} layout={PageLayoutNoFooter} />
                <RouteWithLayout exact path={Routes.MESSAGES_NEW} component={MessagePage} layout={PageLayoutNoFooter} />
                <AuthRouteWithLayout path={Routes.BACKOFFICE_LANDING} component={AdminPage} layout={BackofficeLayout} />
                <RouteWithLayout component={NotFoundPage} layout={ErrorLayout} />
              </Switch>
            </ModalProvider>
          </Router>
        </ApiProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
