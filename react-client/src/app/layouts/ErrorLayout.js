import React, { } from 'react';

import './ErrorLayout.scss';

const ErrorLayout = ({ children }) => {

  return (
    <div className="page--404">
      <main className="main">
        {children}
      </main>
    </div>    
  )
};
export default ErrorLayout;