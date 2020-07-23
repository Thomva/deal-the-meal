import { default as React } from 'react';

import { PageSection, CardList } from '../components';
import { Searchbar, SearchFilter } from '../components/search';
import Utils from '../utilities/Utils';

const ResultsPage = ({children}) => {
  const filters = {
    title: Utils.getParameterFromUrl('t'),
    location: Utils.getParameterFromUrl('l'),
    category: Utils.getParameterFromUrl('c'),
  }


  const sortTypes = {
    date: '_createdAt',
    id: '_id',
    title: 'title',
    // price: 'price.amount',
    // user: 'user._id',
  };

  const sortBy = {};
  const sortTypeFromUrl = Utils.getParameterFromUrl('sortType');
  const orderFromUrl = Utils.getParameterFromUrl('order');
  if (sortTypeFromUrl) sortBy[sortTypes[sortTypeFromUrl]] = orderFromUrl || -1;


  return (
    <PageSection classes="resultsPage page-section--centered page-section--no-space-above" title={'Results'}>
      <div className="resultsPage__searchContainer">
        <Searchbar defaultValues={filters} />
      </div>
      <SearchFilter defaultValues={filters} />
      <CardList filters={filters} sortBy={sortBy} />
    </PageSection>
  );
};

export default ResultsPage;