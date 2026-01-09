# Remaining Translation Updates

## ✅ Completed Sections
1. EmployeeInfo - Fully translated
2. RoleAwareness - Fully translated
3. PastPerformance - Fully translated
4. CurrentPerformance - Fully translated
5. ContributionVsSalary - Fully translated

## 📝 Still Need Translation (Pattern is Established)

For each remaining component, follow this exact pattern:

### Step 1: Add import
```javascript
import { useLanguage } from '../../contexts/LanguageContext';
```

### Step 2: Add hook
```javascript
const { t } = useLanguage();
```

### Step 3: Replace all hardcoded text with translation keys

---

## Remaining Files & Their Translation Keys

### 6. CompanyImpact.jsx
Replace with:
- `t('companyImpact.title')`
- `t('companyImpact.impactAreas')`
- `t('companyImpact.revenue')`, `t('companyImpact.efficiency')`, etc. for checkboxes
- `t('companyImpact.clarity')`
- `t('companyImpact.yes')`, `t('companyImpact.somewhat')`, `t('companyImpact.no')`, `t('companyImpact.unsure')`
- `t('companyImpact.clarityHelp')`
- `t('companyImpact.clarityHelpPlaceholder')`

### 7. TeamEvaluation.jsx
Replace with:
- `t('teamEvaluation.title')`
- `t('teamEvaluation.teamPerformance')`
- `t('teamEvaluation.relativeContribution')`
- `t('teamEvaluation.below')`, `t('teamEvaluation.average')`, `t('teamEvaluation.above')`, `t('teamEvaluation.top')`
- `t('teamEvaluation.teamStrength')`
- `t('teamEvaluation.teamStrengthPlaceholder')`
- `t('teamEvaluation.teamGap')`
- `t('teamEvaluation.teamGapPlaceholder')`
- `t('teamEvaluation.microText')`

### 8. BarriersToPerformance.jsx
Replace with:
- `t('barriers.title')`
- `t('barriers.mainBlocker')`
- `t('barriers.none')`, `t('barriers.resources')`, `t('barriers.clarity')`, etc. for radio options
- `t('barriers.supportNeeded')`
- `t('barriers.supportNeededPlaceholder')`
- `t('barriers.microText')`

### 9. FuturePerformance.jsx
Replace with:
- `t('futurePerformance.title')`
- `t('futurePerformance.expectation')`
- `t('futurePerformance.decrease')`, `t('futurePerformance.same')`, etc. for radio options
- `t('futurePerformance.commitment')`
- `t('futurePerformance.actions')`
- `t('futurePerformance.actionsPlaceholder')`
- `t('futurePerformance.microText')`

### 10. IdentityAndClosing.jsx
Replace with:
- `t('identity.title')`
- `t('identity.statement')`
- `t('identity.engaged')`, `t('identity.committed')`, etc. for radio options
- `t('identity.finalMessage')`
- `t('identity.finalMessagePlaceholder')`
- `t('identity.thankYou')`

### 11. AdminLogin.jsx (src/pages/)
Replace with:
- `t('admin.login')`
- `t('admin.email')`
- `t('admin.password')`
- `t('admin.loginButton')` or `t('admin.loggingIn')`
- `t('admin.backToEvaluation')`
- Error messages: `t('admin.loginError')`, `t('admin.emailPasswordError')`

### 12. AdminDashboard.jsx (src/pages/)
This is the largest file. Replace with:
- `t('admin.dashboard')`
- `t('admin.logout')`
- `t('admin.totalResponses')`, `t('admin.avgPastPerformance')`, etc. for metrics
- `t('admin.salaryVsContribution')`, `t('admin.performanceScatter')` for chart titles
- `t('admin.search')`, `t('admin.searchPlaceholder')`
- `t('admin.department')`, `t('admin.allDepartments')`
- `t('admin.exportToExcel')`
- `t('admin.employeeEvaluations')`
- `t('admin.noEvaluations')`
- `t('admin.name')`, `t('admin.role')`, `t('admin.past')`, `t('admin.current')`, `t('admin.commitment')`, `t('admin.flags')`, `t('admin.actions')`
- `t('admin.view')`
- Modal: `t('admin.close')`, `t('admin.performanceMetrics')`, `t('admin.keyInsights')`, etc.
- `t('admin.exportToPDF')`

---

## Quick Reference Template

For each file, this is the pattern:

```javascript
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext'; // or '../contexts/' for pages

const ComponentName = ({ data, onChange }) => {
  const { t } = useLanguage();

  // ... rest of component

  return (
    <div className="card">
      <h2>{t('section.title')}</h2>
      <label>{t('section.label')}</label>
      <input placeholder={t('section.placeholder')} />
      <p className="micro-text">{t('section.microText')}</p>
    </div>
  );
};
```

---

## All Translation Keys Are Ready!

All English and Turkish translations are already in:
`src/translations/index.js`

You just need to connect them to the components!

---

## Testing Checklist

After completing all translations:

1. ✅ Start app: `npm run dev`
2. ✅ Click language toggle (🌐)
3. ✅ Verify all sections switch languages
4. ✅ Fill out form in Turkish
5. ✅ Switch to English mid-form (data persists)
6. ✅ Submit form
7. ✅ Test admin login in both languages
8. ✅ Test admin dashboard in both languages
9. ✅ Export to Excel/PDF

---

## Current Status: 5/12 Components Translated (42%)

Ready to complete the remaining 7 components!
