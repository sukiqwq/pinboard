import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl) var(--spacing-xl);
  text-align: center;
`;

export const Title = styled.h1`
  font-size: var(--font-size-xxl);
  margin-bottom: var(--spacing-md);
  color: var(--primary-color);
`;

export const Message = styled.p`
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
`;

export const HomeButton = styled(Link)`
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 24px;
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-md);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  text-decoration: none;
  
  &:hover {
    background-color: var(--primary-hover);
  }
`;