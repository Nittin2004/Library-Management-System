import { useState } from 'react';
import api from '../../api';

export default function UserManagement() {
  const [mode, setMode]       = useState('new');
  const [username, setUsername] = useState('');
  const [existing, setExisting] = useState(null);
  const [form, setForm]       = useState({ name: '', password: '', role: 'user' });
  const [errors, setErrors]   = useState({});
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(false);
  const [looking, setLooking] = useState(false);

  const lookup = async () => {
    if (!username.trim()) { setErrors({ search: 'Username is required.' }); return; }
    setErrors({}); setMsg(''); setLooking(true);
    try {
      const res = await api.get(`/users/${username.trim()}`);
      setExisting(res.data);
      setForm({ name: res.data.name, password: '', role: res.data.role });
    } catch {
      setErrors({ search: 'User not found.' }); setExisting(null);
    } finally { setLooking(false); }
  };

  const validateNew = () => {
    const e = {};
    if (!username.trim())    e.username = 'Username is required.';
    if (!form.name.trim())   e.name     = 'Name is required.';
    if (!form.password)      e.password = 'Password is required.';
    return e;
  };

  const handleCreate = async (e) => {
    e.preventDefault(); setMsg('');
    const errs = validateNew();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      await api.post('/users', { username: username.trim(), name: form.name, password: form.password, role: form.role });
      setMsg(`✅ User "${username}" created successfully!`);
      setUsername(''); setForm({ name: '', password: '', role: 'user' });
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to create user.' });
    } finally { setLoading(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); setMsg('');
    if (!form.name.trim()) { setErrors({ name: 'Name is required.' }); return; }
    setErrors({}); setLoading(true);
    try {
      const payload = { name: form.name, role: form.role };
      if (form.password) payload.password = form.password;
      await api.put(`/users/${existing.username}`, payload);
      setMsg(`✅ User "${existing.username}" updated.`);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Update failed.' });
    } finally { setLoading(false); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const [showPw, setShowPw] = useState(false);

  return (
    <div>
      <div className="page-title">👤 User Management</div>
      <div className="page-subtitle">Create new users or update existing user details.</div>

      <div className="card">
        <div className="form-group">
          <label>User Type</label>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" checked={mode === 'new'} onChange={() => { setMode('new'); setExisting(null); setMsg(''); setErrors({}); }} />
              🆕 New User
            </label>
            <label className="radio-label">
              <input type="radio" checked={mode === 'existing'} onChange={() => { setMode('existing'); setMsg(''); setErrors({}); }} />
              🔍 Existing User
            </label>
          </div>
        </div>

        {errors.general && <div className="form-error-box">{errors.general}</div>}
        {msg && <div className="form-success-box">{msg}</div>}

        <form onSubmit={mode === 'new' ? handleCreate : handleUpdate} noValidate>
          <div className="form-group">
            <label htmlFor="uname">Username *</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input id="uname" className={`form-control${errors.username ? ' error' : ''}`}
                placeholder="Enter username" value={username}
                onChange={e => setUsername(e.target.value)}
                readOnly={mode === 'existing' && !!existing} />
              {mode === 'existing' && (
                <button type="button" className="btn btn-secondary" onClick={lookup} disabled={looking}>
                  {looking ? '…' : '🔍 Search'}
                </button>
              )}
            </div>
            {errors.username && <span className="field-error">{errors.username}</span>}
            {errors.search   && <span className="field-error">{errors.search}</span>}
          </div>

          {(mode === 'new' || existing) && (
            <>
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input id="fullName" className={`form-control${errors.name ? ' error' : ''}`}
                  placeholder="Enter full name" value={form.name}
                  onChange={e => set('name', e.target.value)} />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="pw">Password {mode === 'existing' ? '(leave blank to keep current)' : '*'}</label>
                <div className="password-wrapper">
                  <input id="pw" className={`form-control${errors.password ? ' error' : ''}`}
                    type={showPw ? 'text' : 'password'} placeholder="Enter password"
                    value={form.password} onChange={e => set('password', e.target.value)} />
                  <button type="button" className="toggle-pw" onClick={() => setShowPw(!showPw)}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Role</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" checked={form.role === 'admin'} onChange={() => set('role', 'admin')} />
                    🛡️ Admin
                  </label>
                  <label className="radio-label">
                    <input type="radio" checked={form.role === 'user'} onChange={() => set('role', 'user')} />
                    👤 User
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing…' : mode === 'new' ? '➕ Create User' : '💾 Update User'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
