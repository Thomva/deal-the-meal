import { default as React } from 'react';
import { default as classnames } from 'classnames';

const CrossIcon = ({ classes, color = '#111e2a', onClick }) => {

	const clickHandler = (e) => {
    onClick && onClick(e);
	};

	return (
		<div
			className={classnames('icon icon--cross icon--clickable', classes)}
			onClick={(e) => clickHandler(e)}
		>
			<svg fill={`${color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
				<title>Cross</title>
				<g id="Laag_2" data-name="Laag 2">
					<g id="Cross">
						<path d="M100,44V56a4,4,0,0,1-4,4H70A10,10,0,0,0,60,70V96a4,4,0,0,1-4,4H44a4,4,0,0,1-4-4V70A10,10,0,0,0,30,60H4a4,4,0,0,1-4-4V44a4,4,0,0,1,4-4H30A10,10,0,0,0,40,30V4a4,4,0,0,1,4-4H56a4,4,0,0,1,4,4V30A10,10,0,0,0,70,40H96A4,4,0,0,1,100,44Z" />
					</g>
				</g>
			</svg>
		</div>
	);
};

export default CrossIcon;
