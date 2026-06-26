import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import StarRating from '../../components/StarRating';

const RatingModal = ({ store, onClose, onRated }) => {
  const [rating, setRating] = useState(store.userRating || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!rating) return setError('Please select a rating.');
    setLoading(true);
    try { await api.post(`/stores/${store.id}/rate`, { rating }); onRated(); onClose(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to submit.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">{store.userRating ? 'Update Rating' : 'Rate This Store'}</div>
            <div className="modal-subtitle">{store.name}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="alert alert-error">⚠ {error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '24px 0 32px' }}>
          <StarRating value={rating} onChange={setRating} size="lg" />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: rating ? 'var(--amber)' : 'var(--light-grey)' }}>
            {rating > 0 ? `${rating} / 5.0` : 'TAP A STAR'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !rating}>
            {loading ? 'Submitting...' : store.userRating ? 'Update Rating' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ field: 'name', order: 'ASC' });
  const [selectedStore, setSelectedStore] = useState(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/stores', { params: { ...search, sortBy: sort.field, sortOrder: sort.order } });
      setStores(res.data.data);
    } catch { } finally { setLoading(false); }
  }, [search, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleRemoveRating = async (storeId) => {
    if (!window.confirm('Remove your rating?')) return;
    await api.delete(`/stores/${storeId}/rate`);
    fetchStores();
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="page-header-eyebrow">Browse</div>
        <h1>All Stores</h1>
        <div className="page-header-sub">Search, discover and rate registered stores.</div>
      </div>

      <div className="toolbar">
        <div className="search-input-wrap">
          <span className="search-icon">⊕</span>
          <input placeholder="Search by store name..." value={search.name} onChange={e => setSearch({ ...search, name: e.target.value })} />
        </div>
        <div className="search-input-wrap">
          <span className="search-icon">⊕</span>
          <input placeholder="Search by address..." value={search.address} onChange={e => setSearch({ ...search, address: e.target.value })} />
        </div>
        <select className="filter-select" value={`${sort.field}-${sort.order}`} onChange={e => { const [field, order] = e.target.value.split('-'); setSort({ field, order }); }}>
          <option value="name-ASC">Name A → Z</option>
          <option value="name-DESC">Name Z → A</option>
          <option value="address-ASC">Address A → Z</option>
          <option value="createdAt-DESC">Newest First</option>
        </select>
      </div>

      {selectedStore && <RatingModal store={selectedStore} onClose={() => setSelectedStore(null)} onRated={fetchStores} />}

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : stores.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">◈</div><h3>No stores found</h3><p>Try a different search</p></div>
      ) : (
        <div className="store-grid">
          {stores.map(store => (
            <div className="store-card" key={store.id}>
              <div className="store-card-header">
                <div>
                  <div className="store-card-name">{store.name}</div>
                  <div className="store-card-address">{store.address}</div>
                </div>
              </div>

              <div className="store-card-rating">
                <div className="store-avg-score">{store.averageRating > 0 ? store.averageRating : '—'}</div>
                <div className="store-rating-info">
                  <StarRating value={Math.round(store.averageRating)} size="sm" />
                  <div className="store-rating-count">{store.totalRatings} {store.totalRatings === 1 ? 'rating' : 'ratings'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {store.userRating ? (
                  <>
                    <div>
                      <div className="your-rating-label">Your Rating</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <StarRating value={store.userRating} size="sm" />
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--amber)', fontWeight: 600 }}>{store.userRating}/5</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setSelectedStore(store)}>Edit Rating</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemoveRating(store.id)}>Remove</button>
                    </div>
                  </>
                ) : (
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setSelectedStore(store)}>
                    ★ Rate This Store
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserStores;
