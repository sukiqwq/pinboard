import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser } from '../services/authService';

// 创建认证上下文
const AuthContext = createContext();

// 创建认证提供者组件
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从本地存储加载用户
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // 提供登录、注销和用户信息更新方法
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    console.log('userData', userData);
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 创建自定义 Hook 以便在组件中使用
export const useAuth = () => {
  return useContext(AuthContext);
};