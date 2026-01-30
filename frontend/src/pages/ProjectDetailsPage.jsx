/**
 * Project Details Page Component (src/pages/ProjectDetailsPage.jsx)
 * 
 * View single project: Members (+ Add Member) and Tasks (+ Add Task).
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const ProjectDetailsPage = ({ projectId, setActivePage }) => {
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add member state
  const [memberEmail, setMemberEmail] = useState('');
  const [addMemberMsg, setAddMemberMsg] = useState('');
  const [addMemberErr, setAddMemberErr] = useState('');

  // Create Task state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskErr, setTaskErr] = useState('');

  const fetchProjectDetails = async () => {
    try {
      const projRes = await API.get(`/projects/${projectId}`);
      setProject(projRes.data.data);
    } catch (err) {
      console.error('Failed to fetch project details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const isOwnerOrAdmin = project && (
    project.owner?._id === user?.id || 
    project.owner?._id === user?._id || 
    user?.role === 'admin'
  );

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddMemberMsg('');
    setAddMemberErr('');

    try {
      await API.post(`/projects/${projectId}/members`, { email: memberEmail });
      setAddMemberMsg('Member added successfully!');
      setMemberEmail('');
      fetchProjectDetails();
    } catch (err) {
      setAddMemberErr(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from project?')) return;
    try {
      await API.delete(`/projects/${projectId}/members/${userId}`);
      fetchProjectDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskErr('');

    try {
      await API.post(`/projects/${projectId}/tasks`, {
        title: taskTitle,
        description: taskDesc,
        assignedTo: taskAssignee || null,
        priority: taskPriority,
        dueDate: taskDueDate || null
      });

      setTaskTitle('');
      setTaskDesc('');
      setTaskAssignee('');
      setTaskPriority('MEDIUM');
      setTaskDueDate('');
      setShowTaskModal(false);
      fetchProjectDetails();
    } catch (err) {
      setTaskErr(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectDetails();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchProjectDetails();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading project details...</div>;
  if (!project) return <div style={{ textAlign: 'center', padding: '3rem' }}>Project not found or accessible.</div>;

  return (
    <div>
      <button 
        className="btn btn-secondary btn-sm" 
        style={{ marginBottom: '1.5rem' }}
        onClick={() => setActivePage('projects')}
      >
        ← Back to Projects
      </button>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.5rem' }}>{project.name}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{project.description || 'No description provided.'}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
            + Add Task
          </button>
        </div>

        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1rem' }}>
          <span><strong>Owner:</strong> {project.owner?.name} ({project.owner?.email})</span>
          <span><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Project Members ({project.members?.length || 0})</h3>
        
        <div className="member-list" style={{ marginBottom: '1.5rem' }}>
          {project.members?.map(m => (
            <div key={m._id} className="member-pill">
              <span>👤 {m.name} ({m.email})</span>
              {isOwnerOrAdmin && m._id !== project.owner?._id && (
                <button 
                  className="member-remove-btn" 
                  title="Remove member"
                  onClick={() => handleRemoveMember(m._id)}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>

        {isOwnerOrAdmin && (
          <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Add Member by Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="Enter user email..." 
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Add Member
            </button>
          </form>
        )}

        {addMemberErr && <div className="alert alert-error" style={{ marginTop: '0.8rem' }}>{addMemberErr}</div>}
        {addMemberMsg && <div className="alert alert-success" style={{ marginTop: '0.8rem' }}>{addMemberMsg}</div>}
      </div>

      <div>
        <div className="page-header" style={{ marginBottom: '1rem' }}>
          <h3>Project Tasks ({project.tasks?.length || 0})</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setShowTaskModal(true)}>
            + Add Task
          </button>
        </div>

        {project.tasks?.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            No tasks created in this project yet. Click "+ Add Task" to create one.
          </div>
        ) : (
          <div className="grid-3">
            {project.tasks?.map((task) => (
              <div key={task._id} className="card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {task.description || 'No details provided.'}
                  </p>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                    <strong>Assigned To:</strong> {task.assignedTo?.name || 'Unassigned'}
                  </div>
                </div>

                <div>
                  <div className="form-group" style={{ marginTop: '1rem', marginBottom: '0.8rem' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Update Status</label>
                    <select 
                      className="form-select"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>

                  <div className="card-meta" style={{ justifyContent: 'flex-end' }}>
                    {(isOwnerOrAdmin || task.createdBy?._id === user?.id) && (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Create Task in {project.name}</h3>
              <button className="close-btn" onClick={() => setShowTaskModal(false)}>&times;</button>
            </div>

            {taskErr && <div className="alert alert-error">{taskErr}</div>}

            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Design Database Schema" 
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Detailed instructions for the assignee..." 
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assign To Member</label>
                <select 
                  className="form-select"
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                >
                  <option value="">-- Unassigned --</option>
                  {project.members?.map(m => (
                    <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select 
                  className="form-select"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
