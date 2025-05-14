import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  NavContainer,
  NavContent,
  Logo,
  SearchBar,
  SearchInput,
  NavLinks,
  NavLink,
  UserMenu,
  UserAvatar,
  DropdownMenu,
  MenuItem,
  MenuButton
} from './Navbar.styles';

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
              placeholder="Search tags or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </SearchBar>
        
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          
          {currentUser ? (
            <>
              <NavLink to="/pin/create">Create Pin</NavLink>
              <UserMenu>
                <UserAvatar onClick={toggleDropdown}>
                  {currentUser.username.charAt(0).toUpperCase()}
                </UserAvatar>
                
                {showDropdown && (
                  <DropdownMenu>
                    <MenuItem to={`/user/${currentUser.username}`}>Profile</MenuItem>
                    <MenuItem to="/profile/edit">Edit Profile</MenuItem>
                    <MenuItem to="/board/create">Create Board</MenuItem>
                    <MenuItem to="/friend-requests">Friend Requests</MenuItem>
                    <MenuButton onClick={handleLogout}>
                      Log Out
                    </MenuButton>
                  </DropdownMenu>
                )}
              </UserMenu>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar;