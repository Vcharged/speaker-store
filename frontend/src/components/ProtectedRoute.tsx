import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'ADMIN' | 'USER' }> = ({
  children,
  requiredRole,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
