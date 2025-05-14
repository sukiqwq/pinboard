import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const PinDetailContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-md);
`;

export const PinCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  
  @media (min-width: 768px) {
    flex-direction: row;
    min-height: 500px;
  }
`;

export const ImageContainer = styled.div`
  flex: 1;
  background-color: var(--background-light);
  
  @media (min-width: 768px) {
    flex: 3;
  }
`;

export const PinImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

export const ContentContainer = styled.div`
  flex: 1;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex: 2;
    max-width: 400px;
  }
`;

export const PinActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--spacing-md);
`;

export const ActionButton = styled.button`
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'var(--light-gray)'};
  color: ${props => props.primary ? 'var(--white)' : 'var(--text-primary)'};
  border: none;
  border-radius: var(--border-radius-circle);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: var(--spacing-xs);
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-hover)' : 'var(--medium-gray)'};
    color: ${props => props.primary ? 'var(--white)' : 'var(--white)'};
  }
`;

export const SaveButton = styled.button`
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 24px;
  padding: var(--spacing-xs) var(--spacing-lg);
  font-size: var(--font-size-md);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--primary-hover);
  }
  
  &:disabled {
    background-color: var(--light-gray);
    cursor: not-allowed;
  }
`;

export const DescriptionText = styled.p`
  color: var(--text-primary);
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-md);
  line-height: 1.5;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
`;

export const Tag = styled(Link)`
  background-color: var(--light-gray);
  color: var(--text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 16px;
  font-size: var(--font-size-sm);
  text-decoration: none;
  
  &:hover {
    background-color: var(--medium-gray);
    color: var(--white);
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--light-gray);
`;

export const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-circle);
  background-color: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: var(--spacing-sm);
`;

export const UserName = styled(Link)`
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const UserBio = styled.p`
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
`;

export const FollowButton = styled.button`
  background-color: transparent;
  color: var(--primary-color);
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-left: auto;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const RelatedPinsSection = styled.div`
  margin-top: var(--spacing-xl);
`;

export const SectionTitle = styled.h2`
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

export const ErrorContainer = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--primary-color);
`;

export const CommentSection = styled.div`
  margin-top: var(--spacing-lg);
`;

export const CommentForm = styled.form`
  display: flex;
  margin-bottom: var(--spacing-md);
`;

export const CommentInput = styled.input`
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--light-gray);
  border-radius: 24px;
  font-size: var(--font-size-md);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

export const CommentButton = styled.button`
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 24px;
  padding: var(--spacing-xs) var(--spacing-md);
  margin-left: var(--spacing-xs);
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-hover);
  }
`;

export const CommentList = styled.div`
  margin-top: var(--spacing-md);
`;

export const Comment = styled.div`
  display: flex;
  margin-bottom: var(--spacing-md);
`;

export const CommentContent = styled.div`
  margin-left: var(--spacing-sm);
`;

export const CommentUser = styled.span`
  font-weight: 600;
`;

export const CommentText = styled.p`
  margin: var(--spacing-xs) 0;
`;

export const CommentTime = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
`;