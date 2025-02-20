import { default as React } from 'react';
import { default as classnames } from 'classnames';

const PhoneIcon = ({ classes, color = '#111e2a', onClick }) => {

const clickHandler = (e) => {
onClick && onClick(e);
};

return (
<div className={classnames('icon icon--phone icon--clickable', classes)} onClick={(e)=> clickHandler(e)}>
	<svg fill={`${color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.33 100">
		<title>Phone</title>
		<g id="Laag_2" data-name="Laag 2">
			<g id="Phone">
				<path
					d="M16.67,33.33V66.67a4.44,4.44,0,0,0,4.44,4.44h7.78a4.44,4.44,0,0,1,4.44,4.45v20A4.44,4.44,0,0,1,28.89,100H22.22A22.22,22.22,0,0,1,0,77.78V22.22A22.22,22.22,0,0,1,22.22,0h6.67a4.44,4.44,0,0,1,4.44,4.44v20a4.44,4.44,0,0,1-4.44,4.45H21.11A4.44,4.44,0,0,0,16.67,33.33Z" />
			</g>
		</g>
	</svg>
</div>
);
};

export default PhoneIcon;