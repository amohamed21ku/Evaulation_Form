import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const EmployeeInfo = ({ data, onChange }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>
        {t('employeeInfo.title')}
      </h2>
      <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
        {t('employeeInfo.description')}
      </p>

      <div className="form-group">
        <label className="form-label">{t('employeeInfo.fullName')} *</label>
        <input
          type="text"
          className="form-input"
          value={data.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder={t('employeeInfo.fullNamePlaceholder')}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('employeeInfo.jobRole')} *</label>
        <input
          type="text"
          className="form-input"
          value={data.jobRole || ''}
          onChange={(e) => handleChange('jobRole', e.target.value)}
          placeholder={t('employeeInfo.jobRolePlaceholder')}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('employeeInfo.department')} *</label>
        <input
          type="text"
          className="form-input"
          value={data.department || ''}
          onChange={(e) => handleChange('department', e.target.value)}
          placeholder={t('employeeInfo.departmentPlaceholder')}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('employeeInfo.joinDate')} *</label>
        <input
          type="date"
          className="form-input"
          value={data.joinDate || ''}
          onChange={(e) => handleChange('joinDate', e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default EmployeeInfo;
