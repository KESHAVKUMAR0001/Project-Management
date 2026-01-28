/**
 * Auth Context (src/context/AuthContext.jsx)
 * 
 * WHAT IT DOES:
 * React Context that holds the authentication state (currently logged-in user, login status)
 * and provides auth functions (login, register, logout, forgotPassword, resetPassword).
 * 
 * WHY IT IS NEEDED:
 * Allows any React component in the application to easily access logged-in user data
 * and perform login/logout actions without passing props everywhere.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app startup
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data.data);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
    return res.data;
  };

  // Register handler
  const register = async (name, email, password, role) => {
    const res = await API.post('/auth/register', { name, email, password, role });
    const { user, accessToken, refreshToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
    return res.data;
  };

  // Logout handler
  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  // Forgot password request
  const forgotPassword = async (email) => {
    const res = await API.post('/auth/forgot-password', { email });
    return res.data;
  };

  // Reset password request
  const resetPassword = async (token, newPassword) => {
    const res = await API.post('/auth/reset-password', { token, newPassword });
    return res.data;
  };

  // Update profile
  const updateProfile = async (data) => {
    const res = await API.put('/users/profile', data);
    if (res.data.data) {
      setUser(prev => ({ ...prev, ...res.data.data }));
    }
    return res.data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
