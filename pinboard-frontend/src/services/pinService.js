import api from './api';

// 获取所有图钉（分页）
export const getPins = async (page = 1, limit = 20) => {
  return await api.get('/pins/', {
    params: { page, limit }
  });
};

// 获取单个图钉详情
export const getPin = async (pinId) => {
  return await api.get(`/pins/${pinId}/`);
};

// 获取指定面板的所有图钉
export const getBoardPins = async (boardId, page = 1, limit = 20) => {
  return await api.get(`/boards/${boardId}/pins/`, {
    params: { page, limit }
  });
};

// 获取用户的所有图钉
export const getUserPins = async (userId, page = 1, limit = 20) => {
  return await api.get(`/users/${userId}/pins/`, {
    params: { page, limit }
  });
};

// 上传图片
export const uploadPicture = async (formData) => {
  // 检查是否是URL上传或文件上传
  const isUrlUpload = formData.get('external_url');
  
  if (isUrlUpload) {
    // 对于URL上传，使用JSON格式
    return await api.post('/pictures/', {
      external_url: formData.get('external_url'),
      tags: formData.get('tags') || ''
    });
  } else {
    // 对于文件上传，保持使用FormData
    return await api.post('/pictures/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
// 创建图钉
export const createPin = async (pinData) => {
  return await api.post('/pins/', pinData);
};

// 更新图钉
export const updatePin = async (pinId, pinData) => {
  return await api.put(`/pins/${pinId}/`, pinData);
};

// 删除图钉
export const deletePin = async (pinId) => {
  return await api.delete(`/pins/${pinId}/`);
};

// 点赞
export const likePin = async (pinId) => {
  return await api.post(`/pins/${pinId}/like/`);
};

// 取消点赞
export const unlikePin = async (pinId) => {
  return await api.post(`/pins/${pinId}/unlike/`);
};

// 创建 Repin
export const createRepin = async (repinData) => {
  const originPinId = repinData.origin_pin;
  return await api.post(`/pins/${originPinId}/repin/`, repinData);
};

// 获取 Repin 详情
export const getRepin = async (repinId) => {
  return await api.get(`/repins/${repinId}/`);
};

// 删除 Repin
export const deleteRepin = async (repinId) => {
  return await api.delete(`/repins/${repinId}/`);
};

// 获取评论
export const getComments = async (pinId) => {
  return await api.get(`/pins/${pinId}/get-comments/`);
};

// 添加评论
export const addComment = async ({ pinId, content }) => {
  const data = { content };
  if (pinId) data.pin = pinId;

  return await api.post(`/pins/${pinId}/create-comments/`, data);
};

// 删除评论
export const deleteComment = async (commentId) => {
  return await api.delete(`/comments/${commentId}/`);
};