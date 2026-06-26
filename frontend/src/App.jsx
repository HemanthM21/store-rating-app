import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/global.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import UpdatePassword from './pages/UpdatePassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import UserStores from './pages/user/UserStores';
import OwnerDashboard from './pages/owner/OwnerDashboard';

const AppShell = ({ children }) => (
  <div className="app-shell">
    <Navbar />
    {children}
  </div>
);

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const redirects = { admin: '/admin/dashboard', owner: '/owner/dashboard', user: '/stores' };
  return <Navigate to={redirects[user.role] || '/login'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RootRedirect />} />

          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AppShell><AdminDashboard /></AppShell></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AppShell><AdminUsers /></AppShell></ProtectedRoute>} />
          <Route path="/admin/stores" element={<ProtectedRoute roles={['admin']}><AppShell><AdminStores /></AppShell></ProtectedRoute>} />

          <Route path="/stores" element={<ProtectedRoute roles={['user']}><AppShell><UserStores /></AppShell></ProtectedRoute>} />
          <Route path="/owner/dashboard" element={<ProtectedRoute roles={['owner']}><AppShell><OwnerDashboard /></AppShell></ProtectedRoute>} />

          <Route path="/update-password" element={<ProtectedRoute roles={['admin','user','owner']}><AppShell><UpdatePassword /></AppShell></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
