import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBoard, deleteBoard } from '../../services/boardService';
import { getBoardPins } from '../../services/pinService';
import { followBoard, unfollowBoard, checkBoardFollowStatus } from '../../services/followService';
import PinGrid from '../pin/PinGrid';
import Spinner from '../common/Spinner';
import FollowStreamModal from '../followstream/FollowStreamModal';
import {
  BoardContainer,
  BoardHeader,
  BoardTitle,
  Title,
  Description,
  UserInfo,
  Avatar,
  Username,
  ActionButtons,
  Button,
  FollowButton,
  Stats,
  StatItem,
  EmptyState,
  EmptyStateTitle,
  EmptyStateMessage
} from './BoardPage.styles';

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
  const [showFollowModal, setShowFollowModal] = useState(false);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get board information
        const boardResponse = await getBoard(boardId);
        setBoard(boardResponse.data);
        setFollowerCount(boardResponse.data.follower_count || 0);

        // Get pins in this board
        const pinsResponse = await getBoardPins(boardId);
        setPins(pinsResponse.data);

        // Check follow status if user is logged in
        if (currentUser) {
          const followResponse = await checkBoardFollowStatus(boardId);
          setFollowing(followResponse.data.following);
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch board data:', err);
        setError('Failed to load board. Please try again later.');
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId, currentUser]);

  const handleFollowToggle = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (following) {
      // Unfollow - this will remove the board from all streams
      handleUnfollowBoard();
    } else {
      // Follow - open modal to select or create a stream
      setShowFollowModal(true);
    }
  };

  const handleUnfollowBoard = async () => {
    try {
      await unfollowBoard(boardId);
      setFollowing(false);
      setFollowerCount(prevCount => Math.max(0, prevCount - 1));
    } catch (err) {
      console.error('Failed to unfollow board:', err);
    }
  };

  const handleFollowSuccess = () => {
    setFollowing(true);
    setFollowerCount(prevCount => prevCount + 1);
  };

  const handleDeleteBoard = async () => {
    if (!currentUser || (board && board.owner.id !== currentUser.user_id)) return;

    if (window.confirm('Are you sure you want to delete this board? This action is irreversible, and all pins will be removed.')) {
      try {
        await deleteBoard(boardId);
        navigate(`/user/${currentUser.username}`);
      } catch (err) {
        console.error('Deletion failed:', err);
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error || !board) {
    return <div>Error: {error || 'Board not found.'}</div>;
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                  </svg>
                  Edit
                </Button>
                <Button onClick={handleDeleteBoard}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor" />
                  </svg>
                  Delete
                </Button>
              </>
            ) : currentUser && (
              <FollowButton
                following={following}
                onClick={handleFollowToggle}
              >
                {following ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                    </svg>
                    Following
                  </>
                ) : 'Follow'}
              </FollowButton>
            )}

            {isOwner && (
              <Button primary as={Link} to={`/pin/create?boardId=${boardId}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
                </svg>
                Add Pin
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
          <StatItem>{pins.length} Pins</StatItem>
          <StatItem>{followerCount} Followers</StatItem>
        </Stats>
      </BoardHeader>

      {pins.length > 0 ? (
        <PinGrid pins={pins} />
      ) : (
        <EmptyState>
          <EmptyStateTitle>This board has no pins yet</EmptyStateTitle>
          <EmptyStateMessage>
            {isOwner
              ? 'Start adding pins to this board to collect and organize your favorite content!'
              : 'This board is currently empty. Check back later.'}
          </EmptyStateMessage>

          {isOwner && (
            <Button primary as={Link} to={`/pin/create?boardId=${boardId}`}>
              Add First Pin
            </Button>
          )}
        </EmptyState>
      )}

      {/* Follow Stream Modal */}
      <FollowStreamModal
        isOpen={showFollowModal}
        onClose={() => setShowFollowModal(false)}
        boardId={boardId}
        onFollowSuccess={handleFollowSuccess}
      />
    </BoardContainer>
  );
};

export default BoardPage;