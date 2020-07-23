import { default as React } from 'react';
import { useModal } from '../../services';
import { useEffect } from 'react';
import Button from './Button';
import { useState } from 'react';

const AuthButton = ({ type = 'login', classes, onClick }) => {
	const { showModal } = useModal();
	const [text, setText] = useState();
	const [variant, setVariant] = useState();
	const [buttonType, setButtonType] = useState();
	const [modalType, setModalType] = useState('');

	useEffect(() => {
		switch (type) {
			case 'login':
				setText('Log in');
				setVariant('light');
				setModalType(type);
				break;
			case 'signup':
				setText('Sign Up');
				setButtonType('signup');
				setModalType(type);
				break;

			default:
				break;
		}
	}, [type]);

	const clickHandler = (e) => {
		onClick && onClick(e);
		modalType && showModal(modalType);
	};

	return (
		<Button
			text={text}
			variant={variant}
			type={buttonType}
      modalType={modalType}
      classes={classes}
		/>
	);
};

export default AuthButton;
