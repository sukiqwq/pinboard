import api from './api';

// 获取用户资料
export const getUserProfile = async (username) => {
  return await api.get(`/users/${username}`);
};

// 更新用户资料
export const updateUserProfile = async (userData) => {
  return await api.put('/users/profile', userData);
};

// 更改密码
export const changePassword = async (passwordData) => {
  return await api.put('/users/password', passwordData);
};

// 获取用户活动
export const getUserActivity = async (userId, page = 1, limit = 20) => {
  return await api.get(`/users/${userId}/activity`, {
    params: { page, limit }
  });
};

// 获取用户通知
export const getUserNotifications = async (page = 1, limit = 20) => {
  return await api.get('/users/notifications', {
    params: { page, limit }
  });
};

// 标记通知为已读
export const markNotificationRead = async (notificationId) => {
  return await api.put(`/notifications/${notificationId}/read`);
};

// 标记所有通知为已读
export const markAllNotificationsRead = async () => {
  return await api.put('/notifications/read-all');
};

// 获取用户设置
export const getUserSettings = async () => {
  return await api.get('/users/settings');
};

// 更新用户设置
export const updateUserSettings = async (settingsData) => {
  return await api.put('/users/settings', settingsData);
};

// 获取用户统计信息
export const getUserStats = async (userId) => {
  return await api.get(`/users/${userId}/stats`);
};

// 上传用户头像
export const uploadAvatar = async (formData) => {
  return await api.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 删除用户账号
export const deleteAccount = async () => {
  return await api.delete('/users/account');
};

// 获取用户的面板
export const getBoards = async (userId) => {
  return await api.get(`/users/${userId}/boards`);
};