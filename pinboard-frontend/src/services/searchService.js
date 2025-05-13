import api from './api';

// 搜索图钉
export const searchPins = async (query, page = 1, limit = 20) => {
  return await api.get('/search/pins', {
    params: { q: query, page, limit }
  });
};

// 搜索面板
export const searchBoards = async (query, page = 1, limit = 20) => {
  return await api.get('/search/boards', {
    params: { q: query, page, limit }
  });
};

// 搜索用户
export const searchUsers = async (query, page = 1, limit = 20) => {
  return await api.get('/search/users', {
    params: { q: query, page, limit }
  });
};

// 搜索标签
export const searchTags = async (query, page = 1, limit = 20) => {
  return await api.get('/search/tags', {
    params: { q: query, page, limit }
  });
};

// 获取热门搜索
export const getPopularSearches = async () => {
  return await api.get('/search/popular');
};

// 获取建议搜索
export const getSuggestedSearches = async (query) => {
  return await api.get('/search/suggestions', {
    params: { q: query }
  });
};

// 综合搜索（同时返回图钉、面板和用户的结果）
export const searchAll = async (query, page = 1, limit = 20) => {
  return await api.get('/search', {
    params: { q: query, page, limit }
  });
};