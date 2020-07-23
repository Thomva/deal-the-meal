import { default as React, Fragment, useCallback } from 'react';

import { PageSection, Button, Map } from '../components';
import * as Routes from '../routes';
import { Input, Checkbox } from '../components/inputs';
import { useApi, useAuth, useModal } from '../services';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const UserEditPage = ({ children }) => {
	const [isOwn, setIsOwn] = useState();
	const { id } = useParams();
	const { currentUser, logout } = useAuth();
	const { findUser, updateUser, deleteUser } = useApi();
	const { showModal } = useModal();
	const [user, setUser] = useState();
	const [newUser, setNewUser] = useState({
		firstName: null,
		lastName: null,
		location: null,
		showLastName: false,
		_id: null,
	});
	const [errors, setErrors] = useState();
	const [locationQuery, setLocationQuery] = useState();
	const [locationInput, setLocationInput] = useState();
	const history = useHistory();

	const fetchUser = useCallback(
		async (id) => {
			const fetchedUser = await findUser(id);
			setUser(fetchedUser);
		},
		[findUser]
	);

	useEffect(() => {
		id && fetchUser(id);
	}, [fetchUser, id]);

	useEffect(() => {
		!currentUser && history.push(`${Routes.LANDING}`);
		user && currentUser && setIsOwn(user.id === currentUser.id);
	}, [currentUser, id, user, history]);

	useEffect(() => {
		if (id && isOwn === false) {
			currentUser
				? history.push(`${Routes.USER_DETAIL.replace(':id', currentUser.id)}`)
				: history.push(`${Routes.LANDING}`);
		}
	}, [isOwn, id, currentUser, history]);

	useEffect(() => {
		if (!user) return;
		setNewUser((prevUser) => ({
			...prevUser,
			firstName: user.firstName,
			lastName: user.lastName,
			location: user.location,
			showLastName: user.showLastName,
		}));
	}, [user]);

	const firstNameChangeHandler = (e) => {
		const newFirstName = e.target.value;

		setNewUser((prevUser) => ({
			...prevUser,
			firstName: typeof newFirstName === 'string' ? newFirstName.trim() : null,
		}));
	};

	const lastNameChangeHandler = (e) => {
		const newLastName = e.target.value;

		setNewUser((prevUser) => ({
			...prevUser,
			lastName: typeof newLastName === 'string' ? newLastName.trim() : null,
		}));
	};

	const showLNChangeHandler = (isChecked) => {
		setNewUser((prevUser) => ({
			...prevUser,
			showLastName: isChecked,
		}));
	};

	const locationStringChangeHandler = (e) => {
		const newLocation = e.target.value;
		const loc = typeof newLocation === 'string' ? newLocation.trim() : null;
		setLocationQuery(loc);
	};

	const locationMarkerChangeHandler = (e) => {
		const locationName = e.name;
		console.log('locationMarkerChangeHandler');
		setLocationInput(locationName);
	};

	const locationChangeHandler = useCallback((e) => {
		setNewUser((prevUser) => ({
			...prevUser,
			location: {
				name: e.name,
				latitude: e.coords.latitude,
				longitude: e.coords.longitude,
			},
		}));
	}, []);

	const saveClickHandler = async (e) => {
		let errorMessages = [];
		(newUser.firstName === '' || newUser.firstName === null) &&
			errorMessages.push('Please fill in your first name.');
		(newUser.lastName === '' || newUser.lastName === null) &&
			errorMessages.push('Please fill in your last name.');
		newUser.location === null &&
			errorMessages.push('Please fill in your location.');

		console.log(newUser.location);
		console.log(user);

		setErrors(errorMessages);

		const saveUser = {
			...newUser,
			_id: currentUser && currentUser.id,
		};

		if (errorMessages.length > 0) return;

		// Save updated user
		try {
			if (user) {
				await updateUser(saveUser);
				history.push(`${Routes.USER_DETAIL.replace(':id', currentUser.id)}`);
				return null;
			}
			console.log('no user to save');
		} catch (error) {
			console.log(error);
			return;
		}
	};

	const cancelClickHandler = (e) => {
		history.push(`${Routes.USER_DETAIL.replace(':id', currentUser.id)}`);
	};

	const deleteClickHandler = (e) => {
		if (!currentUser || !currentUser.id) return;
		showModal(
			'deleteUser',
			async () => {
				console.log('deleting');
				// Loading
				return deleteUser(currentUser.id, 'delete');
			},
			async () => {
				// Logout
				await logout();

				// Go to home
				history.push(Routes.LANDING);
				history.go(0);
			}
		);
	};

	return (
		<Fragment>
			<PageSection classes="userEdit" title={'UserEdit'}>
				<section className="userEdit__nameSection">
					<h1 className="userEdit__title">Name</h1>
					<Input
						type="text"
						label="First Name"
						name="inputFirstName"
						defaultValue={user && user.firstName}
						onChange={firstNameChangeHandler}
					/>
					<Input
						type="text"
						label="Last Name"
						name="inputLastName"
						defaultValue={user && user.lastName}
						onChange={lastNameChangeHandler}
					/>
					<Checkbox
						name="checkboxLastName"
						label="Show last name"
						checked={user && user.showLastName}
						onChange={showLNChangeHandler}
					/>
				</section>
				<section className="userEdit__locationSection">
					<h1 className="userEdit__title">Location</h1>
					<Input
						type="text"
						label="Where do you live?"
						name="inputLocation"
						defaultValue={locationInput || (user && user.location.name)}
						onChange={locationStringChangeHandler}
					/>
					<div className="userEdit__mapContainer">
						<Map
							locationQuery={locationQuery}
							onFindLocation={locationChangeHandler}
							onMarkerChange={locationMarkerChangeHandler}
							location={
								user && {
									latitude: user.location.latitude,
									longitude: user.location.longitude,
								}
							}
						/>
					</div>
				</section>
				<div className="userEdit__buttonContainer">
					<div className="userEdit__buttonContainer--left">
						<Button text="Save" onClick={saveClickHandler} />
						<Button
							text="Cancel"
							variant="light"
							onClick={cancelClickHandler}
						/>
					</div>
					<div className="userEdit__buttonContainer--right">
						<Button
							text="Delete Account"
							variant="light"
							onClick={deleteClickHandler}
						/>
					</div>
				</div>

				<section className="userEdit__errorSection">
					{errors &&
						errors.map((error, i) => (
							<h4 key={i} className="userEdit__error">
								{error}
							</h4>
						))}
				</section>
			</PageSection>
		</Fragment>
	);
};

export default UserEditPage;
