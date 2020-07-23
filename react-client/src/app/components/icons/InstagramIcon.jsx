import { default as React } from 'react';
import { default as classnames } from 'classnames';


const InstagramIcon = ({ classes, color = '#111e2a', onClick }) => {

const clickHandler = (e) => {
onClick && onClick(e);
};

return (
<div className={classnames('icon icon--instagram icon--clickable fab fa-instagram', classes)} onClick={(e)=> clickHandler(e)}>
</div>
);
};

export default InstagramIcon;