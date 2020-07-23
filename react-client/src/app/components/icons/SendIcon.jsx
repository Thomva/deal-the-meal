import { default as React } from 'react';
import { default as classnames } from 'classnames';

const SendIcon = ({ classes, color = '#111e2a', onClick }) => {

const clickHandler = (e) => {
onClick && onClick(e);
};

return (
<div className={classnames('icon icon--send icon--clickable', classes)} onClick={(e)=> clickHandler(e)}>
	<svg fill={`${color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80"><title>Send</title><g id="Laag_2" data-name="Laag 2"><g id="Send"><path d="M93.26,49.45,5.3,79.78A4,4,0,0,1,0,76V51.51a4,4,0,0,1,3.22-3.92l28.52-5.71a2,2,0,0,0,0-3.92L3.22,32.25A4,4,0,0,1,0,28.33V4A4,4,0,0,1,5.3.22l88,30.32A10,10,0,0,1,93.26,49.45Z"/></g></g></svg>
</div>
);
};

export default SendIcon;