import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedAdminRoute() {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
