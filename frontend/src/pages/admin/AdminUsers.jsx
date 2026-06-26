import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import StarRating from '../../components/StarRating';

const AddUserModal = ({ onClose, onAdded }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await api.post('/admin/users', form); onAdded(); onClose(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to create user.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Add New User</div>
            <div className="modal-subtitle">Create a new platform account</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="alert alert-error">⚠ {error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', key: 'name', placeholder: 'Min 20 characters', hint: '20–60 characters' },
            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'user@example.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '8-16 chars + uppercase + special', hint: '8–16 chars, 1 uppercase, 1 special character' },
            { label: 'Address', key: 'address', placeholder: 'Full address', hint: 'Max 400 characters' },
          ].map(field => (
            <div className="form-group-light" key={field.key}>
              <label>{field.label}</label>
              <input className={`form-input-light`} type={field.type || 'text'} placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} required />
              {field.hint && <div className="form-hint" style={{ color: 'var(--grey)', marginTop: 4 }}>{field.hint}</div>}
            </div>
          ))}
          <div className="form-group-light">
            <label>Role</label>
            <select className="form-input-light" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="user">Normal User</option>
              <option value="owner">Store Owner</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ field: 'name', order: 'ASC' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', { params: { ...filters, sortBy: sort.field, sortOrder: sort.order } });
      setUsers(res.data.data);
    } catch { } finally { setLoading(false); }
  }, [filters, sort]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSort = field => setSort(prev => ({ field, order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC' }));
  const sortIcon = field => sort.field !== field ? ' ↕' : sort.order === 'ASC' ? ' ↑' : ' ↓';
  const badgeClass = { admin: 'badge-admin', owner: 'badge-owner', user: 'badge-user' };

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="page-header-eyebrow">Admin · Users</div>
        <h1>Users Index</h1>
        <div className="page-header-sub">Managing {users.length} system entities</div>
      </div>

      <div className="toolbar">
        {[
          { key: 'name', placeholder: 'Filter by name...' },
          { key: 'email', placeholder: 'Filter by email...' },
          { key: 'address', placeholder: 'Filter by address...' },
        ].map(f => (
          <div className="search-input-wrap" key={f.key}>
            <span className="search-icon">⊕</span>
            <input placeholder={f.placeholder} value={filters[f.key]} onChange={e => setFilters({ ...filters, [f.key]: e.target.value })} />
          </div>
        ))}
        <select className="filter-select" value={filters.role} onChange={e => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add User</button>
        </div>
      </div>

      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onAdded={fetchUsers} />}

      <div className="table-container">
        <div className="table-header">
          <div>
            <div className="table-header-title">All Users</div>
            <div className="table-header-count">{users.length} Records · Sortable</div>
          </div>
        </div>
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : users.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">◎</div><h3>No users found</h3><p>Try adjusting your filters</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                {[['name', 'Name'], ['email', 'Email'], ['address', 'Address'], ['role', 'Role']].map(([field, label]) => (
                  <th key={field} onClick={() => handleSort(field)} className={sort.field === field ? 'sorted' : ''}>{label}{sortIcon(field)}</th>
                ))}
                <th>Store Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{user.email}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.address}</td>
                  <td><span className={`badge ${badgeClass[user.role]}`}>{user.role}</span></td>
                  <td>
                    {user.role === 'owner' && user.storeRating !== undefined ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <StarRating value={Math.round(user.storeRating)} size="sm" />
                        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--amber)' }}>{user.storeRating}</span>
                      </div>
                    ) : <span style={{ color: 'var(--light-grey)' }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
