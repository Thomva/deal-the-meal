import { default as React, useState } from 'react';
import { default as classnames } from 'classnames';
import { ArrowIcon } from '../icons';
import { useEffect } from 'react';

const Checkbox = ({ isRequired = false, label, id, name, onChange, classes, checked }) => {
  const [isChecked, setIsChecked] = useState();

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const clickHandler = (e) => {
    onChange && onChange(!isChecked);
    setIsChecked(!isChecked);
  }

	return (
    <div className="input">
      <div className={classnames('input__checkbox', classes)} onClick={clickHandler}>
        <div className="input__checkboxSquare">
          <ArrowIcon color="#b24116" classes={classnames('input__checkboxMark icon--turn90', !isChecked && 'input__checkboxMark--hide')}/>
        </div>
        <label className="input__checkboxLabel" htmlFor={id}>{label}</label>
      </div>
    </div>
	);
};

export default Checkbox;
