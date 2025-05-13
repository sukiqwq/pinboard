import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { likePin, unlikePin } from '../../services/pinService';

const PinContainer = styled.div`
  margin-bottom: 16px;
  break-inside: avoid;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
    
    .pin-actions {
      opacity: 1;
    }
  }
`;

const PinImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  cursor: pointer;
`;

const PinOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.5));
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  
  ${PinContainer}:hover & {
    opacity: 1;
  }
`;

const PinActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const PinButton = styled.button`
  background-color: ${props => props.primary ? '#e60023' : 'white'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.primary ? '#ad081b' : '#f0f0f0'};
  }
  
  svg {
    margin-right: 0.25rem;
  }
`;

const PinLikeButton = styled(PinButton)`
  background-color: ${props => props.liked ? '#e60023' : 'white'};
  color: ${props => props.liked ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props.liked ? '#ad081b' : '#f0f0f0'};
  }
`;

const PinDetails = styled.div`
  color: white;
  margin-bottom: 0.5rem;
`;

const PinTitle = styled.h3`
  font-size: 1rem;
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const PinUser = styled.p`
  font-size: 0.8rem;
  margin: 0.25rem 0;
`;

const PinItem = ({ pin }) => {
  const { currentUser } = useAuth();
  const [liked, setLiked] = useState(pin.liked || false);
  const [likeCount, setLikeCount] = useState(pin.like_count || 0);
  
  const handleLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      // 如果用户未登录，可以重定向到登录页
      return;
    }
    
    try {
      if (liked) {
        await unlikePin(pin.pin_id);
        setLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        await likePin(pin.pin_id);
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('操作失败:', error);
    }
  };
  
  return (
    <PinContainer>
      <Link to={`/pin/${pin.pin_id}`}>
        <PinImage 
          src={pin.picture.url}
          alt={pin.picture.tags || '图钉'}
          loading="lazy"
        />
        
        <PinOverlay>
          <PinDetails>
            <PinTitle>{pin.picture.tags ? pin.picture.tags.split(',')[0] : '无标题'}</PinTitle>
            <PinUser>由 {pin.user.username} 钉入</PinUser>
          </PinDetails>
          
          <PinActions>
            <PinLikeButton 
              liked={liked} 
              onClick={handleLikeToggle}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={liked ? "currentColor" : "none"} stroke="currentColor" />
              </svg>
              {likeCount > 0 && likeCount}
            </PinLikeButton>
            
            {currentUser && (
              <PinButton primary>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor" />
                </svg>
                保存
              </PinButton>
            )}
          </PinActions>
        </PinOverlay>
      </Link>
    </PinContainer>
  );
};

export default PinItem;