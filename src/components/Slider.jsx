import React from 'react';

const Slider = ({ value, onChange, min = 1, max = 10, labels = {} }) => {
  const getLabel = (val) => {
    if (labels[val]) return labels[val];
    if (val >= 1 && val <= 3) return 'Low';
    if (val >= 4 && val <= 6) return 'Expected';
    if (val >= 7 && val <= 8) return 'Strong';
    if (val >= 9 && val <= 10) return 'Exceptional';
    return '';
  };

  return (
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="slider"
      />
      <div className="slider-value">
        {value} - {getLabel(value)}
      </div>
      <div className="slider-labels">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Slider;
