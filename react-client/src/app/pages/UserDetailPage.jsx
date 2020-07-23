import { default as React, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { useApi, useAuth } from '../services';

import {
	PageSection,
	LocationIcon,
	CardCarousel,
	ActionButton,
	SearchHeader,
} from '../components';
import Utils from '../utilities/Utils';
import { RatingStars } from '../components/rating';
import { Review } from '../components/reviews';
import { LoadingIndicator } from '../components/loading';
import * as Routes from '../routes';

const UserDetailPage = ({ children }) => {
	const { id } = useParams();
	const { currentUser } = useAuth();
	const { findUser } = useApi();
	const [user, setUser] = useState(null);

	const isOwn = currentUser ? currentUser.id === id : false;

	const fetchUser = useCallback(
		async (userId) => {
			const fetchedUser = await findUser(userId);
			setUser(fetchedUser);
		},
		[findUser]
	);

	useEffect(() => {
		fetchUser(id);
	}, [id, fetchUser]);

	useEffect(() => {
		console.log(user);
	}, [user]);

	return user ? (
		<>
			<SearchHeader />
			<PageSection
				classes="userDetail page-section--centered"
				title={'UserDetail'}
			>
				<div className="userDetail__userInfo">
					{isOwn && (
						<div className="actionButtons">
							<ActionButton
								variant="edit"
								onClickRoute={
									currentUser && Routes.USER_EDIT.replace(':id', currentUser.id)
								}
							/>
						</div>
					)}
					<div className="userDetail__userInfo--side">
						{user && (
							<h1 className="userDetail__userName">
								{user.showLastName
									? `${user.firstName} ${user.lastName}`
									: user.firstName}
							</h1>
						)}
					</div>
					<div className="userDetail__userInfo--side">
						<div className="userDetail__userLocation">
							<LocationIcon classes="userDetail__userLocationIcon" />
							<p className="userDetail__userLocationName">
								{user && user.location.name}
							</p>
						</div>
						<div className="userDetail__userTimeAgo">
							{user && Utils.timeAgo(user._createdAt, 'on', 'Just joined')} Deal
							the Meal
						</div>
						<div className="userDetail__userRating">
							{user && user.userrating.average && (
								<RatingStars
									className="userDetail__userRatingStars"
									rating={parseInt(user.userrating.average)}
								/>
							)}
							<a
								href="#reviews"
								className="userDetail__userReviews clickableText clickableText--dark"
							>
								{user && user.userrating.reviews.length} reviews
							</a>
						</div>
					</div>
				</div>

				<div className="userDetail__items">
					<h1 className="userDetail__title">Items</h1>
					<CardCarousel userId={id} isOwn={isOwn} />
				</div>

				<div className="userDetail__reviews" id="reviews">
					<h1 className="userDetail__title">Reviews</h1>
					<div className="userDetail__reviewFeed">
						{user &&
							user.userrating.reviews &&
							user.userrating.reviews.map((review) => {
								const { id, rating, message, assessor } = review;
								const r = {
									assessor: assessor.name,
									message,
									rating,
								};
								return <Review key={id} review={r} />;
							})}
					</div>
				</div>
			</PageSection>
		</>
	) : (
		<LoadingIndicator />
	);
};

export default UserDetailPage;
