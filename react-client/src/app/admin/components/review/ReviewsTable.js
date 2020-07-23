import { default as React } from 'react';
import { default as classnames } from 'classnames';
import { default as moment } from 'moment';

const ReviewsTable = ({children, reviews, onDelete, onEdit}) => {

  const handleDelete = (event, reviewId, deleteMode = 0) => {
    if (typeof onDelete === 'function') {
      onDelete(reviewId, deleteMode);
    }
  };

  const handleEdit = (event, reviewId) => {
    if (typeof onEdit === 'function') {
      onEdit(reviewId);
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          {/* <th></th> */}
          <th>Rating</th>
          <th>Message</th>
          <th>Assessor</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {reviews && reviews.map(review => {
          return (
          <tr
            key={review.id}
          >
            <td>{review.rating}</td>
            <td>{review.message}</td>
            <td>{`${review.assessor.firstName} ${review.assessor.lastName}`}</td>
            <td>
              {moment(reviews._createdAt).format('DD/MM/YYYY')}
            </td>
            <td className="d-flex justify-content-around">
              <div aria-label="edit" onClick={ev => handleEdit(ev, review.id)}><i className="fas fa-edit"></i></div>
              <div className={classnames(review._deletedAt === null ? 'soft-deleted' : 'soft-undeleted')} aria-label="delete" onClick={ev => handleDelete(ev, review.id, review._deletedAt === null ? 'softdelete' : 'softundelete', 'delete')}><i className="fas fa-trash-alt"></i></div>
              <div aria-label="delete-forever" onClick={ev => handleDelete(ev, review.id, 'delete')}><i className="fas fa-trash"></i></div>              
            </td>
          </tr>
        )})}
      </tbody>
    </table>
  );
};

export default ReviewsTable;