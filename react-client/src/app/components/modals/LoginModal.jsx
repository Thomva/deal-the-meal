import { default as React, useState } from 'react';
import { default as classnames } from 'classnames';
import { Input } from '../inputs';
import { PLACEHOLDER_EMAIL, ERROR_EMPTY_FIELD, ERROR_EMAIL, ERROR_NO_USER_FOUND, ERROR_PASSWORD } from '../../strings';
import { Button } from '../buttons';
import { useModal, useAuth } from '../../services';
import Utils from '../../utilities/Utils';
import { ArrowIcon } from '../icons';
import { useHistory } from 'react-router-dom';

const LoginModal = ({ classes = '', show }) => {
	const { showModal, hideModal } = useModal();
	const { logInLocal } = useAuth();
	const [ email, setEmail ] = useState();
	const [ password, setPassword ] = useState();
	const [ emailError, setEmailError ] = useState();
	const [ passwordError, setPasswordError ] = useState();
	const history = useHistory();

	const emailChangeHandler = (e) => {
		setEmail(e.target.value);
		setEmailError('');
	}
	const passwordChangeHandler = (e) => {
		setPassword(e.target.value);
		setPasswordError('');
	}

	const signUpHandler = (e) => {
		showModal('signup');
	}

	const loginHandler = async (e) => {
		e.preventDefault();
		setEmailError('');
		setPasswordError('');

		if (!email || !password || !Utils.validateEmail(email)) {
			!password && setPasswordError(ERROR_EMPTY_FIELD);
			!Utils.validateEmail(email) && setEmailError(ERROR_EMAIL);
			!email && setEmailError(ERROR_EMPTY_FIELD);
			return;
		}

		const {user, error} = await logInLocal(email, password);

		if (error) {
			switch (error.name) {
				case 'User Not Found':
				case 'Not Found':
					setEmailError(ERROR_NO_USER_FOUND);
					console.log(ERROR_NO_USER_FOUND);
					return;
					case 'Invalid Password':
					setPasswordError(ERROR_PASSWORD);
					console.log(ERROR_PASSWORD);
					return;
					
				default:
					console.log(error.name);
					return;
			}
		}

		if (user) {
			// Redirect
			console.log('Auth success');
			hideModal();
			history.go(0);
		}
	}
	
	return (
		<>
		<h1 className={classnames('modal__title', classes)}>Log In</h1>
		<form className="modal__form">
			<div className="modal__top">
				<div className="modal__inputContainer">
					<Input classes="modal__input" type="email" label="Email" name="login-email" isRequired={true} placeholder={PLACEHOLDER_EMAIL} onChange={emailChangeHandler}/>
					{emailError &&
						<div className="modal__error">
							<ArrowIcon classes="modal__errorIcon icon--turn180" color="#ff6c31"/> <div className="modal__errorMessage">{emailError}</div>
						</div>
					}
				</div>
				<div className="modal__inputContainer modal__inputContainer--last">
					<Input classes="modal__input" type="password" label="Password" name="login-password" isRequired={true} placeholder="Must have at least 6 characters" onChange={passwordChangeHandler}/>
					{passwordError &&
						<div className="modal__error">
							<ArrowIcon classes="modal__errorIcon icon--turn180" color="#ff6c31"/> <div className="modal__errorMessage">{passwordError}</div>
						</div>
					}
				</div>
				<p className="modal__underText clickableText clickableText--right clickableText--mt">Forgot password?</p>
			</div>
			<div className="modal__bottom">
				<span className="modal__textline">No account yet? <p className="clickableText clickableText--ml" onClick={signUpHandler}>Sign Up</p></span>
            	<Button text="Log In" classes="modal__button" onClick={loginHandler}/>
			</div>
		</form>
		</>
	);
};

export default LoginModal;
