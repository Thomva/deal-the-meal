import { default as React } from 'react';
import { RatingStars } from '../rating';

const Review = ({review}) => {
	return (
    <div className="review">
      <div className="review__top">
        <h4 className="review__assessor">{review.assessor}</h4>
        <RatingStars rating={review.rating} />
      </div>
      <div className="review__message">{review.message}</div>
    </div>
	);
};

export default Review;
