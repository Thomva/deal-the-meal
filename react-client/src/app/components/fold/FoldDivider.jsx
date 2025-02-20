import { default as React } from 'react';
import { default as classnames } from 'classnames';


const FoldDivider = ({ classes, color = '#f5f2ca', onClick }) => {

	const clickHandler = (e) => {
    onClick && onClick(e);
	};

	return (
		<div
			className={classnames('foldDivider', classes)}
			onClick={(e) => clickHandler(e)}
		>
			<svg fill={`${color}`} xmlns="http://www.w3.org/2000/svg" width={`100%`} height="auto" viewBox="0 0 1920 120"><path d="M116-3598.5v-120H2036v114.921c-9.158-3.135-20.122-7.634-32.817-12.843l-.014-.005c-18.663-7.658-41.888-17.188-70.772-27.111-15.865-5.451-31.488-10.364-47.761-15.02-18.523-5.3-37.815-10.217-57.34-14.614-21.8-4.91-44.653-9.341-67.914-13.17-25.472-4.193-52.215-7.79-79.485-10.691-29.5-3.138-60.472-5.552-92.051-7.175-33.843-1.74-69.376-2.621-105.614-2.621-26.347,0-54.779.467-84.505,1.389-28.279.878-58.609,2.193-90.148,3.91-58.011,3.156-121.113,7.677-192.911,13.821-132.755,11.362-271.665,26.3-406,40.745l-.093.01-.014,0c-117.8,12.667-229.068,24.632-330.351,33.615-54.3,4.817-100.9,8.344-142.447,10.785-22.415,1.317-43.635,2.325-63.069,2.994C152.391-3598.857,133.318-3598.5,116-3598.5Z" transform="translate(-116 3718.5)"/></svg>
		</div>
	);
};

export default FoldDivider;
