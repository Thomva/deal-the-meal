import { default as React } from 'react';
import { default as classnames } from 'classnames';

const ShowIcon = ({ classes, color = '#111e2a', onClick }) => {
	const clickHandler = (e) => {
		onClick && onClick(e);
	};

	return (
	<div className={classnames('icon icon--eyeShow icon--clickable', classes)} onClick={(e)=> clickHandler(e)}
		>
		<svg fill={`${color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60">
			<title>Show</title>
			<g id="Laag_2" data-name="Laag 2">
				<g id="Show">
					<path
						d="M50,0C28.11,0,0,13.43,0,30S28.11,60,50,60s50-13.43,50-30S71.89,0,50,0Zm0,47A17,17,0,1,1,67,30,17,17,0,0,1,50,47Z" />
				</g>
			</g>
		</svg>
	</div>
	);
};

export default ShowIcon;