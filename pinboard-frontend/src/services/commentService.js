import api from './api';

// 获取图钉评论
export const getComments = async (pinId) => {
  return await api.get(`/pins/${pinId}/comments`);
};

// 添加评论到图钉
export const addComment = async (pinId, content) => {
  return await api.post(`/pins/${pinId}/comments`, { content });
};

// 添加评论到 Repin
export const addRepinComment = async (repinId, content) => {
  return await api.post(`/repins/${repinId}/comments`, { content });
};

// 获取 Repin 评论
export const getRepinComments = async (repinId) => {
  return await api.get(`/repins/${repinId}/comments`);
};

// 删除评论
export const deleteComment = async (commentId) => {
  return await api.delete(`/comments/${commentId}`);
};

// 更新评论
export const updateComment = async (commentId, content) => {
  return await api.put(`/comments/${commentId}`, { content });
};

// 获取用户的所有评论
export const getUserComments = async (userId, page = 1, limit = 20) => {
  return await api.get(`/users/${userId}/comments`, {
    params: { page, limit }
  });
};