import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { icon: '☕', label: 'Cafe', bg: '#FFFBEB', border: '#FDE68A', top: 26, left: 40, cx: 68, cy: 54 },
  { icon: '📱', label: 'Elect', bg: '#EFF6FF', border: '#BFDBFE', top: 15, left: 326, cx: 354, cy: 43 },
  { icon: '🍽', label: 'Resto', bg: '#FFF7ED', border: '#FED7AA', top: 140, left: 382, cx: 410, cy: 168 },
  { icon: '🛒', label: 'Grocery', bg: '#F0FDF4', border: '#BBF7D0', top: 258, left: 336, cx: 364, cy: 286 },
  { icon: '👗', label: 'Fashion', bg: '#FDF2F8', border: '#FBCFE8', top: 262, left: 43, cx: 71, cy: 290 },
  { icon: '💇', label: 'Beauty', bg: '#F5F3FF', border: '#DDD6FE', top: 135, left: 5, cx: 33, cy: 163 },
];

const CX = 220, CY = 170;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const redirects = { admin: '/admin/dashboard', owner: '/owner/dashboard', user: '/stores' };
      navigate(redirects[user.role] || '/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{
        background: '#40826D',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '32px 36px',
        borderRight: '1px solid rgba(255,255,255,0.10)',
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30,
            background: '#40826D',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: '#fff', fontWeight: 700,
          }}>★</div>
          <div style={{
            fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.9)',
          }}>RateStore</div>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 8,
        }}>
          <div style={{ position: 'relative', width: 440, height: 340 }}>

            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
              viewBox="0 0 440 340"
              fill="none"
            >
              <circle cx={CX} cy={CY} r="46" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 6" opacity="1" />
              <circle cx={CX} cy={CY} r="60" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2 8" opacity="1" />

              {CATEGORIES.map((cat, i) => (
                <g key={i}>
                  <line
                    x1={CX} y1={CY}
                    x2={cat.cx} y2={cat.cy}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={(CX + cat.cx) / 2}
                    cy={(CY + cat.cy) / 2}
                    r="2.5"
                    fill="rgba(255,255,255,0.25)"
                    opacity="1"
                  />
                  <circle cx={cat.cx} cy={cat.cy} r="3" fill="rgba(255,255,255,0.4)" />
                </g>
              ))}
            </svg>

            {CATEGORIES.map((cat, i) => (
              <div
                key={i}
                title={cat.label}
                style={{
                  position: 'absolute',
                  top: cat.top,
                  left: cat.left,
                  width: 56,
                  height: 56,
                  background: cat.bg,
                  border: `1.5px solid ${cat.border}`,
                  borderRadius: 14,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  userSelect: 'none',
                  cursor: 'default',
                  animation: `authFloat ${2.8 + i * 0.38}s ease-in-out ${i * 0.22}s infinite alternate`,
                }}
              >
                {cat.icon}
                <div style={{
                  fontSize: '0.42rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#7A7E78',
                  marginTop: 2,
                  lineHeight: 1,
                }}>{cat.label}</div>
              </div>
            ))}

            <div style={{
              position: 'absolute',
              top: 134,
              left: 184,
              width: 72,
              height: 72,
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 20,
              boxShadow: '0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'authFloat 3.6s ease-in-out 0.1s infinite alternate',
              zIndex: 2,
            }}>
              <div style={{ fontSize: 32, color: '#40826D', lineHeight: 1, userSelect: 'none' }}>★</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24, padding: '0 16px' }}>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '1.55rem',
              color: '#FFFFFF',
              lineHeight: 1.25,
              marginBottom: 8,
            }}>
              Rate any store.<br />
              <em style={{ color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>Share your experience.</em>
            </div>
            <div style={{
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.05em',
              lineHeight: 1.7,
            }}>
              Cafes &nbsp;·&nbsp; Restaurants &nbsp;·&nbsp; Fashion &nbsp;·&nbsp; Electronics &nbsp;·&nbsp; Grocery &nbsp;·&nbsp; Beauty
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: 28,
          paddingTop: 18,
          marginTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.18)',
        }}>
          {[['1K+', 'Stores'], ['50K+', 'Reviews'], ['99.9%', 'Uptime']].map(([num, label]) => (
            <div key={label}>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '1.2rem', color: '#FFFFFF', lineHeight: 1,
              }}>{num}</div>
              <div style={{
                fontSize: '0.56rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 3,
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrapper">

          <div className="auth-form-brand">
            <div className="auth-form-brand-dot" />
            <div className="auth-form-brand-text">RateStore</div>
          </div>

          <div className="auth-form-eyebrow">Authentication</div>
          <div className="auth-form-title">Welcome back.</div>
          <div className="auth-form-subtitle">Sign in to your account to continue.</div>

          {error && <div className="alert alert-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="form-label-inline">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@domain.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-inline">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-footer" style={{ marginTop: 24 }}>
            New here?&nbsp;
            <Link to="/register" className="auth-footer-link">Create an account</Link>
          </div>

          <hr className="auth-divider" />

          <div style={{
            fontSize: '0.62rem', color: 'var(--text-muted)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            Privacy &nbsp;·&nbsp; Terms &nbsp;·&nbsp; RateStore © 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
