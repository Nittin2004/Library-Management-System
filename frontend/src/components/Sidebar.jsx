import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { label: '🏠 Dashboard', to: '/dashboard', roles: ['admin', 'user'] },
  { label: '📦 Maintenance', header: true, roles: ['admin'] },
  { label: '➕ Add Book', to: '/maintenance/add-book', roles: ['admin'] },
  { label: '✏️ Update Book', to: '/maintenance/update-book', roles: ['admin'] },
  { label: '🪪 Add Membership', to: '/maintenance/add-membership', roles: ['admin'] },
  { label: '🔄 Update Membership', to: '/maintenance/update-membership', roles: ['admin'] },
  { label: '👤 User Management', to: '/maintenance/user-management', roles: ['admin'] },
  { label: '🔁 Transactions', header: true, roles: ['admin', 'user'] },
  { label: '🔍 Book Available', to: '/transactions/book-available', roles: ['admin', 'user'] },
  { label: '📤 Book Issue', to: '/transactions/book-issue', roles: ['admin', 'user'] },
  { label: '📥 Return Book', to: '/transactions/return-book', roles: ['admin', 'user'] },
  { label: '📋 Reports', header: true, roles: ['admin', 'user'] },
  { label: '📖 Issued Books', to: '/reports/issued', roles: ['admin', 'user'] },
  { label: '⚠️ Overdue Books', to: '/reports/overdue', roles: ['admin', 'user'] },
  { label: '🧑‍🤝‍🧑 Members Report', to: '/reports/members', roles: ['admin', 'user'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">📚</span>
        <span className="brand-name">LibraryMS</span>
      </div>
      <div className="sidebar-user">
        <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
        <div>
          <div className="user-name">{user.name}</div>
          <div className="user-role">{user.role === 'admin' ? '🛡️ Admin' : '👤 User'}</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (!item.roles.includes(user.role)) return null;
          if (item.header) return <div key={i} className="nav-section-label">{item.label}</div>;
          return (
            <NavLink key={i} to={item.to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <a href="chart.html" target="_blank" className="chart-link-sidebar">📊 Flow Chart</a>
        <button className="btn-logout" onClick={handleLogout}>🚪 Logout</button>
      </div>
    </aside>
  );
}
