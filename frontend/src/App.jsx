import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Login        from './pages/Login';
import Dashboard    from './pages/Dashboard';
import AddBook      from './pages/maintenance/AddBook';
import UpdateBook   from './pages/maintenance/UpdateBook';
import AddMembership from './pages/maintenance/AddMembership';
import UpdateMembership from './pages/maintenance/UpdateMembership';
import UserManagement from './pages/maintenance/UserManagement';
import BookAvailable from './pages/transactions/BookAvailable';
import BookIssue     from './pages/transactions/BookIssue';
import ReturnBook    from './pages/transactions/ReturnBook';
import PayFine       from './pages/transactions/PayFine';
import IssuedBooks   from './pages/reports/IssuedBooks';
import OverdueBooks  from './pages/reports/OverdueBooks';
import MembersReport from './pages/reports/MembersReport';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />

      <Route path="/dashboard" element={
        <ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>
      }/>

      {/* Maintenance – admin only */}
      <Route path="/maintenance/add-book" element={
        <ProtectedRoute adminOnly><AppLayout><AddBook /></AppLayout></ProtectedRoute>
      }/>
      <Route path="/maintenance/update-book" element={
        <ProtectedRoute adminOnly><AppLayout><UpdateBook /></AppLayout></ProtectedRoute>
      }/>
      <Route path="/maintenance/add-membership" element={
        <ProtectedRoute adminOnly><AppLayout><AddMembership /></AppLayout></ProtectedRoute>
      }/>
      <Route path="/maintenance/update-membership" element={
        <ProtectedRoute adminOnly><AppLayout><UpdateMembership /></AppLayout></ProtectedRoute>
      }/>
      <Route path="/maintenance/user-management" element={
        <ProtectedRoute adminOnly><AppLayout><UserManagement /></AppLayout></ProtectedRoute>
      }/>

      {/* Transactions */}
      <Route path="/transactions/book-available" element={
        <ProtectedRoute><AppLayout><BookAvailable /></AppLayout></ProtectedRoute>
      }/>
      <Route path="/transactions/book-issue" element={
        <ProtectedRoute><AppLayout><BookIssue /></AppLayout></ProtectedRoute>
      }/>
      <Route path="/transactions/return-book" element={
        <ProtectedRoute><AppLayout><ReturnBook /></AppLayout></ProtectedRoute>
      }/>
      <Route path="/transactions/pay-fine" element={
        <ProtectedRoute><AppLayout><PayFine /></AppLayout></ProtectedRoute>
      }/>

      {/* Reports */}
      <Route path="/reports/issued" element={
        <ProtectedRoute><AppLayout><IssuedBooks /></AppLayout></ProtectedRoute>
      }/>
      <Route path="/reports/overdue" element={
        <ProtectedRoute><AppLayout><OverdueBooks /></AppLayout></ProtectedRoute>
      }/>
      <Route path="/reports/members" element={
        <ProtectedRoute><AppLayout><MembersReport /></AppLayout></ProtectedRoute>
      }/>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
