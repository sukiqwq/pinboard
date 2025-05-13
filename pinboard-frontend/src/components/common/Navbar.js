import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e60023;
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
    color: #ad081b;
  }
`;

const SearchBar = styled.div`
  display: flex;
  flex: 1;
  max-width: 800px;
  margin: 0 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 24px;
  border: 2px solid #efefef;
  background-color: #efefef;
  transition: all 0.2s;
  
  &:focus {
    background-color: white;
    border-color: #ddd;
    outline: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  margin-left: 1.5rem;
  color: #111;
  text-decoration: none;
  
  &:hover {
    color: #e60023;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #efefef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  margin-left: 1.5rem;
  
  &:hover {
    background-color: #ddd;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 200px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  z-index: 1000;
`;

const MenuItem = styled(Link)`
  display: block;
  padding: 0.5rem 1rem;
  color: #111;
  text-decoration: none;
  
  &:hover {
    background-color: #f8f8f8;
  }
`;

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <NavContainer>
      <NavContent>
        <Logo to="/">Pinboard</Logo>
        
        <SearchBar>
          <form onSubmit={handleSearch} style={{ width: '100%' }}>
            <SearchInput
              type="text"
              placeholder="搜索标签或用户..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </SearchBar>
        
        <NavLinks>
          <NavLink to="/">首页</NavLink>
          
          {currentUser ? (
            <>
              <NavLink to="/pin/create">创建图钉</NavLink>
              <UserMenu>
                <UserAvatar onClick={toggleDropdown}>
                  {currentUser.username.charAt(0).toUpperCase()}
                </UserAvatar>
                
                {showDropdown && (
                  <DropdownMenu>
                    <MenuItem to={`/user/${currentUser.username}`}>个人主页</MenuItem>
                    <MenuItem to="/profile/edit">编辑资料</MenuItem>
                    <MenuItem to="/board/create">创建面板</MenuItem>
                    <MenuItem to="/friend-requests">好友请求</MenuItem>
                    <MenuItem as="div" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                      退出登录
                    </MenuItem>
                  </DropdownMenu>
                )}
              </UserMenu>
            </>
          ) : (
            <>
              <NavLink to="/login">登录</NavLink>
              <NavLink to="/register">注册</NavLink>
            </>
          )}
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar;