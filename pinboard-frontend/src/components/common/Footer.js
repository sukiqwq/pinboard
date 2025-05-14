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
          <ColumnTitle>About</ColumnTitle>
          <FooterLink to="/about">About Pinboard</FooterLink>
        </Column>
        
        <Column>
          <ColumnTitle>Discover</ColumnTitle>
          <FooterLink to="/">Home</FooterLink>
        </Column>
        
        <Column>
          <ColumnTitle>Help</ColumnTitle>
          <FooterLink to="/contact">Contact Us</FooterLink>
        </Column>
        
        <Column>
          <ColumnTitle>Community</ColumnTitle>
          <ExternalLink href="https://github.com/sukiqwq/pinboard" target="_blank" rel="noopener noreferrer">GitHub</ExternalLink>
        </Column>
      </FooterContent>
      
      <Copyright>
        © {currentYear} Pinboard - Database Course Project | All rights reserved
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;