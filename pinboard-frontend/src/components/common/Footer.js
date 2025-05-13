import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: white;
  padding: 2rem 0;
  border-top: 1px solid #eee;
  margin-top: 3rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const FooterLink = styled(Link)`
  color: #666;
  margin-bottom: 0.5rem;
  text-decoration: none;
  font-size: 0.9rem;
  
  &:hover {
    color: #e60023;
  }
`;

const ExternalLink = styled.a`
  color: #666;
  margin-bottom: 0.5rem;
  text-decoration: none;
  font-size: 0.9rem;
  
  &:hover {
    color: #e60023;
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  color: #999;
  font-size: 0.8rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <Column>
          <ColumnTitle>关于我们</ColumnTitle>
          <FooterLink to="/about">关于 Pinboard</FooterLink>
          <FooterLink to="/team">团队介绍</FooterLink>
          <FooterLink to="/careers">加入我们</FooterLink>
          <FooterLink to="/blog">官方博客</FooterLink>
        </Column>
        
        <Column>
          <ColumnTitle>发现</ColumnTitle>
          <FooterLink to="/categories">内容分类</FooterLink>
          <FooterLink to="/popular">热门内容</FooterLink>
          <FooterLink to="/trending">趋势</FooterLink>
          <FooterLink to="/collections">精选集</FooterLink>
        </Column>
        
        <Column>
          <ColumnTitle>帮助</ColumnTitle>
          <FooterLink to="/help">帮助中心</FooterLink>
          <FooterLink to="/faq">常见问题</FooterLink>
          <FooterLink to="/contact">联系我们</FooterLink>
          <FooterLink to="/feedback">意见反馈</FooterLink>
        </Column>
        
        <Column>
          <ColumnTitle>社区</ColumnTitle>
          <ExternalLink href="https://weibo.com" target="_blank" rel="noopener noreferrer">新浪微博</ExternalLink>
          <ExternalLink href="https://wx.qq.com" target="_blank" rel="noopener noreferrer">微信公众号</ExternalLink>
          <ExternalLink href="https://www.zhihu.com" target="_blank" rel="noopener noreferrer">知乎</ExternalLink>
          <ExternalLink href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</ExternalLink>
        </Column>
      </FooterContent>
      
      <Copyright>
        © {currentYear} Pinboard 图钉分享平台 - 数据库课程项目 | 保留所有权利
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;