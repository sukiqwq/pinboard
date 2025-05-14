import axios from 'axios';

// 创建基础 axios 实例
const api = axios.create({
  // baseURL: 'http://127.0.0.1:8000/',
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证信息
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 处理常见错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理 401 未授权错误
    if (error.response && error.response.status === 401) {
      // 清除本地存储的认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 重定向到登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;