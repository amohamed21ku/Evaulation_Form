import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Slider from '../Slider';
import RadioGroup from '../RadioGroup';

const CurrentPerformance = ({ data, onChange }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const comparisonOptions = [
    { value: 'lower', label: t('currentPerformance.lower') },
    { value: 'same', label: t('currentPerformance.same') },
    { value: 'higher', label: t('currentPerformance.higher') }
  ];

  const consistencyOptions = [
    { value: 'very-inconsistent', label: t('currentPerformance.veryInconsistent') },
    { value: 'somewhat-inconsistent', label: t('currentPerformance.somewhatInconsistent') },
    { value: 'mostly-consistent', label: t('currentPerformance.mostlyConsistent') },
    { value: 'very-consistent', label: t('currentPerformance.veryConsistent') }
  ];

  const pastScore = data.pastContribution || 5;
  const currentScore = data.currentContribution || 5;

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>
        {t('currentPerformance.title')}
      </h2>

      <div className="form-group">
        <label className="form-label">
          {t('currentPerformance.currentContribution')}
        </label>
        <Slider
          value={currentScore}
          onChange={(value) => handleChange('currentContribution', value)}
          min={1}
          max={10}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('currentPerformance.comparison')} *
        </label>
        <RadioGroup
          name="performanceComparison"
          options={comparisonOptions}
          value={data.performanceComparison || ''}
          onChange={(value) => handleChange('performanceComparison', value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('currentPerformance.consistency')} *
        </label>
        <RadioGroup
          name="performanceConsistency"
          options={consistencyOptions}
          value={data.performanceConsistency || ''}
          onChange={(value) => handleChange('performanceConsistency', value)}
        />
      </div>

      {/* Visual Comparison */}
      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
          {t('currentPerformance.performanceComparison')}
        </p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              {t('currentPerformance.past')}
            </p>
            <div style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${pastScore * 10}%`,
                  backgroundColor: 'var(--secondary-color)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>{pastScore}/10</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              {t('currentPerformance.current')}
            </p>
            <div style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${currentScore * 10}%`,
                  backgroundColor: 'var(--primary-color)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>{currentScore}/10</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPerformance;
