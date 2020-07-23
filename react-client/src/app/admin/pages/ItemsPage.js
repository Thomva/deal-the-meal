import React, { } from 'react';
import { useHistory, Link } from 'react-router-dom';

import * as Routes from '../../routes';
import { ItemList } from '../components';

const ItemsPage = ({ children }) => {
  let history = useHistory();

  const handleEdit = (itemId) => {
    console.log('edit: ', itemId);
    history.push(Routes.BACKOFFICE_ITEMS_EDIT.replace(':id', itemId));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          {/* <Link className="btn btn-primary" to={Routes.BACKOFFICE_POSTS_CREATE}>Create Post</Link> */}
          <Link className="btn btn-primary" to={Routes.BACKOFFICE_ITEMS_CREATE}>Create Item</Link>
        </div>
        <ItemList className="col-12 col-sm-12 col-md-12 col-lg-12 ol-xl-6 post-list" limit={10} skip={1} onEdit={handleEdit}  />:
      </div>
    </div>
  )
};
export default ItemsPage;