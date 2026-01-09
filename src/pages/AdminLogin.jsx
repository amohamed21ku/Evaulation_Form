import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

const AdminLogin = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser) {
      navigate('/admin/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError(t('admin.emailPasswordError'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(t('admin.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--neutral-bg)',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <LanguageToggle />
      </div>

      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '24px', textAlign: 'center' }}>
          {t('admin.login')}
        </h2>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('admin.email')}</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.password')}</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('admin.password')}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? t('admin.loggingIn') : t('admin.loginButton')}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a
            href="/"
            style={{
              color: 'var(--primary-color)',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            ← {t('admin.backToEvaluation')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
