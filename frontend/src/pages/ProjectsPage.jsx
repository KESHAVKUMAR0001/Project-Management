/**
 * Projects Page Component (src/pages/ProjectsPage.jsx)
 * 
 * WHAT IT DOES:
 * Displays all accessible projects and allows creating a new project.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const ProjectsPage = ({ setActivePage, setSelectedProjectId }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      setProjects(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      await API.post('/projects', { name, description });
      setName('');
      setDescription('');
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project and all its tasks?')) return;

    try {
      await API.delete(`/projects/${projectId}`);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading projects...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage all projects you own or belong to.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <h3>No Projects Found</h3>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Get started by creating your first project.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Create Project
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {projects.map((project) => {
            const isOwner = project.owner?._id === user?.id || project.owner?._id === user?._id || user?.role === 'admin';
            return (
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
                  <h3 className="card-title">{project.name}</h3>
                  <p className="card-description">{project.description || 'No description provided.'}</p>
                </div>

                <div>
                  <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <strong>Members:</strong> {project.members?.map(m => m.name).join(', ') || 'Only Owner'}
                  </div>

                  <div className="card-meta">
                    <span>Owner: {project.owner?.name}</span>
                    {isOwner && (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={(e) => handleDeleteProject(e, project._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Create New Project</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Mobile Banking App" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Describe the main goal of this project..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
