import { default as React } from 'react';
import { default as classnames } from 'classnames';

const StarIcon = ({ classes, color = '#111e2a', onClick }) => {

const clickHandler = (e) => {
onClick && onClick(e);
};

return (
<div className={classnames('icon icon--star', classes)} onClick={(e)=> clickHandler(e)}>
	<svg fill={`${color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 95.5">
		<title>Star</title>
		<g id="Laag_2" data-name="Laag 2">
			<g id="Star">
				<path
					d="M53.72,2.52l9.16,23a10,10,0,0,0,8.64,6.28l24.73,1.61a4,4,0,0,1,2.3,7.06L79.49,56.32a10,10,0,0,0-3.31,10.17l6.12,24a4,4,0,0,1-6,4.37l-21-13.24a10,10,0,0,0-10.68,0L23.71,94.87a4,4,0,0,1-6-4.37l6.12-24a10,10,0,0,0-3.31-10.17L1.45,40.49a4,4,0,0,1,2.3-7.06l24.73-1.61a10,10,0,0,0,8.64-6.28l9.16-23A4,4,0,0,1,53.72,2.52Z" />
			</g>
		</g>
	</svg>
</div>
);
};

export default StarIcon;