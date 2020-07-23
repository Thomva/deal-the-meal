import { default as React } from 'react';

import { Searchbar } from '../search';

const SearchHeader = ({children, showLogo, isLoggedIn}) => {

  return (
    <div className="searchHeader">
        <Searchbar />
    </div>
  );
};

export default SearchHeader;