import { useState, useEffect } from 'react';
import api from '../../utils/api';
import StarRating from '../../components/StarRating';

const healthLabel = (avg) => {
  if (avg >= 4.5) return { label: 'EXCELLENT', color: 'var(--viridian)' };
  if (avg >= 3.5) return { label: 'GOOD', color: 'var(--orange)' };
  if (avg >= 2.5) return { label: 'AVERAGE', color: 'var(--warning)' };
  return { label: 'NEEDS WORK', color: 'var(--danger)' };
};

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/owner/dashboard')
      .then(res => setData(res.data.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  const health = data ? healthLabel(data.averageRating) : null;

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="page-header-eyebrow">Store Owner</div>
        <h1>My Dashboard</h1>
        <div className="page-header-sub">Monitor your store's performance and customer ratings.</div>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      {data && (
        <>
          <div className="owner-hero">
            <div className="owner-hero-left">
              <div className="owner-hero-label">Store Health Index</div>
              <div className="owner-hero-name">{data.store.name}</div>
              <div className="owner-hero-address">{data.store.address}</div>
              <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
                <div>
                  <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Total Reviews</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--seashell)' }}>{data.totalRatings.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Store Email</div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(255,245,238,0.42)', fontFamily: 'monospace' }}>{data.store.email}</div>
                </div>
              </div>
            </div>

            <div className="owner-hero-right">
              <div className="owner-health-label">Store Health Index</div>
              <div className="owner-health-score" style={{ color: health.color }}>{health.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <div className="owner-avg-big">{data.averageRating > 0 ? data.averageRating : '—'}</div>
                <div className="owner-avg-denom">/ 5.0</div>
              </div>
              <StarRating value={Math.round(data.averageRating)} size="md" />
            </div>
          </div>

          <div className="table-container">
            <div className="table-header">
              <div>
                <div className="table-header-title">Customer Ratings</div>
                <div className="table-header-count">{data.ratings.length} Reviews Received</div>
              </div>
            </div>
            {data.ratings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">★</div>
                <h3>No ratings yet</h3>
                <p>Customers will appear here once they start rating your store.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ratings.map(r => (
                    <tr key={r.id}>
                      <td>{r.userName}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{r.userEmail}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <StarRating value={r.rating} size="sm" />
                          <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--orange)', fontWeight: 600 }}>{r.rating}</span>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--grey)' }}>
                        {new Date(r.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;
