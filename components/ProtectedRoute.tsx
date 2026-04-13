import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('Student' | 'Teacher' | 'Admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const roleHomePath: Record<string, string> = {
    Student: '/student-dashboard',
    Teacher: '/teacher-dashboard',
    Admin: '/admin-dashboard',
  };

  if (loading || (user && allowedRoles && !role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role as any)) {
    const fallbackPath = roleHomePath[role] || '/login';
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] gap-4 text-center px-6">
        <ShieldAlert className="text-red-500" size={64} />
        <h1 className="text-4xl font-display font-bold text-white">Access Denied</h1>
        <p className="text-gray-400 max-w-md">
          You do not have permission for this page. Redirecting you to your dashboard.
        </p>
        <button
          onClick={() => navigate(fallbackPath, { replace: true })}
          className="mt-6 px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
        >
          Go to My Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
