import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const RoleAwareness = ({ data, onChange }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>
        {t('roleAwareness.title')}
      </h2>

      <div className="form-group">
        <label className="form-label">
          {t('roleAwareness.roleDefinition')}
        </label>
        <textarea
          className="form-textarea"
          value={data.roleDefinition || ''}
          onChange={(e) => handleChange('roleDefinition', e.target.value)}
          placeholder={t('roleAwareness.roleDefinitionPlaceholder')}
          rows="4"
        />
        <p className="micro-text">{t('roleAwareness.microText')}</p>
      </div>
    </div>
  );
};

export default RoleAwareness;
