/**
 * Dashboard Page Component (src/pages/DashboardPage.jsx)
 * 
 * WHAT IT DOES:
 * Overview dashboard displaying user summary stats, quick access to projects, and assigned tasks.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const DashboardPage = ({ setActivePage, setSelectedProjectId }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          API.get('/projects'),
          API.get('/tasks/my-tasks')
        ]);
        setProjects(projectsRes.data.data || []);
        setMyTasks(tasksRes.data.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const doneCount = myTasks.filter(t => t.status === 'DONE').length;

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome, {user?.name}! 👋</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here is your project and task overview.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setActivePage('projects')}>
          + New Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>My Projects</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#60a5fa' }}>{projects.length}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Assigned Tasks</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#fbbf24' }}>{myTasks.length}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Completed Tasks</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#4ade80' }}>{doneCount}</div>
        </div>
      </div>

      {/* Projects Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Recent Projects ({projects.length})</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('projects')}>
            View All Projects
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            No projects found. Create a new project to get started!
          </div>
        ) : (
          <div className="grid-3">
            {projects.slice(0, 3).map((project) => (
              <div 
                key={project._id} 
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedProjectId(project._id);
                  setActivePage('project-details');
                }}
              >
                <div>
                  <h4 className="card-title">{project.name}</h4>
                  <p className="card-description">{project.description || 'No description provided.'}</p>
                </div>
                <div className="card-meta">
                  <span>Owner: {project.owner?.name}</span>
                  <span>{project.members?.length || 1} Members</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Tasks Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>My Assigned Tasks ({myTasks.length})</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('tasks')}>
            View All Tasks
          </button>
        </div>

        {myTasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            No tasks assigned to you yet.
          </div>
        ) : (
          <div className="grid-3">
            {myTasks.slice(0, 3).map((task) => (
              <div key={task._id} className="card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority} Priority</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                    Project: {task.project?.name || 'N/A'}
                  </p>
                </div>
                <div className="card-meta">
                  <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActivePage('tasks')}
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
