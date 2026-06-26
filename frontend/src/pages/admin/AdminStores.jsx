import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import StarRating from '../../components/StarRating';

const AddStoreModal = ({ onClose, onAdded }) => {
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/users', { params: { role: 'owner' } }).then(res => setOwners(res.data.data)).catch(() => { });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await api.post('/admin/stores', { ...form, owner_id: form.owner_id || undefined }); onAdded(); onClose(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to create store.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Add New Store</div>
            <div className="modal-subtitle">Register a store on the platform</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="alert alert-error">⚠ {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group-light">
            <label>Store Name</label>
            <input className="form-input-light" placeholder="Min 20 characters" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group-light">
            <label>Store Email</label>
            <input className="form-input-light" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group-light">
            <label>Address</label>
            <textarea className="form-input-light" rows={3} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required style={{ resize: 'vertical' }} />
          </div>
          <div className="form-group-light">
            <label>Assign Owner (Optional)</label>
            <select className="form-input-light" value={form.owner_id} onChange={e => setForm({ ...form, owner_id: e.target.value })}>
              <option value="">No owner</option>
              {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Store'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ field: 'name', order: 'ASC' });

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stores', { params: { ...filters, sortBy: sort.field, sortOrder: sort.order } });
      setStores(res.data.data);
    } catch { } finally { setLoading(false); }
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleSort = field => setSort(prev => ({ field, order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC' }));
  const sortIcon = field => sort.field !== field ? ' ↕' : sort.order === 'ASC' ? ' ↑' : ' ↓';

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="page-header-eyebrow">Admin · Stores</div>
        <h1>Stores Index</h1>
        <div className="page-header-sub">All registered stores on the platform</div>
      </div>

      <div className="toolbar">
        {[{ key: 'name', placeholder: 'Filter by name...' }, { key: 'email', placeholder: 'Filter by email...' }, { key: 'address', placeholder: 'Filter by address...' }].map(f => (
          <div className="search-input-wrap" key={f.key}>
            <span className="search-icon">⊕</span>
            <input placeholder={f.placeholder} value={filters[f.key]} onChange={e => setFilters({ ...filters, [f.key]: e.target.value })} />
          </div>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Store</button>
        </div>
      </div>

      {showAdd && <AddStoreModal onClose={() => setShowAdd(false)} onAdded={fetchStores} />}

      <div className="table-container">
        <div className="table-header">
          <div>
            <div className="table-header-title">All Stores</div>
            <div className="table-header-count">{stores.length} Records · Sortable</div>
          </div>
        </div>
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : stores.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">◈</div><h3>No stores found</h3><p>Add a store to get started</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                {[['name', 'Name'], ['email', 'Email'], ['address', 'Address']].map(([field, label]) => (
                  <th key={field} onClick={() => handleSort(field)} className={sort.field === field ? 'sorted' : ''}>{label}{sortIcon(field)}</th>
                ))}
                <th>Rating</th>
                <th>Total Ratings</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(store => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{store.email}</td>
                  <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{store.address}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <StarRating value={Math.round(store.averageRating)} size="sm" />
                      <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--amber)' }}>{store.averageRating > 0 ? store.averageRating : '—'}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{store.totalRatings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminStores;
