import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const adminCards = [
    { icon: '➕', label: 'Add Book', to: '/maintenance/add-book' },
    { icon: '✏️', label: 'Update Book', to: '/maintenance/update-book' },
    { icon: '🪪', label: 'Add Membership', to: '/maintenance/add-membership' },
    { icon: '🔄', label: 'Update Membership', to: '/maintenance/update-membership' },
    { icon: '👤', label: 'User Management', to: '/maintenance/user-management' },
  ];
  const sharedCards = [
    { icon: '🔍', label: 'Book Available', to: '/transactions/book-available' },
    { icon: '📤', label: 'Book Issue', to: '/transactions/book-issue' },
    { icon: '📥', label: 'Return Book', to: '/transactions/return-book' },
    { icon: '📖', label: 'Issued Books', to: '/reports/issued' },
    { icon: '⚠️', label: 'Overdue Books', to: '/reports/overdue' },
    { icon: '🧑‍🤝‍🧑', label: 'Members Report', to: '/reports/members' },
  ];

  return (
    <div>
      <div className="page-title">Welcome, {user?.name} 👋</div>
      <div className="page-subtitle">
        Role: <strong>{user?.role === 'admin' ? '🛡️ Admin' : '👤 User'}</strong> &nbsp;•&nbsp; Library Management System
      </div>

      {user?.role === 'admin' && (
        <>
          <div className="page-title" style={{ fontSize: '1rem', marginBottom: 10 }}>📦 Maintenance</div>
          <div className="dash-grid">
            {adminCards.map(c => (
              <button key={c.to} className="dash-card" onClick={() => navigate(c.to)}>
                <span className="dash-icon">{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="page-title" style={{ fontSize: '1rem', margin: '20px 0 10px' }}>🔁 Transactions & Reports</div>
      <div className="dash-grid">
        {sharedCards.map(c => (
          <button key={c.to} className="dash-card" onClick={() => navigate(c.to)}>
            <span className="dash-icon">{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        .dash-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; margin-bottom: 16px; }
        .dash-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
          padding: 22px 14px; display: flex; flex-direction: column;
          align-items: center; gap: 10px; cursor: pointer;
          font-size: 0.88rem; font-weight: 600; color: #1e293b;
          font-family: inherit; transition: all 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .dash-card:hover { background: #eff6ff; border-color: #3b82f6; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59,130,246,0.15); }
        .dash-icon { font-size: 1.8rem; }
      `}</style>
    </div>
  );
}
