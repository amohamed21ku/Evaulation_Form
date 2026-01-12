import React from 'react';
import RadioGroup from '../RadioGroup';
import Slider from '../Slider';
import { useLanguage } from '../../contexts/LanguageContext';

const FuturePerformance = ({ data, onChange }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const expectationOptions = [
    { value: 'decrease', label: t('futurePerformance.decrease') },
    { value: 'same', label: t('futurePerformance.same') },
    { value: 'moderate-increase', label: t('futurePerformance.moderateIncrease') },
    { value: 'significant-increase', label: t('futurePerformance.significantIncrease') }
  ];

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>
        {t('futurePerformance.title')}
      </h2>

      <div className="form-group">
        <label className="form-label">
          {t('futurePerformance.expectation')} *
        </label>
        <RadioGroup
          name="futureExpectation"
          options={expectationOptions}
          value={data.futureExpectation || ''}
          onChange={(value) => handleChange('futureExpectation', value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('futurePerformance.commitment')}
        </label>
        <Slider
          value={data.commitmentLevel || 5}
          onChange={(value) => handleChange('commitmentLevel', value)}
          min={1}
          max={10}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('futurePerformance.actions')} *
        </label>
        <textarea
          className="form-textarea"
          value={data.commitmentActions || ''}
          onChange={(e) => handleChange('commitmentActions', e.target.value)}
          placeholder={t('futurePerformance.actionsPlaceholder')}
          rows="4"
          required
        />
        <p className="micro-text">{t('futurePerformance.microText')}</p>
      </div>
    </div>
  );
};

export default FuturePerformance;
