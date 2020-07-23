import React, { } from 'react';
import { useHistory, Link } from 'react-router-dom';

import * as Routes from '../../routes';
import { ItemList } from '../components';
import { CategoryList } from '../components';

const CategoriesPage = ({ children }) => {
  let history = useHistory();

  const handleEdit = (categoryId) => {
    console.log('edit: ', categoryId);
    history.push(Routes.BACKOFFICE_CATEGORIES_EDIT.replace(':id', categoryId));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Link className="btn btn-primary" to={Routes.BACKOFFICE_CATEGORIES_CREATE}>Create Item</Link>
        </div>
        <CategoryList className="col-12 col-sm-12 col-md-12 col-lg-12 ol-xl-6 post-list" limit={10} skip={1} onEdit={handleEdit}  />:
      </div>
    </div>
  )
};
export default CategoriesPage;