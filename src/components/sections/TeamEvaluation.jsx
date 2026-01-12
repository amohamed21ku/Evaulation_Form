import React from 'react';
import Slider from '../Slider';
import { useLanguage } from '../../contexts/LanguageContext';

const TeamEvaluation = ({ data, onChange }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

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
          {t('teamEvaluation.teamStrength')} *
        </label>
        <input
          type="text"
          className="form-input"
          value={data.teamStrength || ''}
          onChange={(e) => handleChange('teamStrength', e.target.value)}
          placeholder={t('teamEvaluation.teamStrengthPlaceholder')}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('teamEvaluation.teamGap')} *
        </label>
        <input
          type="text"
          className="form-input"
          value={data.teamGap || ''}
          onChange={(e) => handleChange('teamGap', e.target.value)}
          placeholder={t('teamEvaluation.teamGapPlaceholder')}
          required
        />
        <p className="micro-text">{t('teamEvaluation.microText')}</p>
      </div>
    </div>
  );
};

export default TeamEvaluation;
