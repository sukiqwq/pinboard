import api from './api';

// 获取用户关注的流
export const getUserFollowStreams = async (userId) => {
  return await api.get(`/users/${userId}/follow-streams`);
};

// 创建关注流
export const createFollowStream = async (streamData) => {
  return await api.post('/follow-streams', streamData);
};

// 获取关注流详情
export const getFollowStream = async (streamId) => {
  return await api.get(`/follow-streams/${streamId}`);
};

// 更新关注流
export const updateFollowStream = async (streamId, streamData) => {
  return await api.put(`/follow-streams/${streamId}`, streamData);
};

// 删除关注流
export const deleteFollowStream = async (streamId) => {
  return await api.delete(`/follow-streams/${streamId}`);
};

// 获取关注流内容
export const getFollowStreamContent = async (streamId, page = 1, limit = 20) => {
  return await api.get(`/follow-streams/${streamId}/content`, {
    params: { page, limit }
  });
};

// 关注面板
export const followBoard = async (boardId) => {
  return await api.post(`/boards/${boardId}/follow`);
};

// 取消关注面板
export const unfollowBoard = async (boardId) => {
  return await api.delete(`/boards/${boardId}/follow`);
};

// 检查面板关注状态
export const checkBoardFollowStatus = async (boardId) => {
  return await api.get(`/boards/${boardId}/follow_status`);
};

// 添加面板到关注流
export const addBoardToStream = async (streamId, boardId) => {
  return await api.post(`/follow-streams/${streamId}/boards`, { board_id: boardId });
};

// 从关注流移除面板
export const removeBoardFromStream = async (streamId, boardId) => {
  return await api.delete(`/follow-streams/${streamId}/boards/${boardId}`);
};

// 获取关注流中包含的所有面板
export const getStreamBoards = async (streamId) => {
  return await api.get(`/follow-streams/${streamId}/boards`);
};