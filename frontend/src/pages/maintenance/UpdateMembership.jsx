import { useState } from 'react';
import api from '../../api';

export default function UpdateMembership() {
  const [membershipNo, setMembershipNo] = useState('');
  const [member, setMember]   = useState(null);
  const [action, setAction]   = useState('extend');
  const [extType, setExtType] = useState('6months');
  const [errors, setErrors]   = useState({});
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(false);
  const [looking, setLooking] = useState(false);

  const lookup = async () => {
    if (!membershipNo.trim()) { setErrors({ search: 'Membership number is required.' }); return; }
    setErrors({}); setMsg(''); setLooking(true);
    try {
      const res = await api.get(`/members/${membershipNo.trim()}`);
      setMember(res.data);
    } catch {
      setErrors({ search: 'Membership not found.' }); setMember(null);
    } finally { setLooking(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg(''); setLoading(true);
    try {
      const res = await api.put(`/members/${member.membershipNo}`, { action, membershipType: extType });
      setMember(res.data);
      setMsg(action === 'cancel'
        ? '✅ Membership cancelled successfully.'
        : `✅ Membership extended by ${extType === '6months' ? '6 months' : extType === '1year' ? '1 year' : '2 years'}.`);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Update failed.' });
    } finally { setLoading(false); }
  };

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN') : '—';

  return (
    <div>
      <div className="page-title">🔄 Update Membership</div>
      <div className="page-subtitle">Look up a membership to extend or cancel it.</div>

      <div className="card">
        <div className="form-group">
          <label htmlFor="searchMem">Membership Number *</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input id="searchMem" className={`form-control${errors.search ? ' error' : ''}`}
              placeholder="e.g. MEM001" value={membershipNo}
              onChange={e => setMembershipNo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && lookup()} />
            <button type="button" className="btn btn-secondary" onClick={lookup} disabled={looking}>
              {looking ? 'Searching…' : '🔍 Search'}
            </button>
          </div>
          {errors.search && <span className="field-error">{errors.search}</span>}
        </div>
      </div>

      {member && (
        <div className="card">
          {msg && <div className="form-success-box">{msg}</div>}
          {errors.general && <div className="form-error-box">{errors.general}</div>}

          <div className="form-row" style={{ marginBottom: 16 }}>
            {[['Name', member.name], ['Email', member.email], ['Phone', member.phone],
              ['Joined', fmt(member.startDate)], ['Expires', fmt(member.expiryDate)],
              ['Status', member.status]].map(([k, v]) => (
              <div key={k}><label style={{fontSize:'0.78rem',color:'#64748b'}}>{k}</label>
                <div className="form-control" style={{background:'#f8fafc',cursor:'default'}}>{v}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Action</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" checked={action === 'extend'} onChange={() => setAction('extend')} />
                  🔄 Extend Membership
                </label>
                <label className="radio-label">
                  <input type="radio" checked={action === 'cancel'} onChange={() => setAction('cancel')} />
                  ❌ Cancel Membership
                </label>
              </div>
            </div>

            {action === 'extend' && (
              <div className="form-group">
                <label>Extension Period</label>
                <div className="radio-group">
                  {['6months', '1year', '2years'].map(opt => (
                    <label key={opt} className="radio-label">
                      <input type="radio" name="extType" value={opt}
                        checked={extType === opt} onChange={() => setExtType(opt)} />
                      {opt === '6months' ? '6 Months' : opt === '1year' ? '1 Year' : '2 Years'}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className={`btn ${action === 'cancel' ? 'btn-danger' : 'btn-primary'}`} disabled={loading}>
              {loading ? 'Processing…' : action === 'cancel' ? '❌ Confirm Cancel' : '🔄 Confirm Extension'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
