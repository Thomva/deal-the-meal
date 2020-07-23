import { default as React, useContext, createContext, useState } from 'react';
import Modal from '../components/modals/Modal';

const ModalContext = createContext();
const useModal = () => useContext(ModalContext);

const ModalProvider = ({ children }) => {
	const [modal, setModal] = useState(null);

	const showModal = (type, onConfirm, onDone, ownerId) => {
		setModal({ type, onConfirm, onDone, ownerId });
		document.querySelector('body').style.overflow = 'hidden';
	};

	const hideModal = () => {
		setModal(null);
		document.querySelector('body').style.overflow = 'initial';
	};

	const exports = {
		showModal,
		hideModal,
	};

	return (
		<ModalContext.Provider value={exports}>
			<Modal
				type={modal && modal.type}
				onConfirm={modal && modal.onConfirm}
				onDone={modal && modal.onDone}
				ownerId={modal && modal.ownerId}
			/>
			{children}
		</ModalContext.Provider>
	);
};

export { ModalContext, ModalProvider, useModal };

