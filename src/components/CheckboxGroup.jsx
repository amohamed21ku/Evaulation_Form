import React from 'react';

const CheckboxGroup = ({ options, values = [], onChange }) => {
  const handleChange = (optionValue) => {
    if (values.includes(optionValue)) {
      onChange(values.filter((v) => v !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  return (
    <div className="checkbox-group">
      {options.map((option) => (
        <label
          key={option.value}
          className={`checkbox-option ${
            values.includes(option.value) ? 'selected' : ''
          }`}
        >
          <input
            type="checkbox"
            value={option.value}
            checked={values.includes(option.value)}
            onChange={() => handleChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroup;
