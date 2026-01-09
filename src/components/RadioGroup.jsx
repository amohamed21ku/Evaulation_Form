import React from 'react';

const RadioGroup = ({ name, options, value, onChange }) => {
  return (
    <div className="radio-group">
      {options.map((option) => (
        <label
          key={option.value}
          className={`radio-option ${value === option.value ? 'selected' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
