import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getFriends } from '../../services/socialService';
import { useAuth } from '../../context/AuthContext';

// Styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  width: 90%;
  max-width: 500px;
  padding: var(--spacing-lg);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const ModalTitle = styled.h2`
  font-size: var(--font-size-lg);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const FriendsList = styled.div`
  overflow-y: auto;
  flex-grow: 1;
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--light-gray);
  
  &:last-child {
    border-bottom: none;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: var(--spacing-md);
`;

const FriendInfo = styled.div`
  flex-grow: 1;
`;

const Username = styled(Link)`
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  display: block;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FriendBio = styled.p`
  margin: var(--spacing-xs) 0 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
`;

const Spinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  
  &:after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid var(--light-gray);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const FriendsModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth(); // 获取当前用户信息
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!isOpen || !currentUser) return;
    
    const fetchFriends = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 传递当前用户ID到getFriends函数
        const userId = currentUser.user_id || currentUser.id;
        const response = await getFriends(userId);
        setFriends(response.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch friends:', err);
        setError('Failed to load your friends. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchFriends();
  }, [isOpen, currentUser]);
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>My Friends</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        {loading ? (
          <Spinner />
        ) : error ? (
          <EmptyState>{error}</EmptyState>
        ) : friends.length > 0 ? (
          <FriendsList>
            {friends.map(friend => (
              <FriendItem key={friend.id}>
                <Avatar>{friend.username.charAt(0).toUpperCase()}</Avatar>
                <FriendInfo>
                  <Username 
                    to={`/user/${friend.username}`} 
                    onClick={onClose} // Close modal when navigating to friend's profile
                  >
                    {friend.username}
                  </Username>
                  {friend.profile_info && (
                    <FriendBio>{friend.profile_info}</FriendBio>
                  )}
                </FriendInfo>
              </FriendItem>
            ))}
          </FriendsList>
        ) : (
          <EmptyState>
            You don't have any friends yet. Try adding some friends!
          </EmptyState>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default FriendsModal;