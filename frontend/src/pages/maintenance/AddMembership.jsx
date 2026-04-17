import { useState } from 'react';
import api from '../../api';

const EMPTY = { membershipNo: '', name: '', email: '', phone: '', address: '', membershipType: '6months' };

export default function AddMembership() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.membershipNo.trim()) e.membershipNo = 'Membership number is required.';
    if (!form.name.trim())         e.name         = 'Name is required.';
    if (!form.email.trim())        e.email        = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.phone.trim())        e.phone        = 'Phone is required.';
    if (!form.address.trim())      e.address      = 'Address is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      await api.post('/members', form);
      setMsg(`✅ Membership "${form.membershipNo}" for ${form.name} added successfully!`);
      setForm(EMPTY);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to add membership.' });
    } finally { setLoading(false); }
  };

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div>
      <div className="page-title">🪪 Add Membership</div>
      <div className="page-subtitle">Register a new library member.</div>

      <div className="card">
        {msg && <div className="form-success-box">{msg}</div>}
        {errors.general && <div className="form-error-box">{errors.general}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Membership Duration</label>
            <div className="radio-group">
              {['6months', '1year', '2years'].map(opt => (
                <label key={opt} className="radio-label">
                  <input type="radio" name="membershipType" value={opt}
                    checked={form.membershipType === opt} onChange={() => set('membershipType', opt)} />
                  {opt === '6months' ? '6 Months' : opt === '1year' ? '1 Year' : '2 Years'}
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="memNo">Membership Number *</label>
              <input id="memNo" className={`form-control${errors.membershipNo ? ' error' : ''}`}
                placeholder="e.g. MEM002" value={form.membershipNo}
                onChange={e => set('membershipNo', e.target.value)} />
              {errors.membershipNo && <span className="field-error">{errors.membershipNo}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="memName">Full Name *</label>
              <input id="memName" className={`form-control${errors.name ? ' error' : ''}`}
                placeholder="Enter full name" value={form.name}
                onChange={e => set('name', e.target.value)} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="memEmail">Email *</label>
              <input id="memEmail" type="email" className={`form-control${errors.email ? ' error' : ''}`}
                placeholder="email@example.com" value={form.email}
                onChange={e => set('email', e.target.value)} />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="memPhone">Phone *</label>
              <input id="memPhone" className={`form-control${errors.phone ? ' error' : ''}`}
                placeholder="10-digit phone number" value={form.phone}
                onChange={e => set('phone', e.target.value)} />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="memAddress">Address *</label>
            <textarea id="memAddress" className={`form-control${errors.address ? ' error' : ''}`}
              placeholder="Enter address" rows={2} value={form.address}
              onChange={e => set('address', e.target.value)} />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding…' : '🪪 Add Member'}
          </button>
        </form>
      </div>
    </div>
  );
}
