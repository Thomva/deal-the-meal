import { default as React, useState, useEffect } from 'react';
import { StarIcon } from '../icons';
import { default as classnames } from 'classnames';

const RatingStars = ({rating, onChange, showOnHover, classes}) => {
  const [ hoverRating, setHoverrating ] = useState(rating);
  const [ currentRating, setCurrentRating ] = useState(rating);
  const stars = [];

  useEffect(() => {
    setHoverrating(rating);
    setCurrentRating(rating);
  }, [rating]);

  const starClickHandler = (e) => {
    const newRating = parseInt(e.target.id) + 1;
    setCurrentRating(newRating);
    onChange && onChange(newRating);
  }

  const onHover = (e) => {
    setHoverrating(parseInt(e.target.id) + 1);
  }

  const onExit = () => {
    setHoverrating(currentRating);
  }
  
  for (let i = 0; i < 5; i++) {
    stars.push(
      <div key={i} onMouseEnter={onHover} className="starContainer" onClick={starClickHandler} id={i}>
        <StarIcon color={`${i < (showOnHover ? hoverRating : rating) ? '#ff6c31' : '#fccbb8'}`}/>
      </div>);
  }

	return (
    <div className={classnames('ratingStars', classes)} onMouseLeave={onExit}>
      {stars}
    </div>
	);
};

export default RatingStars;
