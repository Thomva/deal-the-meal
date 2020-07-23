import { default as React, useEffect, useState, Fragment } from 'react';
import { default as classnames } from 'classnames';

import $ from 'jquery'; 

import { useApi } from '../../../services';
import { useToast } from '../../services';

import ReviewsTable from './ReviewsTable';

import './ReviewList.scss';

const ReviewList = ({children, className, limit = 10, skip = 1, onEdit}) => {  
  const { deleteReview, findAllReviews } = useApi();
  const { addToast } = useToast();
  const [ reviews, setReviews ] = useState();
  const [ currentPageIndex, setCurrentPageIndex ] = useState(skip);
  const [ pagination, setPagination ] = useState({
    limit,
    page: skip,
    pages: 1,
    total: 1
  });
  const [ reviewToDelete, setReviewToDelete ] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {        
      const data = await findAllReviews({
        limit: pagination.limit,
        skip: currentPageIndex
      });
      console.log(data);
      setReviews(data);
      setPagination({ 
        limit: data.limit, 
        page: data.page, 
        pages: data.pages, 
        total: data.total 
      });
    }

    if (reviewToDelete === null) {
      fetchReviews();
    }
    
  }, [findAllReviews, currentPageIndex, reviewToDelete, pagination.limit]);

  const handlePage = (ev, pageIndex) => {
    ev.preventDefault();

    setCurrentPageIndex(pageIndex);
  }

  const handleDelete = (reviewId, mode) => {
    setReviewToDelete({
      review: reviews.find(review => review.id === reviewId),
      mode,
    });
    
    $('#confirmModal').modal('show');
  }

  const handleDeleteConfirm = async () => {
    const deletedReview = await deleteReview(reviewToDelete.review.id, reviewToDelete.mode);

    addToast({
      title: `Admin: Review`,
      message: `Succesfully ${reviewToDelete.mode} the review with id ${deletedReview.id} and title ${deletedReview.title}`
    });

    $('#confirmModal').modal('hide');

    setReviewToDelete(null);
  }

  const handleEdit = (reviewId) => {
    if (typeof onEdit === 'function') {
      onEdit(reviewId);
    }
  }

  return (
    <div className={className}>
      <div className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Reviews</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <ReviewsTable reviews={reviews} onDelete={handleDelete} onEdit={handleEdit}  />
          </div>          
        </div>
        <div className="card-footer">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end">
              {(pagination.page > 1) ? (<li className="page-review"><button className="page-link" onClick={ev => handlePage(ev, pagination.page - 1)}>Previous</button></li>) : ''}
              {
                Array(pagination.pages).fill(true).map((review, index) => (
                  <li key={index} className={classnames('page-review', (pagination.page === index + 1) ? 'active' : '' )}><button className="page-link" onClick={ev => handlePage(ev, index + 1)}>{index + 1}</button></li>
                ))
              }
              {(pagination.page !== pagination.pages) ? (<li className="page-review"><button className="page-link" onClick={ev => handlePage(ev, pagination.page + 1)}>Next</button></li>) : ''}                
            </ul>
          </nav>
        </div>
      </div>
      <div className="modal fade" id="confirmModal" tabIndex="-1" role="dialog" aria-labelledby="confirmModal" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{!!reviewToDelete ? (
                <Fragment>{reviewToDelete.mode} the selected review</Fragment>
              ) : ''}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {!!reviewToDelete ? (
                <p>Dou yo wish to {reviewToDelete.mode} the review with id: {reviewToDelete.review.id} and title: {reviewToDelete.review.title}?</p>
              ) : ''}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={ev => handleDeleteConfirm(ev)}>{!!reviewToDelete ? (
                <Fragment>{reviewToDelete.mode}</Fragment>
              ) : ''}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;