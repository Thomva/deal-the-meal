import { default as React } from 'react';
import { ItemCancelEditModal, ItemDeleteModal, LoginModal, ModalBase, SignupModal } from '../modals';
import ReviewModal from './ReviewModal';
import UserDeleteModal from './UserDeleteModal';

const Modal = ({ classes = '', type, onConfirm, onDone, ownerId }) => {
	switch (type) {
		case 'login':
			return (<ModalBase show={true} classes={classes}><LoginModal /></ModalBase>)
		case 'signup':
			return (<ModalBase show={true} classes={classes}><SignupModal /></ModalBase>)
		case 'cancelItem':
			return (<ModalBase show={true} classes={classes}><ItemCancelEditModal onConfirm={onConfirm} onDone={onDone} /></ModalBase>)
		case 'deleteItem':
			return (<ModalBase show={true} classes={classes}><ItemDeleteModal onConfirm={onConfirm} onDone={onDone} /></ModalBase>)
		case 'deleteUser':
			return (<ModalBase show={true} classes={classes}><UserDeleteModal onConfirm={onConfirm} onDone={onDone} /></ModalBase>)
		case 'review':
			return (<ModalBase show={true} classes={classes}><ReviewModal ownerId={ownerId} /></ModalBase>)
	
		default:
			document.querySelector('body').style.overflow = 'initial';
			return null;
	}
};

export default Modal;
