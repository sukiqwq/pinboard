import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../services/userService';
import { getBoards } from '../../services/boardService';
import { sendFriendRequest, checkFriendshipStatus } from '../../services/socialService';
import Spinner from '../common/Spinner';
import PinGrid from '../pin/PinGrid';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const AvatarContainer = styled.div`
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    margin-right: 2rem;
    margin-bottom: 0;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  color: #666;
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  
  @media (min-width: 768px) {
    text-align: left;
  }
`;

const Username = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Bio = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const Stats = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
  
  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ActionButton = styled.button`
  background-color: ${props => props.primary ? '#e60023' : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  border-radius: 24px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: center;
  
  &:hover {
    background-color: ${props => props.primary ? '#ad081b' : '#ddd'};
  }
  
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
  
  @media (min-width: 768px) {
    align-self: flex-start;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#e60023' : 'transparent'};
  color: ${props => props.active ? '#e60023' : '#666'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #e60023;
  }
`;

const BoardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const BoardCard = styled(Link)`
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const BoardThumbnail = styled.div`
  height: 150px;
  background-color: #f5f5f5;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BoardInfo = styled.div`
  padding: 1rem;
`;

const BoardName = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const BoardStats = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const EmptyStateMessage = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const ProfilePage = () => {
  const { username } = useParams();
  const { currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [boards, setBoards] = useState([]);
  const [pins, setPins] = useState([]);
  const [activeTab, setActiveTab] = useState('boards');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 获取用户资料
        const profileResponse = await getUserProfile(username);
        setProfile(profileResponse.data);
        
        // 获取用户的面板
        const boardsResponse = await getBoards(profileResponse.data.user_id);
        setBoards(boardsResponse.data);
        
        // 如果已登录，检查好友关系状态
        if (currentUser && currentUser.user_id !== profileResponse.data.user_id) {
          const statusResponse = await checkFriendshipStatus(profileResponse.data.user_id);
          setFriendshipStatus(statusResponse.data.status);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('获取用户资料失败:', err);
        setError('获取用户资料失败，请稍后再试');
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [username, currentUser]);
  
  const handleSendFriendRequest = async () => {
    if (!currentUser) return;
    
    try {
      await sendFriendRequest(profile.user_id);
      setFriendshipStatus('pending');
      setFriendRequestSent(true);
    } catch (err) {
      console.error('发送好友请求失败:', err);
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  if (error || !profile) {
    return <div>Error: {error || '找不到该用户'}</div>;
  }
  
  const isOwnProfile = currentUser && currentUser.user_id === profile.user_id;
  
  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarContainer>
          <Avatar>{profile.username.charAt(0).toUpperCase()}</Avatar>
        </AvatarContainer>
        
        <ProfileInfo>
          <Username>{profile.username}</Username>
          
          {profile.profile_info && (
            <Bio>{profile.profile_info}</Bio>
          )}
          
          <Stats>
            <StatItem>
              <StatValue>{boards.length}</StatValue>
              <StatLabel>面板</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{profile.pin_count || 0}</StatValue>
              <StatLabel>图钉</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{profile.friend_count || 0}</StatValue>
              <StatLabel>好友</StatLabel>
            </StatItem>
          </Stats>
          
          {isOwnProfile ? (
            <ActionButton as={Link} to="/profile/edit">编辑个人资料</ActionButton>
          ) : currentUser && (
            <>
              {friendshipStatus === 'friends' && (
                <ActionButton disabled>已是好友</ActionButton>
              )}
              {friendshipStatus === 'pending' && (
                <ActionButton disabled>
                  {friendRequestSent ? '请求已发送' : '等待接受'}
                </ActionButton>
              )}
              {(!friendshipStatus || friendshipStatus === 'none') && (
                <ActionButton primary onClick={handleSendFriendRequest}>
                  添加好友
                </ActionButton>
              )}
            </>
          )}
        </ProfileInfo>
      </ProfileHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'boards'} 
          onClick={() => handleTabChange('boards')}
        >
          面板
        </Tab>
        <Tab 
          active={activeTab === 'pins'} 
          onClick={() => handleTabChange('pins')}
        >
          图钉
        </Tab>
      </TabsContainer>
      
      {activeTab === 'boards' && (
        <>
          {boards.length > 0 ? (
            <BoardsGrid>
              {boards.map(board => (
                <BoardCard key={board.board_id} to={`/board/${board.board_id}`}>
                  <BoardThumbnail>
                    {board.cover_image ? (
                      <img src={board.cover_image} alt={board.board_name} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                        暂无图片
                      </div>
                    )}
                  </BoardThumbnail>
                  <BoardInfo>
                    <BoardName>{board.board_name}</BoardName>
                    <BoardStats>{board.pin_count || 0} 个图钉</BoardStats>
                  </BoardInfo>
                </BoardCard>
              ))}
              
              {isOwnProfile && (
                <BoardCard to="/board/create" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#666" />
                    </svg>
                    <div style={{ marginTop: '0.5rem', color: '#666' }}>创建面板</div>
                  </div>
                </BoardCard>
              )}
            </BoardsGrid>
          ) : (
            <EmptyState>
              <EmptyStateTitle>
                {isOwnProfile ? '您还没有创建任何面板' : `${profile.username} 还没有创建任何面板`}
              </EmptyStateTitle>
              <EmptyStateMessage>
                {isOwnProfile 
                  ? '面板是整理和保存图钉的地方。为您的不同兴趣创建面板，开始收集灵感吧！' 
                  : '当有面板创建时，它们将显示在这里。'}
              </EmptyStateMessage>
              
              {isOwnProfile && (
                <ActionButton primary as={Link} to="/board/create">
                  创建第一个面板
                </ActionButton>
              )}
            </EmptyState>
          )}
        </>
      )}
      
      {activeTab === 'pins' && (
        <>
          {pins.length > 0 ? (
            <PinGrid pins={pins} />
          ) : (
            <EmptyState>
              <EmptyStateTitle>
                {isOwnProfile ? '您还没有保存任何图钉' : `${profile.username} 还没有保存任何图钉`}
              </EmptyStateTitle>
              <EmptyStateMessage>
                {isOwnProfile 
                  ? '保存您喜欢的图钉，开始创建个人收藏吧！' 
                  : '当保存图钉时，它们将显示在这里。'}
              </EmptyStateMessage>
              
              {isOwnProfile && (
                <ActionButton primary as={Link} to="/">
                  浏览图钉
                </ActionButton>
              )}
            </EmptyState>
          )}
        </>
      )}
    </ProfileContainer>
  );
};

export default ProfilePage;