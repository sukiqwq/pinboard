// src/components/user/ProfilePage.styles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
`;

export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

export const AvatarContainer = styled.div`
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    margin-right: 2rem;
    margin-bottom: 0;
  }
`;

export const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  color: #666;
`;

export const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  
  @media (min-width: 768px) {
    text-align: left;
  }
`;

export const Username = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

export const Bio = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

export const Stats = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
  
  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

export const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

export const ActionButton = styled.button`
  background-color: ${props => props.$primary ? '#e60023' : '#f0f0f0'};
  color: ${props => props.$primary ? 'white' : '#333'};
  border: none;
  border-radius: 24px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: center;
  
  &:hover {
    background-color: ${props => props.$primary ? '#ad081b' : '#ddd'};
  }
  
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
  
  @media (min-width: 768px) {
    align-self: flex-start;
  }
`;

export const Tab = styled.button`
  min-width: 100px;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.$active ? '#e60023' : 'transparent'};
  color: ${props => props.$active ? '#e60023' : '#666'};
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #e60023;
  }
`;

export const BoardCard = styled(Link)`
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

export const BoardThumbnail = styled.div`
  height: 150px;
  background-color: #f5f5f5;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const BoardInfo = styled.div`
  padding: 1rem;
`;

export const BoardName = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const BoardStats = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

export const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

export const EmptyStateMessage = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

export const ErrorContainer = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 1rem;
`;

export const ErrorTitle = styled.h2`
  color: #e60023;
  margin-bottom: 1rem;
`;

export const ErrorText = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;
// ProfilePage.styles.js - 更新和新增以下组件

// 修改TabsContainer，确保标签居中对齐
export const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 1200px; // 与整体容器同宽
  margin-left: auto;
  margin-right: auto;
`;

// 新增一个统一的内容容器样式
export const TabContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center; // 确保内容居中
`;

// 修改BoardsGrid样式，让它填充整个可用空间
export const BoardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px; // 设置与容器相同的最大宽度
`;

// 修改PinGridWrapper也使用相同的布局约束
export const PinGridWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  padding-right: 16px; // 补偿PinGrid的负边距
  box-sizing: border-box;
`;