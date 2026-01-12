import React from 'react';
import CheckboxGroup from '../CheckboxGroup';
import RadioGroup from '../RadioGroup';
import { useLanguage } from '../../contexts/LanguageContext';

const CompanyImpact = ({ data, onChange }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const impactAreas = [
    { value: 'revenue', label: t('companyImpact.revenue') },
    { value: 'efficiency', label: t('companyImpact.efficiency') },
    { value: 'customer', label: t('companyImpact.customer') },
    { value: 'innovation', label: t('companyImpact.innovation') },
    { value: 'team', label: t('companyImpact.team') },
    { value: 'quality', label: t('companyImpact.quality') },
    { value: 'strategy', label: t('companyImpact.strategy') },
    { value: 'culture', label: t('companyImpact.culture') }
  ];

  const clarityOptions = [
    { value: 'yes', label: t('companyImpact.yes') },
    { value: 'somewhat', label: t('companyImpact.somewhat') },
    { value: 'no', label: t('companyImpact.no') },
    { value: 'unsure', label: t('companyImpact.unsure') }
  ];

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>
        {t('companyImpact.title')}
      </h2>

      <div className="form-group">
        <label className="form-label">
          {t('companyImpact.impactAreas')} *
        </label>
        <CheckboxGroup
          options={impactAreas}
          values={data.impactAreas || []}
          onChange={(value) => handleChange('impactAreas', value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('companyImpact.clarity')} *
        </label>
        <RadioGroup
          name="impactClarity"
          options={clarityOptions}
          value={data.impactClarity || ''}
          onChange={(value) => handleChange('impactClarity', value)}
        />
      </div>

      {(data.impactClarity === 'no' || data.impactClarity === 'somewhat') && (
        <div className="form-group" style={{ marginLeft: '20px', paddingLeft: '20px', borderLeft: '3px solid var(--warning-color)' }}>
          <label className="form-label">
            {t('companyImpact.clarityHelp')} *
          </label>
          <textarea
            className="form-textarea"
            value={data.impactClarityHelp || ''}
            onChange={(e) => handleChange('impactClarityHelp', e.target.value)}
            placeholder={t('companyImpact.clarityHelpPlaceholder')}
            rows="3"
            required
          />
        </div>
      )}
    </div>
  );
};

export default CompanyImpact;
