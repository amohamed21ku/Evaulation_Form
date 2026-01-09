import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import ProgressBar from '../components/ProgressBar';
import LanguageToggle from '../components/LanguageToggle';
import EmployeeInfo from '../components/sections/EmployeeInfo';
import RoleAwareness from '../components/sections/RoleAwareness';
import PastPerformance from '../components/sections/PastPerformance';
import CurrentPerformance from '../components/sections/CurrentPerformance';
import ContributionVsSalary from '../components/sections/ContributionVsSalary';
import CompanyImpact from '../components/sections/CompanyImpact';
import TeamEvaluation from '../components/sections/TeamEvaluation';
import FuturePerformance from '../components/sections/FuturePerformance';
import IdentityAndClosing from '../components/sections/IdentityAndClosing';

const EmployeeEvaluation = () => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalSteps = 8;

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('evaluationFormData');
    const savedStep = localStorage.getItem('evaluationFormStep');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('evaluationFormData', JSON.stringify(formData));
    localStorage.setItem('evaluationFormStep', currentStep.toString());
  }, [formData, currentStep]);

  const updateFormData = (sectionData) => {
    setFormData({ ...formData, ...sectionData });
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return formData.fullName && formData.jobRole && formData.department && formData.joinDate;
      case 7:
        return formData.commitmentActions && formData.commitmentActions.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
      window.scrollTo(0, 0);
    } else {
      alert('Please complete all required fields before continuing.');
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      alert('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      };

      await addDoc(collection(db, 'evaluations'), submissionData);

      localStorage.removeItem('evaluationFormData');
      localStorage.removeItem('evaluationFormStep');

      setIsCompleted(true);
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      alert('There was an error submitting your evaluation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <EmployeeInfo data={formData} onChange={updateFormData} />;
      case 1:
        return <RoleAwareness data={formData} onChange={updateFormData} />;
      case 2:
        return <PastPerformance data={formData} onChange={updateFormData} />;
      case 3:
        return <CurrentPerformance data={formData} onChange={updateFormData} />;
      case 4:
        return <ContributionVsSalary data={formData} onChange={updateFormData} />;
      case 5:
        return <CompanyImpact data={formData} onChange={updateFormData} />;
      case 6:
        return <TeamEvaluation data={formData} onChange={updateFormData} />;
      case 7:
        return <FuturePerformance data={formData} onChange={updateFormData} />;
      case 8:
        return <IdentityAndClosing data={formData} onChange={updateFormData} />;
      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <LanguageToggle />
        </div>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
          <h2 style={{ color: 'var(--success-color)', marginBottom: '16px' }}>
            {t('completion.title')}
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '24px' }}>
            {t('completion.message')}
          </p>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t('completion.description')}
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: '24px' }}
            onClick={() => window.location.reload()}
          >
            {t('completion.submitAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div></div>
          <LanguageToggle />
        </div>

        <header style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{ color: 'var(--primary-color)', marginBottom: '8px' }}>
            {t('employeeInfo.title')}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t('common.estimatedTime')}
          </p>
        </header>

        <ProgressBar currentStep={currentStep + 1} totalSteps={totalSteps} />

        {renderStep()}

        <div className="form-navigation">
          {currentStep > 0 && (
            <button
              className="btn btn-secondary"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              ← {t('common.back')}
            </button>
          )}

          {currentStep < totalSteps - 1 ? (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              style={{ marginLeft: 'auto' }}
            >
              {t('common.continue')} →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ marginLeft: 'auto', backgroundColor: 'var(--success-color)' }}
            >
              {isSubmitting ? t('common.submitting') : t('common.submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeEvaluation;
