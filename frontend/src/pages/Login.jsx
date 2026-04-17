import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', role: 'admin' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({}); setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login({ ...res.data.user, token: res.data.token });
      navigate('/dashboard');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Login failed. Please try again.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">

      <div className="login-card">
        <div className="login-header">
          <div className="logo">📚</div>
          <h1>Library Management System</h1>
          <p>Sign in to your account</p>
        </div>

        {errors.general && <div className="form-error-box">{errors.general}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" className={`form-control${errors.username ? ' error' : ''}`}
              type="text" placeholder="Enter your username"
              value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input id="password" className={`form-control${errors.password ? ' error' : ''}`}
                type={showPw ? 'text' : 'password'} placeholder="Enter your password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <button type="button" className="toggle-pw" onClick={() => setShowPw(!showPw)}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Login As</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="role" value="admin"
                  checked={form.role === 'admin'} onChange={() => setForm({ ...form, role: 'admin' })} />
                🛡️ Admin
              </label>
              <label className="radio-label">
                <input type="radio" name="role" value="user"
                  checked={form.role === 'user'} onChange={() => setForm({ ...form, role: 'user' })} />
                👤 User
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="login-hint">
          <strong>Demo:</strong> admin / admin123 &nbsp;|&nbsp; user / user123
        </p>
      </div>
    </div>
  );
}
