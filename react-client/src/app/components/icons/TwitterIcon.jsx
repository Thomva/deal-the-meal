import { default as React } from 'react';
import { default as classnames } from 'classnames';


const TwitterIcon = ({ classes, color = '#111e2a', onClick }) => {

const clickHandler = (e) => {
onClick && onClick(e);
};

return (
<div className={classnames('icon icon--twitter icon--clickable fab fa-twitter', classes)} onClick={(e)=> clickHandler(e)}>
</div>
);
};

export default TwitterIcon;