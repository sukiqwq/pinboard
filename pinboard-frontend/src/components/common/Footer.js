import React from 'react';
import {
  FooterContainer,
  FooterContent,
  Column,
  ColumnTitle,
  FooterLink,
  ExternalLink,
  Copyright
} from './Footer.styles';

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