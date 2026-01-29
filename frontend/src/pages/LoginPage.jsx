/**
 * Login Page Component (src/pages/LoginPage.jsx)
 * 
 * WHAT IT DOES:
 * Renders Linear-style clean login form with direct Email & Password inputs,
 * User/Admin role toggle, and Forgot Password link.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ setActivePage }) => {
  const [selectedRole, setSelectedRole] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      setActivePage('dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Linear Style Icon */}
      <div className="linear-logo-icon">
        <svg viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>

      <div className="auth-card">
        <h2 className="auth-title">Log in to ProjectHub</h2>
        <p className="auth-subtitle">Enter your email and password to access your workspace</p>

        {/* User vs Admin Role Toggle Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: '#0f1012',
          padding: '0.3rem',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '1.5rem'
        }}>
          <button 
            type="button"
            className={`nav-link ${selectedRole === 'user' ? 'active' : ''}`}
            style={{ flex: 1, padding: '0.4rem', textAlign: 'center', fontSize: '0.85rem' }}
            onClick={() => { 
              setSelectedRole('user'); 
            }}
          >
            👤 User Role
          </button>
          <button 
            type="button"
            className={`nav-link ${selectedRole === 'admin' ? 'active' : ''}`}
            style={{ flex: 1, padding: '0.4rem', textAlign: 'center', fontSize: '0.85rem' }}
            onClick={() => { 
              setSelectedRole('admin'); 
            }}
          >
            🛡️ Admin Role
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Direct Email and Password Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder={selectedRole === 'admin' ? "admin@college.edu" : "user@college.edu"} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <a 
                href="#forgot-password" 
                style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', marginBottom: '0.4rem' }}
                onClick={(e) => { e.preventDefault(); setActivePage('forgot-password'); }}
              >
                Forgot password?
              </a>
            </div>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            {loading ? 'Signing in...' : `Sign In as ${selectedRole.toUpperCase()}`}
          </button>
        </form>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <p>
            Don't have an account?{' '}
            <a 
              href="#register" 
              style={{ color: 'var(--text-primary)', fontWeight: '600' }}
              onClick={(e) => { e.preventDefault(); setActivePage('register'); }}
            >
              Sign up
            </a>
            {' · '}
            <a 
              href="#landing" 
              style={{ color: 'var(--text-secondary)' }}
              onClick={(e) => { e.preventDefault(); setActivePage('landing'); }}
            >
              ← Back to Home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
