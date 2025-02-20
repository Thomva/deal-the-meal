import { default as React } from 'react';
import { default as classnames } from 'classnames';

const LocationIcon = ({ classes, color = '#111e2a', onClick }) => {

const clickHandler = (e) => {
onClick && onClick(e);
};

return (
<div className={classnames('icon icon--location', classes)} onClick={(e)=> clickHandler(e)}>
	<svg fill={`${color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.64 100">
		<title>Location</title>
		<g id="Laag_2" data-name="Laag 2">
			<g id="Location">
				<path
					d="M33.82,0A33.82,33.82,0,0,0,0,33.82C0,48.69,21.42,84.13,30.17,98a4.32,4.32,0,0,0,7.31,0c8.74-13.85,30.16-49.29,30.16-64.16A33.82,33.82,0,0,0,33.82,0Zm0,46.82a13,13,0,1,1,13-13A13,13,0,0,1,33.82,46.82Z" />
			</g>
		</g>
	</svg>
</div>
);
};

export default LocationIcon;