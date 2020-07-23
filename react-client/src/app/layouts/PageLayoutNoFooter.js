import { default as React } from 'react';

import { Header } from '../components';

import './PageLayout.scss';

const PageLayout = ({children}) => {
  return (
    <div className="page">
      <Header />
      <main className="page-main">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;