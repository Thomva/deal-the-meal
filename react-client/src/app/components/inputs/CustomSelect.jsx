import { default as React, useState, useRef } from 'react';
import { default as classnames } from 'classnames';
import { useEffect } from 'react';
import { ArrowIcon } from '../icons';

const CustomSelect = ({ isRequired, label, name, choices, onChange, classes, selectedValue }) => {
  const [selected, setSelected] = useState();
  const [isOpened, setIsOpened] = useState(false);
  const selectComponent = useRef();
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    }
  }, []);

  useEffect(() => {
    setSelected(choices.find((option) => option.isSelected === true));
  }, [choices]);

  const changeHandler = (e) => {
    setSelected(e);
    onChange && onChange(e);
  }

  const toggleOpen = () => {
    setIsOpened(!isOpened);
  }

  const handleDocumentClick = (e) => {
    if (selectComponent && selectComponent.current) {
      !selectComponent.current.contains(e.target) && setIsOpened(false);
    }
  }


	return (
    <div className={classnames('input input--select', classes)} ref={selectComponent}>
      <h3 className="input__label">{label}</h3>

      <div className="select" onClick={toggleOpen}>
        <div className={classnames('select__box', isOpened && 'select__box--hide')} >
          <div className="select__selectedLabel">{selected && selected.name}</div>
          <ArrowIcon color="#b24116" classes="icon--turn90" />
        </div>
        <div className={classnames('input__underline', isOpened && 'select__box--hide')}></div>
        <div className={classnames('select__optionContainer', !isOpened && 'select__optionContainer--hide')}>
          <div className="select__options">
            {choices.map((option, i) => (
              <div key={i} className="select__option" onClick={() => changeHandler(option)}>{option.name}</div>
            ))}
        </div>
        </div>
      </div>
    </div>
	);
};

export default CustomSelect;
