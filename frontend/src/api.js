/**
 * API Client (src/api.js)
 * 
 * WHAT IT DOES:
 * Configures an Axios HTTP client pre-configured with the backend API base URL
 * and automatically attaches the JWT Access Token from localStorage to every outgoing request.
 * 
 * WHY IT IS NEEDED:
 * Avoids repeating headers and base URLs across all components.
 */

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Request Interceptor: Automatically attach Bearer token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
