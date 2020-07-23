import { default as React } from 'react';
import { default as classnames } from 'classnames';

const DeleteIcon = ({ classes, color = '#111e2a', onClick }) => {
	const clickHandler = (e) => {
		onClick && onClick(e);
	};

	return (
		<div className={classnames('icon icon--delete icon--clickable', classes)} onClick={(e)=> clickHandler(e)}
			>
			<svg fill={`${color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 100"><title>Delete</title><g id="Laag_2" data-name="Laag 2"><g id="Delete"><path d="M4,90a10,10,0,0,0,10,10H50A10,10,0,0,0,60,90V16H4Z"/><path d="M60,4H42a4,4,0,0,0-4-4H26a4,4,0,0,0-4,4H4A4,4,0,0,0,0,8v4H64V8A4,4,0,0,0,60,4Z"/></g></g></svg>
		</div>
	);
};

export default DeleteIcon;