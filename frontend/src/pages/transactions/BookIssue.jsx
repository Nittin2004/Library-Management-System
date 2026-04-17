import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';

function toDateInput(d) { return new Date(d).toISOString().split('T')[0]; }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

export default function BookIssue() {
  const location = useLocation();
  const navigate  = useNavigate();
  const prefill   = location.state?.book;

  const today        = toDateInput(new Date());
  const maxReturn    = toDateInput(addDays(new Date(), 15));

  const [form, setForm] = useState({
    bookTitle:      prefill?.title  || '',
    authorName:     prefill?.author || '',
    bookSerialNo:   prefill?.serialNo || '',
    borrowerName:   '',
    membershipNo:   '',
    issueDate:      today,
    scheduledReturn: maxReturn,
    remarks:        '',
  });
  const [errors, setErrors]   = useState({});
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(false);
  const [looking, setLooking] = useState(false);

  // Auto-fill author when title typed manually
  const lookupByTitle = async (title) => {
    if (!title.trim()) return;
    setLooking(true);
    try {
      const res = await api.get(`/books/by-title/${encodeURIComponent(title.trim())}`);
      setForm(f => ({ ...f, authorName: res.data.author, bookSerialNo: res.data.serialNo }));
    } catch { /* leave blank */ }
    finally { setLooking(false); }
  };

  const validate = () => {
    const e = {};
    if (!form.bookTitle.trim())    e.bookTitle    = 'Book name is required.';
    if (!form.borrowerName.trim()) e.borrowerName = 'Borrower name is required.';
    if (!form.issueDate)           e.issueDate    = 'Issue date is required.';
    if (form.issueDate < today)    e.issueDate    = 'Issue date cannot be in the past.';
    if (!form.scheduledReturn)     e.scheduledReturn = 'Return date is required.';
    if (form.scheduledReturn > maxReturn) e.scheduledReturn = 'Return date cannot exceed 15 days from today.';
    if (form.scheduledReturn < form.issueDate) e.scheduledReturn = 'Return date must be after issue date.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      await api.post('/issues', form);
      setMsg(`✅ "${form.bookTitle}" issued successfully! Return by ${form.scheduledReturn}.`);
      setForm(f => ({ ...f, borrowerName: '', membershipNo: '', remarks: '' }));
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to issue book.' });
    } finally { setLoading(false); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="page-title">📤 Book Issue</div>
      <div className="page-subtitle">Issue a book to a library member.</div>

      <div className="card">
        {msg && <div className="form-success-box">{msg}</div>}
        {errors.general && <div className="form-error-box">{errors.general}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bookTitle">Book Title *</label>
              <input id="bookTitle" className={`form-control${errors.bookTitle ? ' error' : ''}`}
                placeholder="Enter or search book title"
                value={form.bookTitle}
                onChange={e => set('bookTitle', e.target.value)}
                onBlur={e => !prefill && lookupByTitle(e.target.value)} />
              {errors.bookTitle && <span className="field-error">{errors.bookTitle}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="authorName">Author Name {looking && <em style={{fontWeight:300}}>(auto-filling…)</em>}</label>
              <input id="authorName" className="form-control" value={form.authorName}
                placeholder="Auto-filled from title" readOnly />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="borrowerName">Borrower Name *</label>
              <input id="borrowerName" className={`form-control${errors.borrowerName ? ' error' : ''}`}
                placeholder="Name of borrower" value={form.borrowerName}
                onChange={e => set('borrowerName', e.target.value)} />
              {errors.borrowerName && <span className="field-error">{errors.borrowerName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="membershipNo">Membership No</label>
              <input id="membershipNo" className="form-control"
                placeholder="Optional membership number" value={form.membershipNo}
                onChange={e => set('membershipNo', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="issueDate">Issue Date * <small>(Today or later)</small></label>
              <input id="issueDate" type="date" className={`form-control${errors.issueDate ? ' error' : ''}`}
                min={today} value={form.issueDate}
                onChange={e => set('issueDate', e.target.value)} />
              {errors.issueDate && <span className="field-error">{errors.issueDate}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="returnDate">Return Date * <small>(Max 15 days)</small></label>
              <input id="returnDate" type="date" className={`form-control${errors.scheduledReturn ? ' error' : ''}`}
                min={today} max={maxReturn} value={form.scheduledReturn}
                onChange={e => set('scheduledReturn', e.target.value)} />
              {errors.scheduledReturn && <span className="field-error">{errors.scheduledReturn}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="remarks">Remarks <small>(optional)</small></label>
            <textarea id="remarks" className="form-control" rows={2} placeholder="Any additional notes…"
              value={form.remarks} onChange={e => set('remarks', e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Issuing…' : '📤 Confirm Issue'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/transactions/book-available')}>
              ← Back to Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
