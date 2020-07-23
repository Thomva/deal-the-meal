import { default as React } from 'react';
import { default as classnames } from 'classnames';

const DragHandle = ({ classes, color = '#111e2a', onClick }) => {
	const clickHandler = (e) => {
		onClick && onClick(e);
	};

	return (
		<div className={classnames('icon icon--dragHandle', classes)} onClick={(e)=> clickHandler(e)}
			>
			<svg fill={`${color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 62"><title>Drag Handle</title><g id="Laag_2" data-name="Laag 2"><g id="Drag_Handle" data-name="Drag Handle"><rect x="38" width="24" height="24" rx="4"/><rect x="76" width="24" height="24" rx="4"/><rect width="24" height="24" rx="4"/><rect x="38" y="38" width="24" height="24" rx="4"/><rect x="76" y="38" width="24" height="24" rx="4"/><rect y="38" width="24" height="24" rx="4"/></g></g></svg>
		</div>
	);
};

export default DragHandle;