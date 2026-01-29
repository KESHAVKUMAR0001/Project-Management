/**
 * Forgot Password Component (src/pages/ForgotPasswordPage.jsx)
 * 
 * WHAT IT DOES:
 * Linear-styled password reset request screen.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ForgotPasswordPage = ({ setActivePage, setResetToken }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setMessage(res.message);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="linear-logo-icon">
        <svg viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>

      <div className="auth-card">
        <h2 className="auth-title">Reset password</h2>
        <p className="auth-subtitle">Enter your account email to receive a reset token</p>

        {error && <div className="alert alert-error">{error}</div>}
        {message && (
          <div className="alert alert-success">
            {message}
            <div style={{ marginTop: '0.8rem' }}>
              <button 
                className="btn btn-primary btn-sm btn-full"
                onClick={() => setActivePage('reset-password')}
              >
                Proceed to Reset Password
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="alex@college.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Sending...' : 'Get Reset Token'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <a 
            href="#login" 
            style={{ color: 'var(--text-secondary)' }}
            onClick={(e) => { e.preventDefault(); setActivePage('login'); }}
          >
            ← Back to log in
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
