import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { currentUser } = useAuth();

  // 如果用户未登录，重定向到登录页
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 如果用户已登录，渲染子路由
  return <Outlet />;
};

export default ProtectedRoute;