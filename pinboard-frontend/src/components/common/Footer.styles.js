import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const FooterContainer = styled.footer`
  background-color: var(--white);
  padding: var(--spacing-xl) 0;
  border-top: 1px solid var(--light-gray);
  margin-top: var(--spacing-xxl);
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ColumnTitle = styled.h3`
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
`;

export const FooterLink = styled(Link)`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
  text-decoration: none;
  font-size: var(--font-size-sm);
  
  &:hover {
    color: var(--primary-color);
  }
`;

export const ExternalLink = styled.a`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
  text-decoration: none;
  font-size: var(--font-size-sm);
  
  &:hover {
    color: var(--primary-color);
  }
`;

export const Copyright = styled.div`
  text-align: center;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--light-gray);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
`;