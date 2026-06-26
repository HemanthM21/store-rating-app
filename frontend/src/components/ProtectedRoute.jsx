import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    const redirects = { admin: '/admin/dashboard', owner: '/owner/dashboard', user: '/stores' };
    return <Navigate to={redirects[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
