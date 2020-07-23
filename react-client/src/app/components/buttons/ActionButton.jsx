import { default as React } from 'react';
import { default as classnames } from 'classnames';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { EditIcon, ShowIcon, HideIcon, DeleteIcon } from '../icons';

const ActionButton = ({ variant, classes, onClick, onClickRoute }) => {
  const history = useHistory();
  const [icon, setIcon] = useState();

  useEffect(() => {
    const iconColor = "#ffffff";
    switch (variant) {
      case 'edit':
        setIcon(<EditIcon color={iconColor} />);
        break;
      case 'show':
        setIcon(<ShowIcon color={iconColor} />);
        break;
      case 'hide':
        setIcon(<HideIcon color={iconColor} />);
        break;
      case 'delete':
        setIcon(<DeleteIcon color={iconColor} />);
        break;
    
      default:
        break;
    }
  }, [variant]);

  const clickHandler = (e) => {
    onClick && onClick(e);
    onClickRoute && history.push(onClickRoute);
  }

	return (
    <button className={classnames('button', variant ? `button--${variant}` : '', 'button--action', classes)} onClick={(e) => clickHandler(e)}>
      {icon}
    </button>
	);
};

export default ActionButton;
