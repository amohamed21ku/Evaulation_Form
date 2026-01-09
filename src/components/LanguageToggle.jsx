import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      style={{
        padding: '8px 16px',
        backgroundColor: 'var(--white)',
        border: '2px solid var(--primary-color)',
        borderRadius: '8px',
        color: 'var(--primary-color)',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'var(--primary-color)';
        e.target.style.color = 'var(--white)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'var(--white)';
        e.target.style.color = 'var(--primary-color)';
      }}
    >
      🌐 {language === 'en' ? 'Türkçe' : 'English'}
    </button>
  );
};

export default LanguageToggle;
