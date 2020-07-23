import { default as React, useState } from 'react';
import { default as classnames } from 'classnames';
import { Button } from '../buttons';
import { useModal } from '../../services';

const UserDeleteModal = ({ classes = '', show, onConfirm, onDone }) => {
	const [ currentStep, setCurrentStep ] = useState(0);
	const { showModal } = useModal();

	const keepClickHandler = e => {
		showModal();
	}

	const deleteClickHandler = async (e) => {
		e.preventDefault();
		
		switch (currentStep) {
			case 0:
				// Delete
				onConfirm && await onConfirm();
				break;
			case 1:
				// Close modal
				showModal();
				onDone && onDone();
				break;
		
			default:
				break;
		}

		// Go to next step / sign up if fields are valid
		setCurrentStep(currentStep + 1);
	}


	
	return (
		<>
		<div className="modal__top modal__top--message">
			{currentStep === 0 && (
				<>
					<h1 className={classnames('modal__title modal__title--message', classes)}>Are you sure you want to delete this account?</h1>
					<div className="modal__subTitle modal__subTitle--message">This can't be undone</div>
				</>
			)}
			{currentStep === 1 && (
				<h1 className={classnames('modal__title modal__title--message', classes)}>Account deleted!</h1>
			)}
		</div>
		<div className="modal__bottom">
			{currentStep === 0 && (
				<div className="modal__bottomButtons">
					<Button text="Keep It" onClick={keepClickHandler} />
					<Button text="Delete It" onClick={deleteClickHandler} variant="light" />
				</div>
			)}
			{currentStep === 1 && (
				<div className="modal__bottomButtons">
					<Button text="Done" onClick={deleteClickHandler} />
				</div>
			)}
		</div>
		</>
	);
};

export default UserDeleteModal;
