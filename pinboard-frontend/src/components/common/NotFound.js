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
        {/* 页面未找到的提示信息 */}
        {/* Message shown when page is not found */}
        Oops! The page you're looking for doesn't exist or has been removed.<br />
        Try using the search function or go back to the homepage.
      </Message>
      {/* 返回首页按钮 */}
      {/* Button to return to homepage */}
      <HomeButton to="/">Go to Homepage</HomeButton>
    </NotFoundContainer>
  );
};

export default NotFound;
