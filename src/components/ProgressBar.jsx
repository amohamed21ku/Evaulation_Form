import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const { t } = useLanguage();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-text">
        {t('common.step')} {currentStep} {t('common.of')} {totalSteps}
      </div>
    </div>
  );
};

export default ProgressBar;
