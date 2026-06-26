import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="page-header-eyebrow">Overview</div>
        <h1>Welcome back, {user?.name?.split(' ')[0]}.</h1>
        <div className="page-header-sub">Here's what's happening across the platform today.</div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <Link to="/admin/users" className="btn btn-primary">+ Add User</Link>
        <Link to="/admin/stores" className="btn btn-secondary">+ Add Store</Link>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : stats && (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">⬡ Total Users</div>
            <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
            <div className="stat-trend">↗ Active on platform</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">◈ Total Stores</div>
            <div className="stat-value">{stats.totalStores.toLocaleString()}</div>
            <div className="stat-trend">↗ Registered</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">★ Total Ratings</div>
            <div className="stat-value">{stats.totalRatings.toLocaleString()}</div>
            <div className="stat-trend">↗ Submitted</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="table-container">
          <div className="table-header">
            <div>
              <div className="table-header-title">Quick Navigation</div>
              <div className="table-header-count">Manage platform entities</div>
            </div>
          </div>
          <div style={{ padding: '8px 24px 16px' }}>
            {[
              { to: '/admin/users', label: 'Manage Users', desc: 'View, filter and add users' },
              { to: '/admin/stores', label: 'Manage Stores', desc: 'View, filter and add stores' },
              { to: '/update-password', label: 'Update Password', desc: 'Change your login credentials' },
            ].map(item => (
              <Link key={item.to} to={item.to} className="quick-nav-item">
                <div>
                  <div className="quick-nav-title">{item.label}</div>
                  <div className="quick-nav-desc">{item.desc}</div>
                </div>
                <span className="quick-nav-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="table-container">
          <div className="table-header">
            <div>
              <div className="table-header-title">System Status</div>
              <div className="table-header-count">Platform health indicators</div>
            </div>
          </div>
          <div style={{ padding: '8px 24px 16px' }}>
            {[
              { label: 'Database', status: 'Connected' },
              { label: 'Auth Service', status: 'Active' },
              { label: 'API Server', status: 'Running' },
            ].map(item => (
              <div key={item.label} className="status-row">
                <span className="status-label">{item.label}</span>
                <span className="status-value-ok">
                  <span className="status-dot" />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
