import { useState, useEffect } from 'react';
import api from '../../api';

export default function MembersReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/members')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN') : '—';

  return (
    <div>
      <div className="page-title">🧑‍🤝‍🧑 Members Report</div>
      <div className="page-subtitle">List of all registered library members.</div>

      <div className="card">
        {loading ? <div className="loading">Loading report…</div> :
         data.length === 0 ? <div className="empty-state">No members found.</div> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Mem No</th>
                  <th>Name</th>
                  <th>Email / Phone</th>
                  <th>Duration</th>
                  <th>Expires On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map(m => (
                  <tr key={m._id} style={m.status === 'cancelled' ? { opacity: 0.6 } : {}}>
                    <td style={{ fontWeight: 600 }}>{m.membershipNo}</td>
                    <td>{m.name}</td>
                    <td>
                      <div>{m.email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.phone}</div>
                    </td>
                    <td>{m.membershipType === '6months' ? '6 Months' : m.membershipType === '1year' ? '1 Year' : '2 Years'}</td>
                    <td>{fmt(m.expiryDate)}</td>
                    <td>
                      <span className={`badge ${m.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                        {m.status.toUpperCase()}
                      </span>
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
