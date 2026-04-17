import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';

function fmt(d) { return d ? new Date(d).toLocaleDateString('en-IN') : '—'; }

export default function PayFine() {
  const location = useLocation();
  const navigate  = useNavigate();
  const issue     = location.state?.issue;

  const [finePaid, setFinePaid] = useState(false);
  const [remarks, setRemarks]   = useState(issue?.remarks || '');
  const [error, setError]       = useState('');
  const [msg, setMsg]           = useState('');
  const [loading, setLoading]   = useState(false);

  if (!issue) {
    return (
      <div>
        <div className="page-title">💰 Pay Fine</div>
        <div className="card">
          <div className="form-error-box">No return data found. Please complete the Return Book step first.</div>
          <button className="btn btn-secondary" style={{ marginTop: 12 }}
            onClick={() => navigate('/transactions/return-book')}>
            ← Go to Return Book
          </button>
        </div>
      </div>
    );
  }

  const hasFine = issue.fineAmount > 0;

  const handleConfirm = async (e) => {
    e.preventDefault(); setError('');
    if (hasFine && !finePaid) {
      setError('Fine is pending. Please check the "Fine Paid" checkbox to confirm payment before completing the return.');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/issues/${issue._id}/payfine`, { finePaid, remarks });
      setMsg('✅ Book return completed successfully! The book is now available in the library.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete return.');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-title">💰 Pay Fine</div>
      <div className="page-subtitle">Review the fine details and confirm the book return.</div>

      <div className="card">
        {msg  && <div className="form-success-box">{msg}</div>}
        {error && <div className="form-error-box">{error}</div>}

        <div className="form-row" style={{ marginBottom: 16 }}>
          {[
            ['Book Title',    issue.bookTitle],
            ['Author',        issue.authorName],
            ['Serial No',     issue.bookSerialNo],
            ['Borrower',      issue.borrowerName || '—'],
            ['Issue Date',    fmt(issue.issueDate)],
            ['Scheduled Return', fmt(issue.scheduledReturn)],
            ['Actual Return', fmt(issue.actualReturn)],
          ].map(([label, val]) => (
            <div key={label}>
              <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: 4 }}>{label}</label>
              <div className="form-control" style={{ background: '#f8fafc', cursor: 'default', marginBottom: 10 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Fine summary */}
        <div style={{
          background: hasFine ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${hasFine ? '#fecaca' : '#86efac'}`,
          borderRadius: 8, padding: '14px 18px', marginBottom: 20
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: hasFine ? '#b91c1c' : '#15803d' }}>
            {hasFine ? `⚠️ Fine Due: ₹${issue.fineAmount}` : '✅ No Fine — Book returned on time!'}
          </div>
          {hasFine && (
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>
              Fine calculated at ₹5/day for overdue days.
            </div>
          )}
        </div>

        {!msg && (
          <form onSubmit={handleConfirm} noValidate>
            {hasFine && (
              <div className="form-group">
                <label className="checkbox-label" style={{ fontSize: '0.95rem' }}>
                  <input type="checkbox" checked={finePaid} onChange={e => setFinePaid(e.target.checked)} />
                  <strong>Fine Paid</strong> — I confirm ₹{issue.fineAmount} has been collected.
                </label>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="payRemarks">Remarks <small>(optional)</small></label>
              <textarea id="payRemarks" className="form-control" rows={2}
                placeholder="Any notes for this transaction…"
                value={remarks} onChange={e => setRemarks(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing…' : hasFine ? '💰 Pay & Complete Return' : '✅ Complete Return'}
              </button>
              <button type="button" className="btn btn-secondary"
                onClick={() => navigate('/transactions/return-book')}>
                ← Back
              </button>
            </div>
          </form>
        )}

        {msg && (
          <button className="btn btn-secondary" style={{ marginTop: 10 }}
            onClick={() => navigate('/dashboard')}>
            🏠 Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
