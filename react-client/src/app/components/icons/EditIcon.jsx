import { default as React } from 'react';
// import { Link } from 'react-router-dom';
import { default as classnames } from 'classnames';

// import './PageSection.scss';

const EditIcon = ({ classes, color = '#111e2a', onClick }) => {
// const [isExpanded, setIsExpanded] = useState(expanded);

const clickHandler = (e) => {
	onClick && onClick(e);
};

return (
<div className={classnames('icon icon--edit icon--turn45 icon--clickable', classes)} onClick={(e)=> clickHandler(e)}
	>
	<svg fill={`${color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 97.53">
		<title>Edit</title>
		<g id="Laag_2" data-name="Laag 2">
			<g id="Edit">
				<path d="M0,4v6H20V4a4,4,0,0,0-4-4H4A4,4,0,0,0,0,4Z" />
				<path d="M0,75.28a20,20,0,0,0,2.11,9l6.1,12.2a2,2,0,0,0,3.58,0l6.1-12.2a20,20,0,0,0,2.11-9V14H0Z" />
			</g>
		</g>
	</svg>
</div>
);
};

export default EditIcon;