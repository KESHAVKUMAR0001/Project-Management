/**
 * Navbar Component (src/components/Navbar.jsx)
 * 
 * Simple header bar for navigation: Dashboard | Projects | My Tasks | Logout
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ activePage, setActivePage }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setActivePage('dashboard')}>
        <div className="nav-brand-logo">P</div>
        <span>ProjectHub</span>
      </div>

      <div className="nav-links">
        <button 
          className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActivePage('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-link ${activePage === 'projects' ? 'active' : ''}`}
          onClick={() => setActivePage('projects')}
        >
          Projects
        </button>
        <button 
          className={`nav-link ${activePage === 'tasks' ? 'active' : ''}`}
          onClick={() => setActivePage('tasks')}
        >
          My Tasks
        </button>
      </div>

      <div className="nav-user">
        <span className="user-badge">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#5e6ad2', display: 'inline-block' }}></span>
          {user.name}
        </span>
        <button className="btn btn-secondary btn-sm" onClick={logout}>
          Log out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
