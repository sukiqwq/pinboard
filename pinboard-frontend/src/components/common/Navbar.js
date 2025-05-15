import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBoards } from '../../context/BoardContext';

// Import styled components
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
  MenuButton,
  SubMenuContainer,
  SubMenu
} from './Navbar.styles';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { boards: userBoards, loading: boardsLoading } = useBoards();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // For touch devices - toggle submenu visibility
  const handleSubmenuToggle = (e) => {
    // Only for touch devices
    if (window.matchMedia('(hover: none)').matches) {
      e.preventDefault();
      e.stopPropagation();
      
      const parent = e.currentTarget.parentNode;
      parent.classList.toggle('active');
    }
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
              <NavLink to="/follow-streams">My Streams</NavLink> {/* Add new link */}
              
              <UserMenu ref={dropdownRef}>
                <UserAvatar onClick={toggleDropdown}>
                  {currentUser.username.charAt(0).toUpperCase()}
                </UserAvatar>
                
                {showDropdown && (
                  <DropdownMenu>
                    <MenuItem to={`/user/${currentUser.username}`}>Profile</MenuItem>
                    <MenuItem to="/profile/edit">Edit Profile</MenuItem>
                    
                    {/* My Boards with submenu */}
                    <SubMenuContainer className="has-submenu">
                      <MenuItem 
                        as="div" 
                        onClick={handleSubmenuToggle}
                      >
                        My Boards
                        <span className="submenu-arrow">›</span>
                        <div className="submenu-gap"></div>
                      </MenuItem>
                      
                      <SubMenu className="submenu boards-submenu">
                        <MenuItem to="/board/create" className="create-board-option">
                          <span className="plus-icon">+</span> Create New Board
                        </MenuItem>
                        
                        {!boardsLoading && userBoards.length > 0 ? (
                          <>
                            <div className="board-divider"></div>
                            <p className="boards-section-title">Your Boards</p>
                            
                            {userBoards.map(board => (
                              <MenuItem 
                                key={board.board_id} 
                                to={`/board/${board.board_id}`}
                                onClick={() => setShowDropdown(false)}
                              >
                                {board.board_name}
                              </MenuItem>
                            ))}
                          </>
                        ) : (
                          <p style={{ padding: '8px 16px', color: '#888', fontSize: '13px' }}>
                            {boardsLoading ? 'Loading...' : 'No boards yet'}
                          </p>
                        )}
                      </SubMenu>
                    </SubMenuContainer>
                    
                    <MenuItem to="/friend-requests">Friend Requests</MenuItem>
                    <MenuItem to="/follow-streams">Follow Streams</MenuItem> {/* Add menu item */}
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