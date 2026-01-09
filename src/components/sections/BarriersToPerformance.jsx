import React from 'react';
import RadioGroup from '../RadioGroup';
import { useLanguage } from '../../contexts/LanguageContext';

const BarriersToPerformance = ({ data, onChange }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const blockerOptions = [
    { value: 'none', label: t('barriers.none') },
    { value: 'resources', label: t('barriers.resources') },
    { value: 'clarity', label: t('barriers.clarity') },
    { value: 'skills', label: t('barriers.skills') },
    { value: 'communication', label: t('barriers.communication') },
    { value: 'workload', label: t('barriers.workload') },
    { value: 'processes', label: t('barriers.processes') },
    { value: 'team', label: t('barriers.team') },
    { value: 'other', label: t('barriers.other') }
  ];

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>
        {t('barriers.title')}
      </h2>

      <div className="form-group">
        <label className="form-label">
          {t('barriers.mainBlocker')}
        </label>
        <RadioGroup
          name="mainBlocker"
          options={blockerOptions}
          value={data.mainBlocker || ''}
          onChange={(value) => handleChange('mainBlocker', value)}
        />
      </div>

      {data.mainBlocker && data.mainBlocker !== 'none' && (
        <div className="form-group" style={{ marginLeft: '20px', paddingLeft: '20px', borderLeft: '3px solid var(--primary-color)' }}>
          <label className="form-label">
            {t('barriers.supportNeeded')}
          </label>
          <textarea
            className="form-textarea"
            value={data.supportNeeded || ''}
            onChange={(e) => handleChange('supportNeeded', e.target.value)}
            placeholder={t('barriers.supportNeededPlaceholder')}
            rows="4"
          />
          <p className="micro-text">{t('barriers.microText')}</p>
        </div>
      )}
    </div>
  );
};

export default BarriersToPerformance;
