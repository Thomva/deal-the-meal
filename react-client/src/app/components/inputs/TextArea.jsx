import { default as React, useState, useEffect } from 'react';
import { default as classnames } from 'classnames';

const TextArea = ({ classes, isRequired, label, name, placeholder, rows = 20, cols = 30, defaultValue, onChange }) => {
	const [showRequired, setShowRequired] = useState(isRequired);

	useEffect(() => {
		defaultValue && setShowRequired(defaultValue === '');
	}, [defaultValue]);

	const changeHandler = (e) => {
		isRequired && setShowRequired(e.target.value === '');
		onChange && onChange(e);
	}

	return (
		<div className={classnames('input', classes)}>
      		<h3 className={classnames('input__label', showRequired && 'input__label--required')}>{label}</h3>
			<div className={`input__textArea`}>
				<textarea
					className="input__area"
					name={name}
					id={name}
					required={isRequired}
					placeholder={placeholder}
					cols={cols}
					rows={rows}
					onChange={changeHandler}
					defaultValue={defaultValue}
				></textarea>
			</div>
		</div>
	);
};

export default TextArea;
