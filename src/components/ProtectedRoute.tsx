import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/src/store';
import { UserRole } from '@/src/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (role === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
    if (role === 'CAREGIVER') return <Navigate to="/dashboard/caregiver" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
