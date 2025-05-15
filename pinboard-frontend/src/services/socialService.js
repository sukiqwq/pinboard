import api from './api';

// 获取好友请求列表
export const getFriendRequests = async () => {
  return await api.get('/friend-requests/list-requests/');
};

// 发送好友请求
export const sendFriendRequest = async (receiverId) => {
  const data = {
    "receiver": receiverId
  };
  return await api.post('/friend-requests/', data);
};

// 接受好友请求
export const acceptFriendRequest = async (requestId) => {
  return await api.post(`/friend-requests/${requestId}/accept/`, { "status": 'accepted' });
};

// 拒绝好友请求
export const rejectFriendRequest = async (requestId) => {
  return await api.post(`/friend-requests/${requestId}/reject/`, { "status": 'rejected' });
};

// 取消已发送的好友请求
export const cancelFriendRequest = async (requestId) => {
  return await api.delete(`/friend-requests/${requestId}`);
};

// 获取用户的好友列表
export const getFriends = async (userId) => {
  return await api.get(`/users/${userId}/friends`);
};

// 删除好友
export const removeFriend = async (friendId) => {
  return await api.delete(`/friends/${friendId}`);
};

// 检查与用户的好友关系状态
export const checkFriendshipStatus = async (userId) => {
  return await api.get(`/friendship-status/${userId}`);
};

// 获取共同好友
export const getMutualFriends = async (userId) => {
  return await api.get(`/users/${userId}/mutual-friends`);
};

// 获取好友推荐
export const getFriendRecommendations = async () => {
  return await api.get('/friends/recommendations');
};

// 获取好友动态
export const getFriendActivities = async (page = 1, limit = 20) => {
  return await api.get('/friends/activities', {
    params: { page, limit }
  });
};