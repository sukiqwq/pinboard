import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #e60023;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const HomeButton = styled(Link)`
  background-color: #e60023;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  
  &:hover {
    background-color: #ad081b;
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Message>
        哎呀！您要找的页面不存在或已被移除。<br />
        请尝试使用搜索功能或返回首页。
      </Message>
      <HomeButton to="/">返回首页</HomeButton>
    </NotFoundContainer>
  );
};

export default NotFound;