import React from 'react';
import {
  NotFoundContainer,
  Title,
  Message,
  HomeButton
} from './NotFound.styles';

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