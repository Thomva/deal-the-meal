import React, { } from 'react';
import { useHistory, Link } from 'react-router-dom';

import * as Routes from '../../routes';
import { ReviewList } from '../components';

const ReviewsPage = ({ children }) => {
  let history = useHistory();

  const handleEdit = (reviewId) => {
    console.log('edit: ', reviewId);
    history.push(Routes.BACKOFFICE_REVIEWS_EDIT.replace(':id', reviewId));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Link className="btn btn-primary" to={Routes.BACKOFFICE_REVIEWS_CREATE}>Create Review</Link>
        </div>
        <ReviewList className="col-12 col-sm-12 col-md-12 col-lg-12 ol-xl-6 post-list" limit={10} skip={1} onEdit={handleEdit}  />:
      </div>
    </div>
  )
};
export default ReviewsPage;