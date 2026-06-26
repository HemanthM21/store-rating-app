import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form);
      navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">
        <div className="auth-left-deco" />
        <div className="auth-left-deco2" />

        <div className="auth-left-top">
          <div className="auth-tagline-label">Join the Platform</div>
          <div className="auth-tagline-main">
            Be part of<br />something <em>great</em><br />today.
          </div>
        </div>

        <div className="auth-brand-vertical">RATESTORE</div>

        <div className="auth-left-bottom">
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 280 }}>
            Join a growing network of store owners and reviewers. Your voice shapes the platform.
          </p>
          <div className="auth-est">Est. 2025 · Encrypted Connection</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="auth-form-brand">
            <div className="auth-form-brand-dot" />
            <div className="auth-form-brand-text">RateStore</div>
          </div>

          <div className="auth-form-eyebrow">Create Account</div>
          <div className="auth-form-title">Join the platform.</div>
          <div className="auth-form-subtitle">Fill in your details to get started.</div>

          {error && <div className="alert alert-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="form-label-inline">
                <label htmlFor="reg-name">Full Name</label>
                <input
                  id="reg-name"
                  placeholder="Min 20 characters"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-hint">20–60 characters</div>
            </div>
            <div className="form-group">
              <div className="form-label-inline">
                <label htmlFor="reg-email">Email Address</label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="form-label-inline">
                <label htmlFor="reg-address">Address</label>
                <input
                  id="reg-address"
                  placeholder="Your full address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                />
              </div>
              <div className="form-hint">Max 400 characters</div>
            </div>
            <div className="form-group">
              <div className="form-label-inline">
                <label htmlFor="reg-password">Password</label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-hint">8–16 chars · one uppercase · one special character</div>
            </div>
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div className="auth-footer" style={{ marginTop: 24 }}>
            Already have an account?&nbsp;<Link to="/login" className="auth-footer-link">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
