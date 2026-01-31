/**
 * Main App Component (src/App.jsx)
 * 
 * Manages view routing between Landing, Auth (Login, Register, Forgot/Reset Password),
 * and main pages (Dashboard, Projects, ProjectDetails, Tasks).
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import TasksPage from './pages/TasksPage';
import './index.css';

const MainContent = () => {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('landing');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [resetToken, setResetToken] = useState('');

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#08090a', color: '#f7f8f8' }}>
        <h2>Loading ProjectHub...</h2>
      </div>
    );
  }

  // Unauthenticated page views
  if (!user) {
    if (activePage === 'login') {
      return <LoginPage setActivePage={setActivePage} />;
    }
    if (activePage === 'register') {
      return <RegisterPage setActivePage={setActivePage} />;
    }
    if (activePage === 'forgot-password') {
      return <ForgotPasswordPage setActivePage={setActivePage} setResetToken={setResetToken} />;
    }
    if (activePage === 'reset-password') {
      return <ResetPasswordPage setActivePage={setActivePage} initialToken={resetToken} />;
    }
    return <LandingPage setActivePage={setActivePage} />;
  }

  // Authenticated workspace
  return (
    <div className="app-layout">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-container">
        {(activePage === 'dashboard' || activePage === 'landing') && (
          <DashboardPage 
            setActivePage={setActivePage} 
            setSelectedProjectId={setSelectedProjectId} 
          />
        )}
        {activePage === 'projects' && (
          <ProjectsPage 
            setActivePage={setActivePage} 
            setSelectedProjectId={setSelectedProjectId} 
          />
        )}
        {activePage === 'project-details' && (
          <ProjectDetailsPage 
            projectId={selectedProjectId} 
            setActivePage={setActivePage} 
          />
        )}
        {activePage === 'tasks' && <TasksPage />}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
