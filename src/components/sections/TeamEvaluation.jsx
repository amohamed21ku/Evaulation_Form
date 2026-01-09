import React from 'react';
import Slider from '../Slider';
import RadioGroup from '../RadioGroup';
import { useLanguage } from '../../contexts/LanguageContext';

const TeamEvaluation = ({ data, onChange }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const relativeContributionOptions = [
    { value: 'below', label: t('teamEvaluation.below') },
    { value: 'average', label: t('teamEvaluation.average') },
    { value: 'above', label: t('teamEvaluation.above') },
    { value: 'top', label: t('teamEvaluation.top') }
  ];

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>
        {t('teamEvaluation.title')}
      </h2>

      <div className="form-group">
        <label className="form-label">
          {t('teamEvaluation.teamPerformance')}
        </label>
        <Slider
          value={data.teamPerformance || 5}
          onChange={(value) => handleChange('teamPerformance', value)}
          min={1}
          max={10}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('teamEvaluation.relativeContribution')}
        </label>
        <RadioGroup
          name="relativeContribution"
          options={relativeContributionOptions}
          value={data.relativeContribution || ''}
          onChange={(value) => handleChange('relativeContribution', value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('teamEvaluation.teamStrength')}
        </label>
        <input
          type="text"
          className="form-input"
          value={data.teamStrength || ''}
          onChange={(e) => handleChange('teamStrength', e.target.value)}
          placeholder={t('teamEvaluation.teamStrengthPlaceholder')}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('teamEvaluation.teamGap')}
        </label>
        <input
          type="text"
          className="form-input"
          value={data.teamGap || ''}
          onChange={(e) => handleChange('teamGap', e.target.value)}
          placeholder={t('teamEvaluation.teamGapPlaceholder')}
        />
        <p className="micro-text">{t('teamEvaluation.microText')}</p>
      </div>
    </div>
  );
};

export default TeamEvaluation;
