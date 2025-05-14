import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const NavContainer = styled.nav`
  background-color: var(--white);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

export const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Logo = styled(Link)`
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
  
  &:hover {
    color: var(--primary-hover);
    text-decoration: none;
  }
`;

export const SearchBar = styled.div`
  display: flex;
  flex: 1;
  max-width: 800px;
  margin: 0 var(--spacing-md);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: 24px;
  border: 2px solid var(--light-gray);
  background-color: var(--light-gray);
  transition: all var(--transition-fast);
  
  &:focus {
    background-color: var(--white);
    border-color: var(--light-gray);
    outline: none;
  }
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

export const NavLink = styled(Link)`
  margin-left: var(--spacing-lg);
  color: var(--black);
  text-decoration: none;
  
  &:hover {
    color: var(--primary-color);
  }
`;

export const UserMenu = styled.div`
  position: relative;
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-circle);
  background-color: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  margin-left: var(--spacing-lg);
  
  &:hover {
    background-color: var(--medium-gray);
    color: var(--white);
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  width: 200px;
  padding: var(--spacing-xs) 0;
  margin-top: var(--spacing-xs);
  z-index: 1000;
`;

export const MenuItem = styled(Link)`
  display: block;
  padding: var(--spacing-xs) var(--spacing-md);
  color: var(--black);
  text-decoration: none;
  
  &:hover {
    background-color: var(--light-gray);
  }
`;

export const MenuButton = styled.div`
  display: block;
  padding: var(--spacing-xs) var(--spacing-md);
  color: var(--black);
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    background-color: var(--light-gray);
  }
`;