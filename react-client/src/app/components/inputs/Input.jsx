import { default as React, useState, useEffect } from 'react';
import { default as classnames } from 'classnames';

const Input = ({ type, isRequired = false, label, name, placeholder, onChange, onBlur, classes, defaultValue, value, min, max, pattern, inputRef }) => {
  const [showRequired, setShowRequired] = useState(isRequired);

  useEffect(() => {
    defaultValue && setShowRequired(defaultValue === '');
    console.log(defaultValue);
  }, [defaultValue]);

  const changeHandler = (e) => {
    isRequired && setShowRequired(e.target.value === '');
    onChange && onChange(e);
  }

	return (
    <div className="input">
      <h3 className={classnames('input__label', classes, showRequired && 'input__label--required')}>{label}</h3>
      <div className={`input__${type}`}>
        <input className="input__field" type={type} name={name} id={name} required={isRequired} placeholder={placeholder} defaultValue={defaultValue} value={value} onChange={changeHandler} onBlur={onBlur} min={min} max={max} pattern={pattern} ref={inputRef}/>
        <div className="input__underline"></div>
      </div>
    </div>
	);
};

export default Input;
