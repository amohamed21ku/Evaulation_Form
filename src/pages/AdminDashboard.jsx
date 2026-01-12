import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AdminDashboard = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    salaryMismatch: '',
    engagementLevel: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const q = query(collection(db, 'evaluations'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvaluations(data);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      alert('Error loading evaluations. Please check Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getEmployeeFlags = (evaluation) => {
    const flags = [];

    // High salary / low contribution
    if (evaluation.salaryComparison === 'less' && evaluation.pastContribution < 5) {
      flags.push({ type: 'warning', label: '⚠ Low contribution' });
    }

    // High contributor
    if (evaluation.pastContribution >= 8 || evaluation.currentContribution >= 8) {
      flags.push({ type: 'star', label: '⭐ High contributor' });
    }

    // High future potential
    if (evaluation.commitmentLevel >= 8 && evaluation.futureExpectation === 'significant-increase') {
      flags.push({ type: 'potential', label: '🔺 High potential' });
    }

    // Low engagement
    if (evaluation.identityStatement === 'disengaged' || evaluation.identityStatement === 'coasting') {
      flags.push({ type: 'concern', label: '🔻 Low engagement' });
    }

    return flags;
  };

  // Calculate metrics
  const calculateMetrics = () => {
    if (evaluations.length === 0) return null;

    const avgPast = evaluations.reduce((sum, e) => sum + (e.pastContribution || 0), 0) / evaluations.length;
    const avgCurrent = evaluations.reduce((sum, e) => sum + (e.currentContribution || 0), 0) / evaluations.length;
    const avgCommitment = evaluations.reduce((sum, e) => sum + (e.commitmentLevel || 0), 0) / evaluations.length;

    const salaryDist = {
      less: evaluations.filter(e => e.salaryComparison === 'less').length,
      equal: evaluations.filter(e => e.salaryComparison === 'equal').length,
      more: evaluations.filter(e => e.salaryComparison === 'more').length
    };

    // Calculate multiplier breakdown for those who said "more than salary"
    const multiplierDist = {
      '1.5': evaluations.filter(e => e.salaryComparison === 'more' && e.salaryMultiplier === '1.5').length,
      '2': evaluations.filter(e => e.salaryComparison === 'more' && e.salaryMultiplier === '2').length,
      '3': evaluations.filter(e => e.salaryComparison === 'more' && e.salaryMultiplier === '3').length,
      '4': evaluations.filter(e => e.salaryComparison === 'more' && e.salaryMultiplier === '4').length,
      '5': evaluations.filter(e => e.salaryComparison === 'more' && e.salaryMultiplier === '5').length,
      '6+': evaluations.filter(e => e.salaryComparison === 'more' && e.salaryMultiplier === '6+').length,
    };

    return {
      total: evaluations.length,
      avgPast: avgPast.toFixed(1),
      avgCurrent: avgCurrent.toFixed(1),
      avgCommitment: avgCommitment.toFixed(1),
      salaryDist,
      multiplierDist
    };
  };

  // Filter and search
  const getFilteredEvaluations = () => {
    return evaluations.filter(evaluation => {
      const matchesSearch = searchTerm === '' ||
        evaluation.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.jobRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.department?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = filters.department === '' ||
        evaluation.department === filters.department;

      const matchesSalary = filters.salaryMismatch === '' ||
        (filters.salaryMismatch === 'mismatch' && evaluation.salaryComparison === 'less') ||
        (filters.salaryMismatch === 'aligned' && evaluation.salaryComparison !== 'less');

      const matchesEngagement = filters.engagementLevel === '' ||
        (filters.engagementLevel === 'high' && (evaluation.identityStatement === 'engaged' || evaluation.identityStatement === 'committed')) ||
        (filters.engagementLevel === 'low' && (evaluation.identityStatement === 'disengaged' || evaluation.identityStatement === 'coasting'));

      return matchesSearch && matchesDepartment && matchesSalary && matchesEngagement;
    });
  };

  const exportToExcel = () => {
    const data = getFilteredEvaluations().map(e => ({
      'Name': e.fullName,
      'Role': e.jobRole,
      'Department': e.department,
      'Past Performance': e.pastContribution,
      'Current Performance': e.currentContribution,
      'Future Commitment': e.commitmentLevel,
      'Salary Comparison': e.salaryComparison,
      'Engagement Level': e.identityStatement,
      'Submitted': new Date(e.submittedAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Evaluations');
    XLSX.writeFile(wb, 'employee-evaluations.xlsx');
  };

  const exportToPDF = async (evaluation) => {
    // Create a temporary container for the PDF content
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '210mm'; // A4 width
    tempDiv.style.padding = '20mm';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '12px';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.color = '#333';

    // Build the HTML content with all evaluation data
    tempDiv.innerHTML = `
      <div style="max-width: 170mm;">
        <h1 style="color: #2563eb; margin-bottom: 10px; font-size: 24px;">Employee Evaluation Report</h1>
        <p style="color: #666; margin-bottom: 30px;">${new Date(evaluation.submittedAt).toLocaleDateString()}</p>

        <div style="margin-bottom: 25px;">
          <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Employee Information</h2>
          <p><strong>Name:</strong> ${evaluation.fullName}</p>
          <p><strong>Role:</strong> ${evaluation.jobRole}</p>
          <p><strong>Department:</strong> ${evaluation.department}</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Performance Metrics</h2>
          <p><strong>Past Performance (Last 6 months):</strong> ${evaluation.pastContribution}/10</p>
          <p><strong>Current Performance:</strong> ${evaluation.currentContribution}/10</p>
          <p><strong>Future Commitment:</strong> ${evaluation.commitmentLevel}/10</p>
          <p><strong>Team Performance:</strong> ${evaluation.teamPerformance}/10</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Compensation & Engagement</h2>
          <p><strong>Salary Comparison:</strong> ${evaluation.salaryComparison}</p>
          ${evaluation.salaryMultiplier ? `<p><strong>Value Multiplier:</strong> ${evaluation.salaryMultiplier}x</p>` : ''}
          <p><strong>Engagement Level:</strong> ${evaluation.identityStatement}</p>
          <p><strong>Future Expectation:</strong> ${evaluation.futureExpectation || 'Not specified'}</p>
          ${evaluation.mainBlocker ? `<p><strong>Main Barrier:</strong> ${evaluation.mainBlocker}</p>` : ''}
        </div>

        ${evaluation.roleDefinition ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Role Definition</h2>
            <p style="white-space: pre-wrap;">${evaluation.roleDefinition}</p>
          </div>
        ` : ''}

        ${evaluation.topContributions ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Top Contributions</h2>
            <p style="white-space: pre-wrap;">${evaluation.topContributions}</p>
          </div>
        ` : ''}

        ${evaluation.improvementArea ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Area for Improvement</h2>
            <p style="white-space: pre-wrap;">${evaluation.improvementArea}</p>
          </div>
        ` : ''}

        ${evaluation.salaryReasoning ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Salary Comparison Reasoning</h2>
            <p style="white-space: pre-wrap;">${evaluation.salaryReasoning}</p>
          </div>
        ` : ''}

        ${evaluation.impactAreas && evaluation.impactAreas.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Impact Areas</h2>
            <p>${evaluation.impactAreas.map(area => {
              const translations = {
                'revenue': 'Revenue Growth',
                'efficiency': 'Operational Efficiency',
                'customer': 'Customer Satisfaction',
                'innovation': 'Innovation',
                'team': 'Team Development',
                'quality': 'Quality Improvement',
                'strategy': 'Strategic Planning',
                'culture': 'Culture Building'
              };
              return translations[area] || area;
            }).join(', ')}</p>
          </div>
        ` : ''}

        ${evaluation.impactClarity ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Impact Clarity</h2>
            <p style="white-space: pre-wrap;">${evaluation.impactClarity}</p>
          </div>
        ` : ''}

        ${evaluation.impactClarityHelp ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">How to Improve Impact Clarity</h2>
            <p style="white-space: pre-wrap;">${evaluation.impactClarityHelp}</p>
          </div>
        ` : ''}

        ${evaluation.teamStrength ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Team Strength</h2>
            <p style="white-space: pre-wrap;">${evaluation.teamStrength}</p>
          </div>
        ` : ''}

        ${evaluation.teamGap ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Team Gap/Weakness</h2>
            <p style="white-space: pre-wrap;">${evaluation.teamGap}</p>
          </div>
        ` : ''}

        ${evaluation.commitmentActions ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Commitment Actions</h2>
            <p style="white-space: pre-wrap;">${evaluation.commitmentActions}</p>
          </div>
        ` : ''}

        ${evaluation.futurePlans ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Future Plans</h2>
            <p style="white-space: pre-wrap;">${evaluation.futurePlans}</p>
          </div>
        ` : ''}

        ${evaluation.finalMessage ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #2563eb; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #2563eb; padding-bottom: 5px;">Final Thoughts</h2>
            <p style="white-space: pre-wrap;">${evaluation.finalMessage}</p>
          </div>
        ` : ''}
      </div>
    `;

    // Append to body temporarily
    document.body.appendChild(tempDiv);

    try {
      // Convert the HTML to canvas with high quality
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Create PDF from canvas
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate the ratio to fit width
      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      // If content fits on one page
      if (scaledHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight);
      } else {
        // Multi-page handling
        let position = 0;
        let pageNumber = 0;

        while (position < scaledHeight) {
          if (pageNumber > 0) {
            pdf.addPage();
          }

          // Calculate the portion of the image to show on this page
          const sourceY = (position / ratio);
          const sourceHeight = (pdfHeight / ratio);

          // Create a temporary canvas for this page
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(sourceHeight, imgHeight - sourceY);

          const pageCtx = pageCanvas.getContext('2d');
          pageCtx.drawImage(
            canvas,
            0, sourceY,
            canvas.width, pageCanvas.height,
            0, 0,
            canvas.width, pageCanvas.height
          );

          const pageImgData = pageCanvas.toDataURL('image/png');
          pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageCanvas.height * ratio);

          position += pdfHeight;
          pageNumber++;
        }
      }

      pdf.save(`${evaluation.fullName.replace(/\s+/g, '-')}-evaluation.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }
  };

  const metrics = calculateMetrics();
  const filteredEvaluations = getFilteredEvaluations();
  const uniqueDepartments = [...new Set(evaluations.map(e => e.department))].filter(Boolean);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--neutral-bg)' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--white)',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ color: 'var(--primary-color)', fontSize: '24px' }}>
            {t('admin.dashboard')}
          </h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <LanguageToggle />
            <button className="btn btn-secondary" onClick={handleLogout}>
              {t('admin.logout')}
            </button>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
        {/* Metrics Overview */}
        {metrics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                {t('admin.totalResponses')}
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary-color)' }}>
                {metrics.total}
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                {t('admin.avgPastPerformance')}
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--secondary-color)' }}>
                {metrics.avgPast}/10
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                {t('admin.avgCurrentPerformance')}
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary-color)' }}>
                {metrics.avgCurrent}/10
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                {t('admin.avgCommitment')}
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--success-color)' }}>
                {metrics.avgCommitment}/10
              </p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>
              {t('admin.salaryVsContribution')}
            </h3>
            {metrics && (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { name: t('admin.lessThanSalary'), value: metrics.salaryDist.less },
                  { name: t('admin.equalToSalary'), value: metrics.salaryDist.equal },
                  { name: '1.5×', value: metrics.multiplierDist['1.5'] },
                  { name: '2×', value: metrics.multiplierDist['2'] },
                  { name: '3×', value: metrics.multiplierDist['3'] },
                  { name: '4×', value: metrics.multiplierDist['4'] },
                  { name: '5×', value: metrics.multiplierDist['5'] },
                  { name: '6×+', value: metrics.multiplierDist['6+'] }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--primary-color)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>
              {t('admin.performanceScatter')}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="pastContribution" name={t('admin.past')} unit="/10" domain={[0, 10]} />
                <YAxis type="number" dataKey="currentContribution" name={t('admin.current')} unit="/10" domain={[0, 10]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Employees" data={evaluations} fill="var(--primary-color)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '14px' }}>{t('admin.search')}</label>
              <input
                type="text"
                className="form-input"
                placeholder={t('admin.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '14px' }}>{t('admin.department')}</label>
              <select
                className="form-select"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                <option value="">{t('admin.allDepartments')}</option>
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '14px' }}>{t('admin.salaryAlignment')}</label>
              <select
                className="form-select"
                value={filters.salaryMismatch}
                onChange={(e) => setFilters({ ...filters, salaryMismatch: e.target.value })}
              >
                <option value="">{t('admin.all')}</option>
                <option value="mismatch">{t('admin.mismatch')}</option>
                <option value="aligned">{t('admin.aligned')}</option>
              </select>
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '14px' }}>{t('admin.engagement')}</label>
              <select
                className="form-select"
                value={filters.engagementLevel}
                onChange={(e) => setFilters({ ...filters, engagementLevel: e.target.value })}
              >
                <option value="">{t('admin.all')}</option>
                <option value="high">{t('admin.high')}</option>
                <option value="low">{t('admin.low')}</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={exportToExcel}>
            {t('admin.exportToExcel')}
          </button>
        </div>

        {/* Employee List */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>
            {t('admin.employeeEvaluations')} ({filteredEvaluations.length})
          </h3>

          {filteredEvaluations.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
              {t('admin.noEvaluations')}
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>{t('admin.name')}</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>{t('admin.role')}</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>{t('admin.department')}</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>{t('admin.past')}</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>{t('admin.current')}</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>{t('admin.commitment')}</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>{t('admin.flags')}</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvaluations.map((evaluation) => {
                    const flags = getEmployeeFlags(evaluation);
                    return (
                      <tr
                        key={evaluation.id}
                        style={{ borderBottom: '1px solid var(--border-color)' }}
                      >
                        <td style={{ padding: '12px' }}>{evaluation.fullName}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                          {evaluation.jobRole}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{evaluation.department}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>
                          {evaluation.pastContribution || '-'}/10
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>
                          {evaluation.currentContribution || '-'}/10
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>
                          {evaluation.commitmentLevel || '-'}/10
                        </td>
                        <td style={{ padding: '12px' }}>
                          {flags.map((flag, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '12px',
                                marginRight: '4px',
                                display: 'inline-block'
                              }}
                              title={flag.label}
                            >
                              {flag.label}
                            </span>
                          ))}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => setSelectedEmployee(evaluation)}
                          >
                            {t('admin.view')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setSelectedEmployee(null)}
          >
            <div
              className="card"
              style={{
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ color: 'var(--primary-color)', marginBottom: '8px' }}>
                    {selectedEmployee.fullName}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {selectedEmployee.jobRole} • {selectedEmployee.department}
                  </p>
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px' }}
                  onClick={() => setSelectedEmployee(null)}
                >
                  {t('admin.close')}
                </button>
              </div>

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Performance Section */}
                <div>
                  <h3 style={{ color: 'var(--primary-color)', marginBottom: '12px', fontSize: '18px' }}>
                    {t('admin.performanceMetrics')}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div style={{ padding: '12px', backgroundColor: 'var(--neutral-bg)', borderRadius: '8px' }}>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t('admin.past')} (6 months)</p>
                      <p style={{ fontSize: '24px', fontWeight: '600' }}>{selectedEmployee.pastContribution}/10</p>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: 'var(--neutral-bg)', borderRadius: '8px' }}>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t('admin.current')}</p>
                      <p style={{ fontSize: '24px', fontWeight: '600' }}>{selectedEmployee.currentContribution}/10</p>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: 'var(--neutral-bg)', borderRadius: '8px' }}>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t('admin.commitment')}</p>
                      <p style={{ fontSize: '24px', fontWeight: '600' }}>{selectedEmployee.commitmentLevel}/10</p>
                    </div>
                  </div>
                </div>

                {/* Key Insights */}
                <div>
                  <h3 style={{ color: 'var(--primary-color)', marginBottom: '12px', fontSize: '18px' }}>
                    {t('admin.keyInsights')}
                  </h3>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <p><strong>{t('admin.salaryComparison')}:</strong> {selectedEmployee.salaryComparison}</p>
                    {selectedEmployee.salaryMultiplier && (
                      <p><strong>{t('admin.valueMultiplier')}:</strong> {selectedEmployee.salaryMultiplier}×</p>
                    )}
                    <p><strong>{t('admin.engagementLevel')}:</strong> {selectedEmployee.identityStatement}</p>
                    <p><strong>{t('admin.teamPerformance')}:</strong> {selectedEmployee.teamPerformance}/10</p>
                    <p><strong>{t('admin.mainBarrier')}:</strong> {selectedEmployee.mainBlocker || t('admin.noneSpecified')}</p>
                  </div>
                </div>

                {/* Written Responses */}
                {selectedEmployee.topContributions && (
                  <div>
                    <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>{t('admin.topContributions')}</h4>
                    <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px' }}>
                      {selectedEmployee.topContributions}
                    </p>
                  </div>
                )}

                {selectedEmployee.commitmentActions && (
                  <div>
                    <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>{t('admin.commitmentActions')}</h4>
                    <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px' }}>
                      {selectedEmployee.commitmentActions}
                    </p>
                  </div>
                )}

                {selectedEmployee.finalMessage && (
                  <div>
                    <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>{t('admin.finalThoughts')}</h4>
                    <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px' }}>
                      {selectedEmployee.finalMessage}
                    </p>
                  </div>
                )}

                {/* Full Evaluation Responses */}
                <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '24px', marginTop: '24px' }}>
                  <h3 style={{ color: 'var(--primary-color)', marginBottom: '16px', fontSize: '18px' }}>
                    Full Evaluation Responses
                  </h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {selectedEmployee.roleDefinition && (
                      <div>
                        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {t('roleAwareness.roleDefinition')}
                        </h4>
                        <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                          {selectedEmployee.roleDefinition}
                        </p>
                      </div>
                    )}

                    {selectedEmployee.topContributions && (
                      <div>
                        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {t('pastPerformance.topContributions')}
                        </h4>
                        <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                          {selectedEmployee.topContributions}
                        </p>
                      </div>
                    )}

                    {selectedEmployee.improvementArea && (
                      <div>
                        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {t('pastPerformance.improvement')}
                        </h4>
                        <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                          {selectedEmployee.improvementArea}
                        </p>
                      </div>
                    )}

                    {selectedEmployee.salaryReasoning && (
                      <div>
                        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {t('contributionSalary.reasoning')}
                        </h4>
                        <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                          {selectedEmployee.salaryReasoning}
                        </p>
                      </div>
                    )}

                    {selectedEmployee.impactAreas && selectedEmployee.impactAreas.length > 0 && (
                      <div>
                        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {t('companyImpact.impactAreas')}
                        </h4>
                        <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                          {selectedEmployee.impactAreas.map(area => {
                            const areaTranslations = {
                              'revenue': t('companyImpact.revenue'),
                              'efficiency': t('companyImpact.efficiency'),
                              'customer': t('companyImpact.customer'),
                              'innovation': t('companyImpact.innovation'),
                              'team': t('companyImpact.team'),
                              'quality': t('companyImpact.quality'),
                              'strategy': t('companyImpact.strategy'),
                              'culture': t('companyImpact.culture')
                            };
                            return areaTranslations[area] || area;
                          }).join(', ')}
                        </p>
                      </div>
                    )}

                    {selectedEmployee.impactClarity && (
                      <div>
                        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {t('companyImpact.clarity')}
                        </h4>
                        <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                          {selectedEmployee.impactClarity}
                        </p>
                      </div>
                    )}

                    {selectedEmployee.impactClarityHelp && (
                      <div>
                        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {t('companyImpact.clarityHelp')}
                        </h4>
                        <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                          {selectedEmployee.impactClarityHelp}
                        </p>
                      </div>
                    )}

                    {selectedEmployee.teamStrength && (
                      <div>
                        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {t('teamEvaluation.teamStrength')}
                        </h4>
                        <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                          {selectedEmployee.teamStrength}
                        </p>
                      </div>
                    )}

                    {selectedEmployee.teamGap && (
                      <div>
                        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {t('teamEvaluation.teamGap')}
                        </h4>
                        <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                          {selectedEmployee.teamGap}
                        </p>
                      </div>
                    )}

                    {selectedEmployee.commitmentActions && (
                      <div>
                        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {t('futurePerformance.actions')}
                        </h4>
                        <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                          {selectedEmployee.commitmentActions}
                        </p>
                      </div>
                    )}

                    {selectedEmployee.futurePlans && (
                      <div>
                        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {t('identity.futurePlans')}
                        </h4>
                        <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                          {selectedEmployee.futurePlans}
                        </p>
                      </div>
                    )}

                    {selectedEmployee.finalMessage && (
                      <div>
                        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {t('identity.finalMessage')}
                        </h4>
                        <p style={{ backgroundColor: 'var(--neutral-bg)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                          {selectedEmployee.finalMessage}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => exportToPDF(selectedEmployee)}
                >
                  {t('admin.exportToPDF')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
