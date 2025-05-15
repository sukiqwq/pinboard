import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

export const ContentWrapper = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1.5rem;
`;

export const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#e60023' : 'transparent'};
  color: ${props => props.active ? '#e60023' : '#666'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #e60023;
  }
`;

export const RequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const RequestCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: transform 0.2s;
  width: 100%;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 1rem;
`;

export const UserInfo = styled.div`
  flex: 1;
`;

export const Username = styled(Link)`
  font-weight: 600;
  color: #333;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const RequestTime = styled.div`
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.25rem;
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ActionButton = styled.button`
  background-color: ${props => props.accept ? '#e60023' : '#f0f0f0'};
  color: ${props => props.accept ? 'white' : '#333'};
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.accept ? '#ad081b' : '#ddd'};
  }
  
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
`;

export const EmptyMessage = styled.p`
  color: #666;
  margin-bottom: 0;
`;