import { useState, useEffect } from 'react';
import api from '../../api';

export default function IssuedBooks() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/issued')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN') : '—';

  return (
    <div>
      <div className="page-title">📖 Issued Books Report</div>
      <div className="page-subtitle">List of all books currently issued but not yet returned.</div>

      <div className="card">
        {loading ? <div className="loading">Loading report…</div> :
         data.length === 0 ? <div className="empty-state">No books are currently issued.</div> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Serial No</th>
                  <th>Borrower</th>
                  <th>Mem. No</th>
                  <th>Issue Date</th>
                  <th>Return Due</th>
                </tr>
              </thead>
              <tbody>
                {data.map(i => (
                  <tr key={i._id}>
                    <td>{i.bookTitle}</td>
                    <td>{i.bookSerialNo}</td>
                    <td>{i.borrowerName || '—'}</td>
                    <td>{i.membershipNo || '—'}</td>
                    <td>{fmt(i.issueDate)}</td>
                    <td style={new Date(i.scheduledReturn) < new Date() ? { color: '#dc2626', fontWeight: 600 } : {}}>
                      {fmt(i.scheduledReturn)}
                      {new Date(i.scheduledReturn) < new Date() && ' ⚠️'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
