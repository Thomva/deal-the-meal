import { default as React } from 'react';

import { Footer, Header } from '../components';

import './PageLayout.scss';

const PageLayout = ({children}) => {
  return (
    <div className="page">
      <Header />
      <main className="page-main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;