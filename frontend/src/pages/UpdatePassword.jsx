import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UpdatePassword = () => {
  const { updatePassword } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (form.newPassword !== form.confirmPassword) return setError('New passwords do not match.');
    setLoading(true);
    try {
      await updatePassword(form.currentPassword, form.newPassword);
      setSuccess('Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { setError(err.response?.data?.message || 'Failed to update password.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="page-header-eyebrow">Account</div>
        <h1>Update Password</h1>
        <div className="page-header-sub">Change your login credentials. Must meet security requirements.</div>
      </div>

      <div className="table-container password-page-wrap">
        <div className="table-header">
          <div className="table-header-title">Security Settings</div>
        </div>
        <div style={{ padding: 28 }}>
          {error && <div className="alert alert-error">⚠ {error}</div>}
          {success && <div className="alert alert-success">✓ {success}</div>}
          <form onSubmit={handleSubmit}>
            {[
              { key: 'currentPassword', label: 'Current Password', placeholder: 'Your current password' },
              { key: 'newPassword', label: 'New Password', placeholder: '8-16 chars + uppercase + special', hint: '8–16 characters, one uppercase letter, one special character' },
              { key: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
            ].map(field => (
              <div className="form-group-light" key={field.key}>
                <label>{field.label}</label>
                <input className="form-input-light" type="password" placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} required />
                {field.hint && <div className="form-hint" style={{ color: 'var(--grey)', marginTop: 4 }}>{field.hint}</div>}
              </div>
            ))}
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
