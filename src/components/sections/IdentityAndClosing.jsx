import React from 'react';
import RadioGroup from '../RadioGroup';
import { useLanguage } from '../../contexts/LanguageContext';

const IdentityAndClosing = ({ data, onChange }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const identityOptions = [
    { value: 'engaged', label: t('identity.engaged') },
    { value: 'committed', label: t('identity.committed') },
    { value: 'doing-job', label: t('identity.doingJob') },
    { value: 'coasting', label: t('identity.coasting') },
    { value: 'disengaged', label: t('identity.disengaged') }
  ];

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>
        {t('identity.title')}
      </h2>

      <div className="form-group">
        <label className="form-label">
          {t('identity.statement')}
        </label>
        <RadioGroup
          name="identityStatement"
          options={identityOptions}
          value={data.identityStatement || ''}
          onChange={(value) => handleChange('identityStatement', value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('identity.futurePlans')}
        </label>
        <textarea
          className="form-textarea"
          value={data.futurePlans || ''}
          onChange={(e) => handleChange('futurePlans', e.target.value)}
          placeholder={t('identity.futurePlansPlaceholder')}
          rows="5"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {t('identity.finalMessage')}
        </label>
        <textarea
          className="form-textarea"
          value={data.finalMessage || ''}
          onChange={(e) => handleChange('finalMessage', e.target.value)}
          placeholder={t('identity.finalMessagePlaceholder')}
          rows="4"
        />
      </div>

      <div style={{ marginTop: '32px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', color: 'var(--text-primary)', margin: 0 }}>
          {t('identity.thankYou')}
        </p>
      </div>
    </div>
  );
};

export default IdentityAndClosing;
