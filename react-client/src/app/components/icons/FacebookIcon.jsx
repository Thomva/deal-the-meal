import { default as React } from 'react';
import { default as classnames } from 'classnames';


const FacebookIcon = ({ classes, color = '#111e2a', onClick }) => {

const clickHandler = (e) => {
onClick && onClick(e);
};

return (
<div className={classnames('icon icon--facebook icon--clickable fab fa-facebook-f', classes)} onClick={(e)=> clickHandler(e)}>
</div>
);
};

export default FacebookIcon;