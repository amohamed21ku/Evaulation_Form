import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Slider from '../Slider';

const PastPerformance = ({ data, onChange }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>
        {t('pastPerformance.title')}
      </h2>

      <div className="form-group">
        <label className="form-label">
          {t('pastPerformance.contribution')}
        </label>
        <Slider
          value={data.pastContribution || 5}
          onChange={(value) => handleChange('pastContribution', value)}
          min={1}
          max={10}
        />
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            <strong>{t('pastPerformance.scaleGuide')}</strong><br/>
            {t('pastPerformance.scaleDesc')}
          </p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('pastPerformance.topContributions')} *
        </label>
        <textarea
          className="form-textarea"
          value={data.topContributions || ''}
          onChange={(e) => handleChange('topContributions', e.target.value)}
          placeholder={t('pastPerformance.topContributionsPlaceholder')}
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('pastPerformance.improvement')} *
        </label>
        <textarea
          className="form-textarea"
          value={data.improvementArea || ''}
          onChange={(e) => handleChange('improvementArea', e.target.value)}
          placeholder={t('pastPerformance.improvementPlaceholder')}
          rows="3"
          required
        />
        <p className="micro-text">{t('pastPerformance.microText')}</p>
      </div>
    </div>
  );
};

export default PastPerformance;
