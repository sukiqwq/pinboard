import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/users/login/', credentials);
  const { token, user_id, username } = response.data;
  return {
    user: {
      id: user_id,
      username: username,
    },
    token: token,
  };
};

export const register = async (userData) => {
  // 修改注册接口路径为 /users/register/
  const response = await api.post('/users/register/', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null; // 检查 user 是否存在并解析
  } catch (error) {
    console.error('Failed to parse user data from localStorage:', error);
    return null;
  }
};