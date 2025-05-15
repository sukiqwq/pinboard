import api from './api';

// 获取面板详情
export const getBoard = async (boardId) => {
  return await api.get(`/boards/${boardId}/`);
};

// 创建新面板
export const createBoard = async (boardData) => {
  return await api.post('/boards/', boardData);
};

// 更新面板
export const updateBoard = async (boardId, boardData) => {
  return await api.put(`/boards/${boardId}/`, boardData);
};

// 删除面板
export const deleteBoard = async (boardId) => {
  return await api.delete(`/boards/${boardId}/`);
};

// 获取用户的所有面板
export const getBoards = async (userId) => {
  if (!userId) {
    return await api.get('/boards/my_boards/');
  }
  return await api.get(`/users/${userId}/boards/`);
};


// 获取面板关注者
export const getBoardFollowers = async (boardId, page = 1, limit = 20) => {
  return await api.get(`/boards/${boardId}/followers/`, {
    params: { page, limit }
  });
};

// 设置面板封面图片
export const setBoardCover = async (boardId, pinId) => {
  return await api.put(`/boards/${boardId}/cover/`, { pin_id: pinId });
};

// 获取推荐面板
export const getRecommendedBoards = async () => {
  return await api.get('/boards/recommended/');
};

// 获取热门面板
export const getPopularBoards = async () => {
  return await api.get('/boards/popular/');
};