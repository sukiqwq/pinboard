import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchPins, searchBoards, searchUsers, searchTags } from '../../services/searchService';
import { sendFriendRequest } from '../../services/socialService';
import PinGrid from '../pin/PinGrid';
import Spinner from '../common/Spinner';
import styled from 'styled-components';

const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchHeader = styled.div`
  margin-bottom: 2rem;
`;

const SearchQuery = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
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

const UserCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  transition: transform 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const UserAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 1rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h3`
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
`;

const UserBio = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.9rem;
`;

const UserStat = styled.div`
  color: #999;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const BoardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const BoardCard = styled.div`
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;
  
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
`;

const BoardDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const BoardOwner = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const OwnerAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  margin-right: 0.5rem;
`;

const OwnerName = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const AddFriendButton = styled.button`
  width: 30px; 
  height: 30px; 
  padding: 0;
  background-color: #e60023;
  border: none; 
  border-radius: 50%; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 
  transition: background-color 0.2s ease; 

  &:hover {
    background-color: #c3001c; 
  }

  &:active {
    background-color: #a00018; 
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const NoResultsTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const NoResultsMessage = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q') || '';

  const [activeTab, setActiveTab] = useState('pins');
  const [pins, setPins] = useState([]);
  const [boards, setBoards] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      navigate('/');
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // 根据当前活动标签获取对应的搜索结果
        if (activeTab === 'pins') {
          const response = await searchPins(query);
          console.log('Pins response:', response.data);
          setPins(response.data);
        } else if (activeTab === 'tags') {
          const response = await searchTags(query);
          setPins(response.data);
        } else if (activeTab === 'boards') {
          const response = await searchBoards(query);
          setBoards(response.data);
        } else if (activeTab === 'users') {
          const response = await searchUsers(query);
          setUsers(response.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('搜索失败:', err);
        setError('搜索失败，请稍后再试');
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, activeTab, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleUserClick = (username) => {
    navigate(`/user/${username}`);
  };

  const handleBoardClick = (boardId) => {
    navigate(`/board/${boardId}`);
  };

  const handleSendFriendRequest = async (user_id) => {
    try {
      await sendFriendRequest(user_id);
      alert('好友请求已发送！');
    } catch (err) {
      console.error('发送好友请求失败:', err);
      alert('发送好友请求失败，请稍后再试。');
    }
  };

  if (!query.trim()) {
    return null;
  }

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchQuery>搜索结果: "{query}"</SearchQuery>

        <TabsContainer>
          <Tab
            active={activeTab === 'pins'}
            onClick={() => handleTabChange('pins')}
          >
            图钉
          </Tab>
          <Tab
            active={activeTab === 'tags'}
            onClick={() => handleTabChange('tags')}
          >
            标签
          </Tab>
          <Tab
            active={activeTab === 'boards'}
            onClick={() => handleTabChange('boards')}
          >
            面板
          </Tab>
          <Tab
            active={activeTab === 'users'}
            onClick={() => handleTabChange('users')}
          >
            用户
          </Tab>
        </TabsContainer>
      </SearchHeader>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          {activeTab === 'pins' && (
            <>
              {pins.length > 0 ? (
                <PinGrid pins={pins} />
              ) : (
                <NoResults>
                  <NoResultsTitle>没有找到匹配标题的图钉</NoResultsTitle>
                  <NoResultsMessage>
                    尝试使用不同的标题，或者使用标签搜索。
                  </NoResultsMessage>
                </NoResults>
              )}
            </>
          )}

          {activeTab === 'tags' && (
            <>
              {pins.length > 0 ? (
                <PinGrid pins={pins} />
              ) : (
                <NoResults>
                  <NoResultsTitle>没有找到匹配标签的图钉</NoResultsTitle>
                  <NoResultsMessage>
                    尝试使用不同的关键词，或者浏览其他类别。
                  </NoResultsMessage>
                </NoResults>
              )}
            </>
          )}

          {activeTab === 'boards' && (
            <>
              {boards.length > 0 ? (
                <BoardsGrid>
                  {boards.map(board => (
                    <BoardCard
                      key={board.board_id}
                      onClick={() => handleBoardClick(board.board_id)}
                    >
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
                        {board.descriptor && (
                          <BoardDescription>{board.descriptor}</BoardDescription>
                        )}
                        <BoardOwner>
                          <OwnerAvatar>{board.owner.username.charAt(0).toUpperCase()}</OwnerAvatar>
                          <OwnerName>{board.owner.username}</OwnerName>
                        </BoardOwner>
                      </BoardInfo>
                    </BoardCard>
                  ))}
                </BoardsGrid>
              ) : (
                <NoResults>
                  <NoResultsTitle>没有找到匹配的面板</NoResultsTitle>
                  <NoResultsMessage>
                    尝试使用不同的关键词，或者浏览其他类别。
                  </NoResultsMessage>
                </NoResults>
              )}
            </>
          )}

          {activeTab === 'users' && (
            <>
              {users.length > 0 ? (
                <div>
                  {users.map(user => (
                    <UserCard
                      key={user.id}
                      onClick={() => handleUserClick(user.username)}
                    >
                      <UserAvatar>{user.username.charAt(0).toUpperCase()}</UserAvatar>
                      <UserInfo>
                        <Username>{user.username}</Username>
                        {user.profile_info && (
                          <UserBio>{user.profile_info}</UserBio>
                        )}
                        <UserStat>
                          {user.board_count || 0} 个面板 • {user.pin_count || 0} 个图钉
                        </UserStat>
                      </UserInfo>
                      <AddFriendButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendFriendRequest(user.id);
                        }}
                        aria-label="添加好友"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M4 11H20V13H4V11Z" />
                          <path d="M11 4H13V20H11V4Z" />
                        </svg>
                      </AddFriendButton>
                    </UserCard>
                  ))}
                </div>
              ) : (
                <NoResults>
                  <NoResultsTitle>没有找到匹配的用户</NoResultsTitle>
                  <NoResultsMessage>
                    尝试使用不同的关键词，或者浏览其他类别。
                  </NoResultsMessage>
                </NoResults>
              )}
            </>
          )}
        </>
      )
      }
    </SearchContainer >
  );
};

export default SearchResults;