import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Main Container
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md);
`;

export const PinWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  
  @media (min-width: 768px) {
    flex-direction: row;
    min-height: 70vh;
  }
`;

// Image Section
export const ImageSection = styled.div`
  flex: 3;
  background-color: var(--background-light);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
`;

export const BackButton = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: white;
  }
`;

// Content Section
export const ContentSection = styled.div`
  flex: 2;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 767px) {
    max-width: 100%;
  }
`;

export const PinHeader = styled.div`
  border-bottom: 1px solid var(--light-gray);
  padding: var(--spacing-lg);
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

export const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  color: var(--dark-gray);
`;

export const Username = styled(Link)`
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const PinActions = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

export const ActionButton = styled.button`
  background-color: var(--light-gray);
  color: var(--text-primary);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--medium-gray);
    color: var(--white);
  }
  
  ${props => props.primary && `
    background-color: var(--primary-color);
    color: white;
    
    &:hover {
      background-color: var(--primary-hover);
    }
  `}
  
  ${props => props.liked && `
    background-color: var(--primary-color);
    color: white;
    
    &:hover {
      background-color: var(--primary-hover);
    }
  `}
`;

// Pin Content
export const PinContent = styled.div`
  padding: var(--spacing-lg);
`;

export const PinTitle = styled.h1`
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
`;

export const PinDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
`;

export const Tag = styled.span`
  background-color: var(--light-gray);
  color: var(--text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 16px;
  font-size: var(--font-size-sm);
`;

export const StatsRow = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
`;

export const SourceInfo = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--light-gray);
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Comments Section
export const CommentsSection = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--light-gray);
`;

export const CommentsTitle = styled.h2`
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
`;

export const CommentsList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: var(--spacing-md);
`;

export const Comment = styled.div`
  display: flex;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-sm);
`;

export const CommentAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
`;

export const CommentContent = styled.div`
  flex-grow: 1;
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2px;
`;

export const CommentUsername = styled.span`
  font-weight: 600;
  font-size: var(--font-size-sm);
`;

export const CommentTime = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
`;

export const CommentText = styled.p`
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  line-height: 1.4;
`;

export const NoComments = styled.div`
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--text-secondary);
`;

export const CommentForm = styled.form`
  display: flex;
  gap: var(--spacing-sm);
  margin-top: auto;
  border-top: 1px solid var(--light-gray);
  padding-top: var(--spacing-md);
`;

export const CommentInput = styled.input`
  flex-grow: 1;
  border: 1px solid var(--light-gray);
  border-radius: 24px;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-md);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

export const CommentButton = styled.button`
  background-color: ${props => props.disabled ? 'var(--light-gray)' : 'var(--primary-color)'};
  color: ${props => props.disabled ? 'var(--medium-gray)' : 'white'};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background-color: ${props => props.disabled ? 'var(--light-gray)' : 'var(--primary-hover)'};
  }
`;

// Loading and Error States
export const ErrorContainer = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
`;

export const ErrorTitle = styled.h2`
  font-size: var(--font-size-xl);
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
`;

export const ErrorMessage = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
`;

export const ReturnButton = styled.button`
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 24px;
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-md);
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-hover);
  }
`;