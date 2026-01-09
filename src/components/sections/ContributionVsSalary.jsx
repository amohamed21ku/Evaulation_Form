import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import RadioGroup from '../RadioGroup';

const ContributionVsSalary = ({ data, onChange }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const comparisonOptions = [
    { value: 'less', label: t('contributionSalary.less') },
    { value: 'equal', label: t('contributionSalary.equal') },
    { value: 'more', label: t('contributionSalary.more') }
  ];

  const multiplierOptions = [
    { value: '1.5', label: '1.5×' },
    { value: '2', label: '2×' },
    { value: '3', label: '3×' },
    { value: '4', label: '4×' },
    { value: '5', label: '5×' },
    { value: '6+', label: '6×+' }
  ];

  return (
    <div className="card">
      <h2 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>
        {t('contributionSalary.title')}
      </h2>

      <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '24px' }}>
        <p style={{ fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>
          {t('contributionSalary.description')}
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('contributionSalary.question')}
        </label>
        <RadioGroup
          name="salaryComparison"
          options={comparisonOptions}
          value={data.salaryComparison || ''}
          onChange={(value) => {
            if (value !== 'more') {
              onChange({ ...data, salaryComparison: value, salaryMultiplier: '' });
            } else {
              handleChange('salaryComparison', value);
            }
          }}
        />
      </div>

      {data.salaryComparison === 'more' && (
        <div className="form-group" style={{ marginLeft: '20px', paddingLeft: '20px', borderLeft: '3px solid var(--primary-color)' }}>
          <label className="form-label">
            {t('contributionSalary.multiplier')}
          </label>
          <RadioGroup
            name="salaryMultiplier"
            options={multiplierOptions}
            value={data.salaryMultiplier || ''}
            onChange={(value) => handleChange('salaryMultiplier', value)}
          />
        </div>
      )}

      {data.salaryComparison && (
        <div className="form-group">
          <label className="form-label">
            {t('contributionSalary.reasoning')}
          </label>
          <textarea
            className="form-textarea"
            value={data.salaryReasoning || ''}
            onChange={(e) => handleChange('salaryReasoning', e.target.value)}
            placeholder={t('contributionSalary.reasoningPlaceholder')}
            rows="4"
          />
          <p className="micro-text">{t('contributionSalary.microText')}</p>
        </div>
      )}
    </div>
  );
};

export default ContributionVsSalary;
