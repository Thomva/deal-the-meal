import { default as React } from 'react';
import {default as classnames } from 'classnames';

const MenuIcon = ({ expanded, color = "black", onClick }) => {

  const clickHandler = (e) => {
    onClick && onClick(e);
  }

	return (
    <div className="icon icon--menu icon--clickable" onClick={(e) => clickHandler(e)}>
      <svg fill={`${color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <title>Menu</title>
        <g id="Laag_2" data-name="Laag 2">
          <g id="Menu">
            <rect
              x="40"
              width="20"
              height="100"
              rx="4"
              transform="translate(100 0) rotate(90)"
            />
            <rect
              x="40"
              y="40"
              width="20"
              height="50"
              rx="4"
              transform="translate(140 40) rotate(90)"
              className={classnames('icon--menuMoving', expanded && 'icon--menuMovingExpanded')}
            />
            <rect
              x="40"
              y="-40"
              width="20"
              height="100"
              rx="4"
              transform="translate(60 -40) rotate(90)"
            />
          </g>
        </g>
      </svg>
    </div>
	);
};

export default MenuIcon;
