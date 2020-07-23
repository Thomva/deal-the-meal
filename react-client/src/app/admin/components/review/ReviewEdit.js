import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const ReviewEdit = ({className, children, review, onStore = null, onUpdate = null, items, users}) => {
  const [reviewForm, setReviewForm] = useState({
    numRating: '',
    txtMessage: '',
    ddlAssessor: '',
    ddlReceiver: '',
  });

  useEffect(() => {
    if (review) {
      console.log(review);
      setReviewForm({
        numRating: review.rating,
        txtMessage: review.message,
        ddlAssessor: review._userId,
        ddlReceiver: review.receiver,
      });
    }
  }, [review])

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log('submit');

    const newReview = {
      rating: reviewForm.numRating,
      message: reviewForm.txtMessage,
      assessorId: reviewForm.ddlAssessor,
      userId: reviewForm.ddlReceiver,
    };

    if (review && review._id) {
      onUpdate({
        ...newReview,
        _id: review._id,
      });
    } else {
      onStore({
        ...newReview,
      });
    }
  }

  const handleInputChange = (ev) => {
    console.log(ev.target.name, ev.target.name);
    setReviewForm({
      ...reviewForm,
      [ev.target.name]: ev.target.value
    });
  }

  const handleSelectChange = (ev) => {
    setReviewForm({
      ...reviewForm,
      [ev.target.name]: ev.target.options[ev.target.selectedIndex].value
    });
  }
  
  return (
    <div className={classnames(className)}>
      <div className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">{!!review ? <Fragment>Update the review: {review.body}</Fragment> : <Fragment>Create a new review</Fragment>}</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="numRating">Rating</label>
              <input type="number" className="form-control" id="numRating" name="numRating" required defaultValue={reviewForm['numRating']} max={5} min={1} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="txtMessage">Message</label>
              <input type="text" className="form-control" id="txtMessage" name="txtMessage" required defaultValue={reviewForm['txtMessage']} onChange={handleInputChange}/>
            </div>
            {!review && <>
              <div className="form-group">
                <label htmlFor="ddlAssessor">Assessor</label>
                <select className="form-control" id="ddlAssessor" name="ddlAssessor" onChange={handleSelectChange} value={reviewForm['ddlAssessor']}>
                  {users && users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="ddlReceiver">Receiver</label>
                <select className="form-control" id="ddlReceiver" name="ddlReceiver" onChange={handleSelectChange} value={reviewForm['ddlReceiver']}>
                  {users && users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
            </>}
            <button type="submit" className="btn btn-primary">{!!review ? 'Update' : 'Save'} review</button>
          </form>
        </div>
      </div>
    </div>
  );
};

ReviewEdit.prototypes = {
  className: PropTypes.string,
  viewModel: PropTypes.object
};

export default ReviewEdit;