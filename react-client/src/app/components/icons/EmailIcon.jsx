import { default as React } from 'react';
import { default as classnames } from 'classnames';

const EmailIcon = ({ classes, color = '#111e2a', onClick }) => {

const clickHandler = (e) => {
onClick && onClick(e);
};

return (
<div className={classnames('icon icon--email icon--clickable', classes)} onClick={(e)=> clickHandler(e)}>
	<svg fill={`${color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60">
		<title>Email</title>
		<g id="Laag_2" data-name="Laag 2">
			<g id="Email">
				<path
					d="M50,30.67a20,20,0,0,0,10.29-2.85L100,4a4,4,0,0,0-4-4H4A4,4,0,0,0,0,4L39.71,27.82A20,20,0,0,0,50,30.67Z" />
				<path
					d="M50,34.67a24,24,0,0,1-12.35-3.42L0,8.67V56a4,4,0,0,0,4,4H96a4,4,0,0,0,4-4V8.67L62.35,31.25A24,24,0,0,1,50,34.67Z" />
			</g>
		</g>
	</svg>
</div>
);
};

export default EmailIcon;