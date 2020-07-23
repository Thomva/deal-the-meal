import { default as React, useState, useEffect } from 'react';
import { default as classnames } from 'classnames';
import { TextArea } from '../inputs';
import { Button } from '../buttons';
import { useModal, useAuth, useApi } from '../../services';
import { ArrowIcon } from '../icons';
import { RatingStars } from '../rating';

const ReviewModal = ({ classes = '', show, ownerId }) => {
	const { hideModal } = useModal();
	const { currentUser } = useAuth();
	const { storeReview, findReviewByUsers } = useApi();
	const [ foundReview, setFoundReview ] = useState();
	const [ rating, setRating ] = useState(1);
	const [ review, setReview ] = useState();
	const [ ReviewError, setReviewError ] = useState();

	useEffect(() => {
		const searchReview = async () => {
			if (!currentUser || !ownerId) {
				hideModal();
				return;
			}
	
			const r = await findReviewByUsers({
				ownerId: ownerId,
				assessorId: currentUser.id,
			});
			console.log(ownerId, currentUser.id, r );
	
			r && setFoundReview(r);
			setReview(r && r.message);
			setRating(r && r.rating);
		}
		searchReview();
	}, [currentUser, ownerId, findReviewByUsers, hideModal]);

	useEffect(() => {
		console.log(foundReview);
	}, [foundReview]);

	const ratingChangeHandler = (r) => {
		setRating(r);
	}

	const reviewChangeHandler = (e) => {
		setReview(e.target.value);
		setReviewError('');
	}

	const onDone = async (e) => {
		e.preventDefault();
		if (!currentUser) {
			return;
		}
		console.log('save');
		const r = {
			rating,
			message: review,
			assessorId: currentUser.id,
			userId: ownerId,
		}
		if (!review) return setReviewError('Please fill in this field');

		await storeReview(r);

		hideModal();
	}
	
	return (
		<>
		<h1 className={classnames('modal__title', classes)}>Wrtie Review</h1>
		<form className="modal__form modal__form--review">
			<div className="modal__top">
				<div className="modal__inputContainer">
					<RatingStars classes="modal__ratingStars" onChange={ratingChangeHandler} rating={!!foundReview ? foundReview.rating : 1} showOnHover={true}/>
				</div>
				<div className="modal__inputContainer modal__inputContainer--last">
					<TextArea label="Review" classes="modal__input" placeholder="Very delicious!" defaultValue={foundReview && foundReview.message} onChange={reviewChangeHandler} isRequired={true}/>
					{ReviewError &&
					<div className="modal__error">
						<ArrowIcon classes="modal__errorIcon icon--turn180" color="#ff6c31"/> <div className="modal__errorMessage">{ReviewError}</div>
					</div>
					}
				</div>
			</div>
			<div className="modal__bottom modal__bottom--review">
            	<Button text="Done" classes="modal__button" onClick={onDone}/>
			</div>
		</form>
		</>
	);
};

export default ReviewModal;
