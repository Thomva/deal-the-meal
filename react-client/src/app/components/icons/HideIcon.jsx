import { default as React } from 'react';
import { default as classnames } from 'classnames';

const HideIcon = ({ classes, color = '#111e2a', onClick }) => {
	const clickHandler = (e) => {
		onClick && onClick(e);
	};

	return (
		<div className={classnames('icon icon--eyeHide icon--clickable', classes)} onClick={(e)=> clickHandler(e)}
			>
			<svg fill={`${color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 71.91">
				<title>Hide</title>
				<g id="Laag_2" data-name="Laag 2">
					<g id="Hide">
						<path
							d="M35.49,43.4A17,17,0,0,1,58.86,20l12-12A69.1,69.1,0,0,0,50,4.54C28.11,4.54,0,18,0,34.54,0,44,9.11,52.38,21,57.89Z" />
						<path
							d="M79,11.19l7.82-7.82a2,2,0,0,0,0-2.77A2,2,0,0,0,84,.54l-22,22-24,24-13,13-9,9a2,2,0,0,0,2.83,2.82L29.14,61.05A69.1,69.1,0,0,0,50,64.54c21.89,0,50-13.43,50-30C100,25.11,90.89,16.7,79,11.19ZM50,51.54a16.9,16.9,0,0,1-8.86-2.49L64.51,25.68A17,17,0,0,1,50,51.54Z" />
					</g>
				</g>
			</svg>
		</div>
	);
};

export default HideIcon;