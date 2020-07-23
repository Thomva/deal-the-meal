import { default as React, useState } from 'react';
import { default as classnames } from 'classnames';
import { Checkbox, Input } from '../inputs';
import { ArrowIcon } from '../icons';
import { Button } from '../buttons';
import {
	PLACEHOLDER_EMAIL,
	PLACEHOLDER_FIRSTNAME,
	PLACEHOLDER_LASTNAME,
	PLACEHOLDER_LOCATION,
	ERROR_EMAIL,
	ERROR_EMPTY_FIELD,
	ERROR_TC,
	ERROR_EMAIL_ALREADY_EXISTS,
} from '../../strings';
import { useModal, useApi, useAuth } from '../../services';
import Utils from '../../utilities/Utils';
import { useHistory } from 'react-router';
import { Map } from '../map';
import { useEffect } from 'react';
import { useCallback } from 'react';

const SignupModal = ({ classes = '', show }) => {
	const [ email, setEmail ] = useState();
	const [ emailError, setEmailError ] = useState();
	const [ tCIsChecked, setTCIsChecked ] = useState();
	const [ tCIsCheckedError, setTCIsCheckedError ] = useState();
	const [ firstName, setFirstName ] = useState();
	const [ firstNameError, setFirstNameError ] = useState();
	const [ lastName, setLastName ] = useState();
	const [ lastNameError, setLastNameError ] = useState();
	const [ location, setLocation ] = useState();
	const [ defaultLocation, setDefaultLocation ] = useState();
	const [ locationError, setLocationError ] = useState();
	const [ currentStep, setCurrentStep ] = useState(0);
	const [ password, setPassword ] = useState();
	const [ passwordError, setPasswordError ] = useState();
	const { showModal, hideModal } = useModal();
	const { findAllUsers } = useApi();
	const { signup } = useAuth();
	const [locationQuery, setLocationQuery] = useState();
	const history = useHistory();

	const emailChangeHandler = (e) => {
		setEmail(e.target.value);
		setEmailError('');
	}
	const tCChangeHandler = (isChecked) => {
		setTCIsChecked(isChecked);
		setTCIsCheckedError('');
	}

	const fNameChangeHandler = (e) => {
		setFirstName(e.target.value);
		setFirstNameError('');
	}

	const lNameChangeHandler = (e) => {
		setLastName(e.target.value);
		setLastNameError('');
	}

	const locationStringChangeHandler = (e) => {
		setLocationQuery(e.target.value);
		setLocationError('');
	}

	useEffect(() => {
		console.log(locationQuery);
	}, [locationQuery]);

	const locationChangeHandler = useCallback((e) => {
		setLocation({
			name: e.name,
			latitude: e.coords.latitude,
			longitude: e.coords.longitude,
		});
		setLocationError('');
	}, []);

	const onLocationMarkerChange = (e) => {
		setDefaultLocation(e.name)
		// console.log(e.name);
	}

	const passwordChangeHandler = (e) => {
		setPassword(e.target.value);
		setPasswordError('');
	}


	const loginHandler = (e) => {
		showModal('login');
	}

	const backClickHandler = (e) => {
		// Fill in the input fields
		setCurrentStep(currentStep - 1);
	}

	const signUpHandler = async (e) => {
		e.preventDefault();

		let areErrors = false;

		switch (currentStep) {
			case 0:
				// Validate email and terms and conditions
				if (!email || !Utils.validateEmail(email) || !tCIsChecked) {
					!Utils.validateEmail(email) && setEmailError(ERROR_EMAIL);
					!email && setEmailError(ERROR_EMPTY_FIELD);
					!tCIsChecked && setTCIsCheckedError(ERROR_TC);
					areErrors = true;
					// break;
				}

				// Check if email doesn't have an account yet
				const fetchedUser = await findAllUsers({
					email
				});
				if (fetchedUser && fetchedUser.length > 0) {
					setEmailError(ERROR_EMAIL_ALREADY_EXISTS);
					areErrors = true;
				}
				break;
			case 1:
				// Validate first and last name
				if (!firstName || !lastName) {
					!firstName && setFirstNameError(ERROR_EMPTY_FIELD);
					!lastName && setLastNameError(ERROR_EMPTY_FIELD);
					areErrors = true;
					break;
				}
				break;
			case 2:
				// Validate location and password
				if (!location || !password) {
					!location && setLocationError(ERROR_EMPTY_FIELD);
					!password && setPasswordError(ERROR_EMPTY_FIELD);
					areErrors = true;
					break;
				}

				// Sign Up and log in
				const userData = {
					email,
					password,
					firstName,
					lastName,
					location,
				}
				await signup(userData);
				hideModal();
				history.go(0);
				break;
		
			default:
				break;
		}

		// Go to next step / sign up if fields are valid
		!areErrors && setCurrentStep(currentStep + 1);
	}

	const submitHandler = e => {
		e.preventDefault();
		console.log('submit');
	}


	
	return (
		<>
		<h1 className={classnames('modal__title', classes)}>Sign Up</h1>
		<form className="modal__form" onSubmit={submitHandler}>
			<div className="modal__top">
				{currentStep === 0 && (
					<>
					<div className="modal__inputContainer">
						<Input classes="modal__input" type="email" label="Email" name="signupEmail" isRequired={true} defaultValue={email} placeholder={PLACEHOLDER_EMAIL} onChange={emailChangeHandler}/>
						{emailError &&
							<div className="modal__error">
								<ArrowIcon classes="modal__errorIcon icon--turn180" color="#ff6c31"/> <div className="modal__errorMessage">{emailError}</div>
							</div>
						}
					</div>
					<div className="modal__inputContainer modal__inputContainer--last">
						<Input classes="modal__input" type="password" label="Password" name="signupPassword" isRequired={true} defaultValue={password} placeholder="Must have at least 6 characters" onChange={passwordChangeHandler}/>
						{passwordError &&
							<div className="modal__error">
								<ArrowIcon classes="modal__errorIcon icon--turn180" color="#ff6c31"/> <div className="modal__errorMessage">{passwordError}</div>
							</div>
						}
					</div>
					<div className="modal__inputContainer">
						<Checkbox label="Accept Terms and Conditions" id="checkboxTandC" isRequired={true} name="checkboxTandC" checked={tCIsChecked} onChange={tCChangeHandler}/>
						{tCIsCheckedError &&
							<div className="modal__error">
								<ArrowIcon classes="modal__errorIcon icon--turn180" color="#ff6c31"/> <div className="modal__errorMessage">{tCIsCheckedError}</div>
							</div>
						}
					</div>
					</>
				)}
				{currentStep === 1 && (
					<>
					<div className="modal__inputContainer">
						<Input classes="modal__input" type="text" label="First Name" name="signupFirstName" isRequired={true} defaultValue={firstName} placeholder={PLACEHOLDER_FIRSTNAME} onChange={fNameChangeHandler}/>
						{firstNameError &&
							<div className="modal__error">
								<ArrowIcon classes="modal__errorIcon icon--turn180" color="#ff6c31"/> <div className="modal__errorMessage">{firstNameError}</div>
							</div>
						}
					</div>
					<div className="modal__inputContainer">
						<Input classes="modal__input" type="text" label="Last Name" name="signupLastName" isRequired={true} defaultValue={lastName} placeholder={PLACEHOLDER_LASTNAME} onChange={lNameChangeHandler}/>
						{lastNameError &&
							<div className="modal__error">
								<ArrowIcon classes="modal__errorIcon icon--turn180" color="#ff6c31"/> <div className="modal__errorMessage">{lastNameError}</div>
							</div>
						}
					</div>
					</>
				)}
				{currentStep === 2 && (
					<>
						<div className="modal__inputContainer">
							<Input classes="modal__input" type="text" label="Where do you live?" name="signupLocation" isRequired={true} defaultValue={defaultLocation} placeholder={PLACEHOLDER_LOCATION} onChange={locationStringChangeHandler}/>
							{locationError &&
								<div className="modal__error">
									<ArrowIcon classes="modal__errorIcon icon--turn180" color="#ff6c31"/> <div className="modal__errorMessage">{locationError}</div>
								</div>
							}
						</div>
					<div className="modal__mapContainer">
						<Map
							locationQuery={locationQuery}
							onFindLocation={locationChangeHandler}
							onMarkerChange={onLocationMarkerChange}
						/>
					</div>
					</>
				)}
			</div>
			<div className="modal__bottom">
				{currentStep === 0 && <span className="modal__textline">Already have and account? <p className="clickableText clickableText--ml" onClick={loginHandler}>Log In</p></span>}
				<div className="modal__bottomButtons">
					{currentStep !== 0 && <Button text="Back" classes="modal__button" variant="light" type="button" onClick={backClickHandler}/>}
					<Button text={(currentStep === 0 || currentStep === 2) ? 'Sign Up' : 'Next'} classes="modal__button" type="submit" onClick={signUpHandler}/>
				</div>
			</div>
		</form>
		</>
	);
};

export default SignupModal;
