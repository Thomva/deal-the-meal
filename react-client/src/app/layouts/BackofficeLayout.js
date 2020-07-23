import React, { } from 'react';
import { Sidebar } from '../admin/components';

import { ToastProvider } from '../admin/services';
import { Toolbar } from '../admin/components/toolbar';

import './BackofficeLayout.scss';

const BackofficeLayout = ({ children }) => {

  return (
    <div className="backoffice">      
      <Sidebar className="sidebar" />
      <ToastProvider>
        <main className="main">
          <Toolbar className="toolbar"/>
          <div className="body">
            {children}
          </div>          
        </main>
      </ToastProvider>
    </div>
  )
};
export default BackofficeLayout;