import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// 导入页面组件
import HomePage from './components/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProfilePage from './components/user/ProfilePage';
import BoardPage from './components/board/BoardPage';
import CreateBoard from './components/board/CreateBoard';
import EditBoard from './components/board/EditBoard';
import PinDetail from './components/pin/PinDetail';
import CreatePin from './components/pin/CreatePin';
import SearchResults from './components/search/SearchResults';
import FriendRequests from './components/social/FriendRequests';
import NotFound from './components/common/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/Layout';
// 导入编辑个人资料组件
import EditProfile from './components/common/EditProfile';

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <Routes>
      {/* 公共路由 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 带导航布局的路由 */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/pin/:pinId" element={<PinDetail />} />
        <Route path="/user/:username" element={<ProfilePage />} />
        <Route path="/board/:boardId" element={<BoardPage />} />
        
        {/* 受保护的路由 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/board/create" element={<CreateBoard />} />
          <Route path="/board/:boardId/edit" element={<EditBoard />} />
          <Route path="/pin/create" element={<CreatePin />} />
          <Route path="/friend-requests" element={<FriendRequests />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Route>
        
        {/* 404 页面 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;