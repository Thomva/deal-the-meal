import React, { } from 'react';

import './Toolbar.scss';

const Toolbar = ({ children, className, toast }) => {

  const handleHamburgerToggle = () => {
    const bodyElement = document.querySelector('body');
    if (bodyElement.classList.contains('is-minimized')) {
      bodyElement.classList.remove('is-minimized');
    } else {
      bodyElement.classList.add('is-minimized');
    }
  };

  return (
    <header className={className}>
      <button className="navbar-toggler toolbar-toggler" onClick={handleHamburgerToggle}>
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="toolbar-sub">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">Data</li>
          </ol>
        </nav>
      </div>
    </header>
  )
};
export default Toolbar;