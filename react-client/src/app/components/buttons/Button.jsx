import { default as React } from 'react';
import { default as classnames } from 'classnames';
import { useModal } from '../../services';

const Button = ({ text, variant, classes, modalType, onClick, type }) => {
  const { showModal } = useModal();

  const clickHandler = (e) => {
    
    onClick && onClick(e);
    modalType && showModal(modalType);
  }

	return (
    <>
    <button className={classnames('button', variant ? `button--${variant}` : '', classes)} type={type} onClick={(e) => clickHandler(e)}>
      {text}
    </button>
    </>
	);
};

export default Button;
