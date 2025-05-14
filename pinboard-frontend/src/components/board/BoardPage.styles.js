import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const BoardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const BoardHeader = styled.div`
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-xl);
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
`;

export const BoardTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

export const Title = styled.h1`
  font-size: var(--font-size-xxl);
  margin: 0;
`;

export const Description = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-circle);
  background-color: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  font-weight: bold;
  margin-right: var(--spacing-md);
`;

export const Username = styled(Link)`
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
`;

export const Button = styled.button`
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'var(--light-gray)'};
  color: ${props => props.primary ? 'var(--white)' : 'var(--text-primary)'};
  border: none;
  border-radius: 24px;
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-hover)' : 'var(--medium-gray)'};
  }
  
  &:disabled {
    background-color: var(--light-gray);
    cursor: not-allowed;
  }
  
  svg {
    margin-right: var(--spacing-xs);
  }
`;

export const FollowButton = styled(Button)`
  background-color: ${props => props.following ? 'var(--primary-color)' : 'var(--light-gray)'};
  color: ${props => props.following ? 'var(--white)' : 'var(--text-primary)'};
  
  &:hover {
    background-color: ${props => props.following ? 'var(--primary-hover)' : 'var(--medium-gray)'};
  }
`;

export const Stats = styled.div`
  display: flex;
  gap: var(--spacing-lg);
`;

export const StatItem = styled.div`
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
`;

export const EmptyState = styled.div`
  padding: var(--spacing-xxl);
  text-align: center;
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
`;

export const EmptyStateTitle = styled.h3`
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
`;

export const EmptyStateMessage = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
`;