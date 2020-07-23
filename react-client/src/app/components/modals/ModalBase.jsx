import { default as React } from 'react';
import { default as classnames } from 'classnames';
import { useModal } from '../../services';
import CrossIcon from '../icons/CrossIcon';

const ModalBase = ({ children, classes = '' }) => {
	const { hideModal } = useModal();
	

	const clickHandlerClose = (e) => {
		e.preventDefault();
		hideModal();
	};

	return (
		<div className={classnames('modalContainer', classes)} style={{top: window.scrollY}}>
			<div className="modalBG" onClick={(e) => clickHandlerClose(e)}></div>

			<div className="modal">
				<CrossIcon classes="icon--turn45 modal__close" onClick={(e) => clickHandlerClose(e)} />
				{children}
			</div>
		</div>
	);
};

export default ModalBase;
