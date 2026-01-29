/**
 * Reset Password Component (src/pages/ResetPasswordPage.jsx)
 * 
 * WHAT IT DOES:
 * Allows user to set a new password by providing the reset token and new password.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ResetPasswordPage = ({ setActivePage, initialToken = '' }) => {
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res.message);
      setTimeout(() => {
        setActivePage('login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Enter your reset token and your new password</p>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message} Redirecting to login...</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Reset Token</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Paste your reset token here" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <a href="#login" onClick={(e) => { e.preventDefault(); setActivePage('login'); }}>
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
