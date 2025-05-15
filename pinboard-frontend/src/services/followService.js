import api from './api';

// 获取用户关注的流 (check)
export const getUserFollowStreams = async () => {
  return await api.get('/follow-streams/');
};

// 创建关注流 (check)
export const createFollowStream = async (streamData) => {
  return await api.post('/follow-streams/', streamData);
};
 
// 获取关注流详情 (check)
export const getFollowStream = async (streamId) => {
  return await api.get(`/follow-streams/${streamId}/`);
};

// 更新关注流
export const updateFollowStream = async (streamId, streamData) => {
  return await api.put(`/follow-streams/${streamId}/`, streamData);
};

// 删除关注流 (check)
export const deleteFollowStream = async (streamId) => {
  return await api.delete(`/follow-streams/${streamId}/`);
};

// 获取关注流中的所有面板 (check)
export const getStreamBoards = async (streamId) => {
  return await api.get(`/follow-streams/${streamId}/boards/`);
};

// 在这个实现中，followBoard 必须通过 addBoardToStream 来关注面板
// 关注面板（通过取消关注后重新添加到流中实现）
export const followBoard = async (boardId) => {
  return await api.post(`/boards/${boardId}/follow/`);
};
// 取消关注面板 (check)
// It will remove the board from all the stream
export const unfollowBoard = async (boardId) => {
  return await api.delete(`/boards/${boardId}/unfollow/`);
};

// 检查面板关注状态 (check)
export const checkBoardFollowStatus = async (boardId) => {
  return await api.get(`/boards/${boardId}/follow_status/`);
};

// 添加面板到关注流 (check)
export const addBoardToStream = async (streamId, boardId) => {
  return await api.post(`/follow-streams/${streamId}/boards/`, { board_id: boardId });
};

// 从关注流移除面板 (check)
export const removeBoardFromStream = async (streamId, boardId) => {
  return await api.delete(`/follow-streams/${streamId}/boards/${boardId}/`);
};