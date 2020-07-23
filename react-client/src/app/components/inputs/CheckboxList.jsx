import { default as React, useState, useEffect } from 'react';
import { default as classnames } from 'classnames';
import Checkbox from './Checkbox';

const CheckboxList = ({ classes, isRequired, label, choices, name, onChange }) => {
	const [showRequired, setShowRequired] = useState(isRequired);
	const [checkedChoices, setCheckedChoices] = useState();

	
	useEffect(() => {
		const hasChecked = () => {
			const newCheckedChoices = choices && choices.filter((choice) => choice.checked);
	
			setCheckedChoices(newCheckedChoices);
			return newCheckedChoices && newCheckedChoices.length > 0;
		}

		isRequired && setShowRequired(!hasChecked());
	}, [choices, isRequired]);
  
	const changeHandler = (changedChoice) => {
		let newCheckedChoices = checkedChoices;
		if (changedChoice.checked === true) {
			newCheckedChoices.push(changedChoice);
		} else if (changedChoice.checked === false) {
			newCheckedChoices = newCheckedChoices.filter((choice) => (choice.id !== changedChoice.id));
		}
		setCheckedChoices(newCheckedChoices);
		isRequired && setShowRequired(newCheckedChoices.length < 1);
		onChange && onChange(newCheckedChoices);
	}

	return (
		<div className={classnames('input', classes)}>
      		<h3 className={classnames('input__label', showRequired && 'input__label--required')}>{label}</h3>
			<div className="input__checkboxGroup">
				{choices && choices.map((choice) => (
					<Checkbox key={choice.id} id={choice.id} label={choice.name} name={choice.slug} value={choice.id} checked={choice.checked} onChange={(isChecked) => changeHandler({...choice, checked: isChecked})} />
				))}
			</div>
		</div>
	);
};

export default CheckboxList;
