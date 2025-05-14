import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBoard, deleteBoard } from '../../services/boardService';
import { getBoardPins } from '../../services/pinService';
import { followBoard, unfollowBoard, checkBoardFollowStatus } from '../../services/followService';
import PinGrid from '../pin/PinGrid';
import Spinner from '../common/Spinner';
import styled from 'styled-components';

const BoardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const BoardHeader = styled.div`
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BoardTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 1rem;
`;

const Username = styled(Link)`
  font-weight: 600;
  color: #333;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#e60023' : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  border-radius: 24px;
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.primary ? '#ad081b' : '#ddd'};
  }
  
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 0.25rem;
  }
`;

const FollowButton = styled(Button)`
  background-color: ${props => props.following ? '#e60023' : '#f0f0f0'};
  color: ${props => props.following ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props.following ? '#ad081b' : '#ddd'};
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StatItem = styled.div`
  color: #666;
  font-size: 0.9rem;
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

const BoardPage = () => {
  const { boardId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取面板信息
        const boardResponse = await getBoard(boardId);
        setBoard(boardResponse.data);
        setFollowerCount(boardResponse.data.follower_count || 0);

        // 获取面板中的图钉
        const pinsResponse = await getBoardPins(boardId);
        setPins(pinsResponse.data);

        // 如果已登录，检查是否正在关注该面板
        if (currentUser) {
          const followResponse = await checkBoardFollowStatus(boardId);
          setFollowing(followResponse.data.following);
        }

        setLoading(false);
      } catch (err) {
        console.error('获取面板数据失败:', err);
        setError('获取面板数据失败，请稍后再试');
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId, currentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      if (following) {
        await unfollowBoard(boardId);
        setFollowing(false);
        setFollowerCount(prevCount => Math.max(0, prevCount - 1));
      } else {
        await followBoard(boardId);
        setFollowing(true);
        setFollowerCount(prevCount => prevCount + 1);
      }
    } catch (err) {
      console.error('关注操作失败:', err);
    }
  };

  const handleDeleteBoard = async () => {
    if (!currentUser || (board && board.owner.id !== currentUser.user_id)) return;

    if (window.confirm('确定要删除这个面板吗？此操作不可撤销，所有图钉将被移除。')) {
      try {
        await deleteBoard(boardId);
        navigate(`/user/${currentUser.username}`);
      } catch (err) {
        console.error('删除面板失败:', err);
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error || !board) {
    return <div>Error: {error || '找不到该面板'}</div>;
  }

  const isOwner = currentUser && currentUser.user_id === board.owner.id;

  return (
    <BoardContainer>
      <BoardHeader>
        <BoardTitle>
          <Title>{board.board_name}</Title>

          <ActionButtons>
            {isOwner ? (
              <>
                <Button as={Link} to={`/board/${boardId}/edit`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                  </svg>
                  编辑
                </Button>
                <Button onClick={handleDeleteBoard}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor" />
                  </svg>
                  删除
                </Button>
              </>
            ) : currentUser && (
              <FollowButton
                following={following}
                onClick={handleFollowToggle}
              >
                {following ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                    </svg>
                    已关注
                  </>
                ) : '关注'}
              </FollowButton>
            )}

            {isOwner && (
              <Button primary as={Link} to={`/pin/create?boardId=${boardId}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
                </svg>
                添加图钉
              </Button>
            )}
          </ActionButtons>
        </BoardTitle>

        {board.descriptor && (
          <Description>{board.descriptor}</Description>
        )}

        <UserInfo>
          <Avatar>{board.owner.username.charAt(0).toUpperCase()}</Avatar>
          <Username to={`/user/${board.owner.username}`}>{board.owner.username}</Username>
        </UserInfo>

        <Stats>
          <StatItem>{pins.length} 个图钉</StatItem>
          <StatItem>{followerCount} 个关注者</StatItem>
        </Stats>
      </BoardHeader>

      {pins.length > 0 ? (
        <PinGrid pins={pins} />
      ) : (
        <EmptyState>
          <EmptyStateTitle>该面板还没有任何图钉</EmptyStateTitle>
          <EmptyStateMessage>
            {isOwner
              ? '开始添加图钉到这个面板，收集和整理您喜欢的内容！'
              : '该面板目前为空，稍后再来查看。'}
          </EmptyStateMessage>

          {isOwner && (
            <Button primary as={Link} to={`/pin/create?boardId=${boardId}`}>
              添加第一个图钉
            </Button>
          )}
        </EmptyState>
      )}
    </BoardContainer>
  );
};

export default BoardPage;