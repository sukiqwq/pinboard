import styled from 'styled-components';

export const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md);
`;

export const HomeHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

export const HomeTitle = styled.h1`
  font-size: var(--font-size-xxl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
`;

export const HomeSubtitle = styled.p`
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

export const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
`;

export const CategoryButton = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--white)'};
  color: ${props => props.active ? 'var(--white)' : 'var(--text-primary)'};
  border: 2px solid var(--light-gray);
  border-radius: 24px;
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-hover)' : 'var(--light-gray)'};
  }
`;

export const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
`;

export const EndMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  font-weight: 500;
`;