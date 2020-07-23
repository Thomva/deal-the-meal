import { default as React, useState } from 'react';
import { default as classnames } from 'classnames';
import { Button } from '../buttons';
import { useModal } from '../../services';

const ItemCancelEditModal = ({ classes = '', show, onConfirm, onDone }) => {
	const [ currentStep, setCurrentStep ] = useState(0);
	const { showModal } = useModal();

	const keepClickHandler = e => {
		showModal();
	}

	const deleteClickHandler = e => {
		e.preventDefault();
		
		switch (currentStep) {
			case 0:
				// Delete
				onConfirm && onConfirm();
				onDone && onDone();
				showModal();
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
					<h1 className={classnames('modal__title modal__title--message', classes)}>Are you sure you want to cancel withou saving?</h1>
				</>
			)}
		</div>
		<div className="modal__bottom">
			{currentStep === 0 && (
				<div className="modal__bottomButtons">
					<Button text="Keep It" onClick={keepClickHandler} />
					<Button text="Don't save" onClick={deleteClickHandler} variant="light" />
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

export default ItemCancelEditModal;
