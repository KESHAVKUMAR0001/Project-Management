/**
 * Tasks Page Component (src/pages/TasksPage.jsx)
 * 
 * View for logged-in user to see and update all tasks assigned to them across all projects.
 */

import React, { useState, useEffect } from 'react';
import API from '../api';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchMyTasks = async () => {
    try {
      const res = await API.get('/tasks/my-tasks');
      setTasks(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch assigned tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchMyTasks();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'ALL') return true;
    return t.status === filterStatus;
  });

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading tasks...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p style={{ color: 'var(--text-muted)' }}>Tasks assigned to you across all projects.</p>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Status:</span>
          <select 
            className="form-select"
            style={{ width: 'auto', padding: '0.5rem 0.8rem' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Statuses ({tasks.length})</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
          No tasks found for the selected filter.
        </div>
      ) : (
        <div className="grid-3">
          {filteredTasks.map((task) => (
            <div key={task._id} className="card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
                  <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>

                <h3 className="card-title" style={{ color: '#ffffff' }}>{task.title}</h3>
                <p className="card-description">{task.description || 'No description provided.'}</p>

                <div style={{ fontSize: '0.85rem', color: '#60a5fa', marginBottom: '0.5rem' }}>
                  <strong>Project:</strong> {task.project?.name || 'N/A'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <strong>Created By:</strong> {task.createdBy?.name || 'N/A'}
                </div>
              </div>

              <div>
                {/* Status selector */}
                <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Change Status</label>
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

                <div className="card-meta">
                  <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
