import { useState, useEffect } from 'react';
import api from '../../api';

export default function OverdueBooks() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/overdue')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN') : '—';
  const getDays = (d) => {
    const diff = new Date() - new Date(d);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      <div className="page-title">⚠️ Overdue Books Report</div>
      <div className="page-subtitle">List of issued books that have passed their scheduled return date.</div>

      <div className="card">
        {loading ? <div className="loading">Loading report…</div> :
         data.length === 0 ? <div className="empty-state">No overdue books right now! 🎉</div> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Serial No</th>
                  <th>Borrower</th>
                  <th>Due Date</th>
                  <th>Days Overdue</th>
                  <th>Est. Fine (₹5/d)</th>
                </tr>
              </thead>
              <tbody>
                {data.map(i => {
                  const days = getDays(i.scheduledReturn);
                  return (
                    <tr key={i._id} style={{ background: '#fef2f2' }}>
                      <td>{i.bookTitle}</td>
                      <td>{i.bookSerialNo}</td>
                      <td>{i.borrowerName || '—'}</td>
                      <td>{fmt(i.scheduledReturn)}</td>
                      <td style={{ color: '#dc2626', fontWeight: 600 }}>{days} days</td>
                      <td style={{ fontWeight: 600 }}>₹{days * 5}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
