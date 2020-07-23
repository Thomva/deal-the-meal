import { default as React } from 'react';
import { default as classnames } from 'classnames';

const ArrowIcon = ({ color = 'black', classes = null, onClick = null }) => {

	const clickHandler = (e) => {
		onClick && onClick(e);
	};

	return (
		<div className={classnames('icon icon--arrow', classes)} onClick={(e) => clickHandler(e)}>
			<svg
				fill={color}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 52.1 100"
			>
				<title>Arrow</title>
				<g id="Laag_2" data-name="Laag 2">
					<g id="Arrow">
						<path d="M41.33,76,18.78,98.56a4.9,4.9,0,0,1-6.94,0L1.44,88.16a4.9,4.9,0,0,1,0-6.94L24,58.67a12.26,12.26,0,0,0,0-17.34L1.44,18.78a4.9,4.9,0,0,1,0-6.94l10.4-10.4a4.9,4.9,0,0,1,6.94,0L41.33,24a36.82,36.82,0,0,1,0,52Z" />
					</g>
				</g>
			</svg>
		</div>
	);
};

export default ArrowIcon;
