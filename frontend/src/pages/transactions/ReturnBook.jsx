import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

function toDateInput(d) { return d ? new Date(d).toISOString().split('T')[0] : ''; }

export default function ReturnBook() {
  const navigate = useNavigate();
  const [serialNo, setSerialNo] = useState('');
  const [issue, setIssue]       = useState(null);
  const [returnDate, setReturnDate] = useState('');
  const [errors, setErrors]     = useState({});
  const [looking, setLooking]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const lookup = async () => {
    if (!serialNo.trim()) { setErrors({ search: 'Serial number is required.' }); return; }
    setErrors({}); setLooking(true);
    try {
      const res = await api.get(`/issues/book/${serialNo.trim()}`);
      setIssue(res.data);
      setReturnDate(toDateInput(res.data.scheduledReturn));
    } catch {
      setErrors({ search: 'No active issue found for this serial number.' }); setIssue(null);
    } finally { setLooking(false); }
  };

  const validate = () => {
    const e = {};
    if (!returnDate) e.returnDate = 'Return date is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setErrors({});
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await api.put(`/issues/${issue._id}/return`, { actualReturn: returnDate });
      // Navigate to Pay Fine page with updated issue data
      navigate('/transactions/pay-fine', { state: { issue: res.data } });
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to process return.' });
    } finally { setLoading(false); }
  };

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN') : '—';

  return (
    <div>
      <div className="page-title">📥 Return Book</div>
      <div className="page-subtitle">Look up a book by serial number to process its return.</div>

      <div className="card">
        <div className="form-group">
          <label htmlFor="retSerial">Book Serial Number *</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input id="retSerial" className={`form-control${errors.search ? ' error' : ''}`}
              placeholder="Enter serial number (e.g. B001)"
              value={serialNo} onChange={e => setSerialNo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && lookup()} />
            <button type="button" className="btn btn-secondary" onClick={lookup} disabled={looking}>
              {looking ? 'Searching…' : '🔍 Search'}
            </button>
          </div>
          {errors.search && <span className="field-error">{errors.search}</span>}
        </div>
      </div>

      {issue && (
        <div className="card">
          {errors.general && <div className="form-error-box">{errors.general}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label>Book Title *</label>
                <input className="form-control" value={issue.bookTitle} readOnly />
              </div>
              <div className="form-group">
                <label>Author Name</label>
                <input className="form-control" value={issue.authorName} readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Serial Number *</label>
                <input className="form-control" value={issue.bookSerialNo} readOnly />
              </div>
              <div className="form-group">
                <label>Borrower</label>
                <input className="form-control" value={issue.borrowerName || '—'} readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Issue Date</label>
                <input className="form-control" value={fmt(issue.issueDate)} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="actualReturn">Return Date * <small>(editable)</small></label>
                <input id="actualReturn" type="date" className={`form-control${errors.returnDate ? ' error' : ''}`}
                  value={returnDate} onChange={e => setReturnDate(e.target.value)} />
                {errors.returnDate && <span className="field-error">{errors.returnDate}</span>}
              </div>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '10px 14px', fontSize: '0.85rem', marginBottom: 16 }}>
              📅 Scheduled return was: <strong>{fmt(issue.scheduledReturn)}</strong>
              {new Date(returnDate) > new Date(issue.scheduledReturn) &&
                <span style={{ color: '#ef4444', marginLeft: 8 }}>
                  ⚠️ Overdue — a fine will be calculated.
                </span>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing…' : '✅ Confirm Return → Pay Fine'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
