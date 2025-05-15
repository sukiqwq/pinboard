import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, getCurrentUserProfile } from '../../services/userService';
import { getBoards } from '../../services/boardService';
import { getUserPins } from '../../services/pinService';
import { sendFriendRequest, checkFriendshipStatus } from '../../services/socialService';
import Spinner from '../common/Spinner';
import PinGrid from '../pin/PinGrid';
import BoardCard from '../board/BoardCard';
import CreateBoardButton from '../board/CreateBoardButton';
// Import styles from separate file
import {
  ProfileContainer,
  ContentWrapper,
  ProfileHeader,
  AvatarContainer,
  Avatar,
  ProfileInfo,
  Username,
  Bio,
  Stats,
  StatItem,
  StatValue,
  StatLabel,
  ActionButton,
  TabsContainer,
  TabContent,
  Tab,
  BoardsGrid,
  PinGridWrapper,
  EmptyState,
  EmptyStateTitle,
  EmptyStateMessage,
  ErrorContainer,
  ErrorTitle,
  ErrorText
} from './ProfilePage.styles';

const ProfilePage = () => {
  const { username } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [boards, setBoards] = useState([]);
  const [pins, setPins] = useState([]);
  const [activeTab, setActiveTab] = useState('boards');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [pinsLoaded, setPinsLoaded] = useState(false);
  
  useEffect(() => {
    fetchProfileData();
  }, [username, currentUser]);
  
  useEffect(() => {
    if (profile && currentUser) {
      const profileUserId = profile.user_id || profile.id;
      const currentUserId = currentUser.user_id || currentUser.id;
      setIsOwnProfile(
        currentUser.username === username && 
        currentUserId === profileUserId
      );
    } else {
      setIsOwnProfile(false);
    }
  }, [profile, currentUser, username]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let profileResponse;
      
      if (currentUser && username === currentUser.username) {
        profileResponse = await getCurrentUserProfile();
      } else {
        try {
          profileResponse = await getUserProfile(username);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setError(`User "${username}" does not exist`);
          } else {
            setError(`Unable to view user "${username}" profile`);
          }
          setLoading(false);
          return;
        }
      }
      
      setProfile(profileResponse.data);
      
      const userId = profileResponse.data.user_id || profileResponse.data.id;
      
      try {
        const boardsResponse = await getBoards(userId);
        setBoards(boardsResponse.data);
      } catch (err) {
        console.error('Failed to fetch boards:', err);
        setBoards([]);
      }
      
      try {
        const pinsResponse = await getUserPins(userId);
        setPins(Array.isArray(pinsResponse.data) ? pinsResponse.data : []);
        setPinsLoaded(true);
      } catch (err) {
        console.error('Failed to fetch pins:', err);
        setPins([]);
      }
      
      if (currentUser && currentUser.username !== username) {
        try {
          const statusResponse = await checkFriendshipStatus(userId);
          setFriendshipStatus(statusResponse.data.status);
        } catch (err) {
          console.error('Failed to check friendship status:', err);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      
      if (err.response) {
        if (err.response.status === 404) {
          setError(`User "${username}" does not exist`);
        } else if (err.response.status === 403) {
          setError("You don't have permission to view this profile");
        } else {
          setError('Failed to load user profile. Please try again later.');
        }
      } else {
        setError('Failed to connect to server. Please check your network connection.');
      }
      
      setLoading(false);
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    if (tab === 'pins' && !pinsLoaded && profile) {
      const userId = profile.user_id || profile.id;
      
      const loadPins = async () => {
        try {
          const pinsResponse = await getUserPins(userId);
          setPins(Array.isArray(pinsResponse.data) ? pinsResponse.data : []);
          setPinsLoaded(true);
        } catch (err) {
          console.error('Failed to fetch pins after tab switch:', err);
          setPins([]);
        }
      };
      
      loadPins();
    }
  };
  
  const handleSendFriendRequest = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      await sendFriendRequest(profile.user_id || profile.id);
      setFriendshipStatus('pending');
      setFriendRequestSent(true);
    } catch (err) {
      console.error('Failed to send friend request:', err);
    }
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Spinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorContainer>
        <ErrorTitle>Error</ErrorTitle>
        <ErrorText>{error}</ErrorText>
        <ActionButton onClick={() => navigate(-1)}>
          Go Back
        </ActionButton>
      </ErrorContainer>
    );
  }
  
  if (!profile) {
    return (
      <ErrorContainer>
        <ErrorTitle>User Not Found</ErrorTitle>
        <ActionButton onClick={() => navigate('/')}>
          Return to Home
        </ActionButton>
      </ErrorContainer>
    );
  }
  
  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarContainer>
          <Avatar>{profile.username.charAt(0).toUpperCase()}</Avatar>
        </AvatarContainer>
        
        <ProfileInfo>
          <Username>{profile.username}</Username>
          
          {profile.profile_info && (
            <Bio>{profile.profile_info}</Bio>
          )}
          
          <Stats>
            <StatItem>
              <StatValue>{boards.length}</StatValue>
              <StatLabel>Boards</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{pins.length || profile.pin_count || 0}</StatValue>
              <StatLabel>Pins</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{profile.friend_count || 0}</StatValue>
              <StatLabel>Friends</StatLabel>
            </StatItem>
          </Stats>
          
          {isOwnProfile ? (
            <ActionButton as={Link} to="/profile/edit">Edit Profile</ActionButton>
          ) : currentUser ? (
            <>
              {friendshipStatus === 'friends' && (
                <ActionButton disabled>Friends</ActionButton>
              )}
              {friendshipStatus === 'pending' && (
                <ActionButton disabled>
                  {friendRequestSent ? 'Request Sent' : 'Awaiting Acceptance'}
                </ActionButton>
              )}
              {(!friendshipStatus || friendshipStatus === 'none') && (
                <ActionButton $primary onClick={handleSendFriendRequest}>
                  Add Friend
                </ActionButton>
              )}
            </>
          ) : null}
        </ProfileInfo>
      </ProfileHeader>
      
      <ContentWrapper>
        <TabsContainer>
          <Tab 
            $active={activeTab === 'boards'} 
            onClick={() => handleTabChange('boards')}
          >
            Boards
          </Tab>
          <Tab 
            $active={activeTab === 'pins'} 
            onClick={() => handleTabChange('pins')}
          >
            Pins
          </Tab>
        </TabsContainer>
        
        {activeTab === 'boards' && (
          <TabContent>
            {boards.length > 0 ? (
              <BoardsGrid>
                {boards.map(board => (
                  <BoardCard key={board.board_id} board={board} />
                ))}
                
                {isOwnProfile && (
                  <CreateBoardButton to="/board/create" />
                )}
              </BoardsGrid>
            ) : (
              <EmptyState>
                <EmptyStateTitle>
                  {isOwnProfile 
                    ? "You haven't created any boards yet" 
                    : `${profile.username} hasn't created any boards yet`}
                </EmptyStateTitle>
                <EmptyStateMessage>
                  {isOwnProfile 
                    ? "Boards are where you organize and save pins. Create boards for your different interests and start collecting inspiration!" 
                    : "When boards are created, they will appear here."}
                </EmptyStateMessage>
                
                {isOwnProfile && (
                  <ActionButton $primary as={Link} to="/board/create">
                    Create Your First Board
                  </ActionButton>
                )}
              </EmptyState>
            )}
          </TabContent>
        )}
        
        {activeTab === 'pins' && (
          <TabContent>
            {pins.length > 0 ? (
              <PinGridWrapper>
                <PinGrid pins={pins} />
              </PinGridWrapper>
            ) : (
              <EmptyState>
                <EmptyStateTitle>
                  {isOwnProfile 
                    ? "You haven't saved any pins yet" 
                    : `${profile.username} hasn't saved any pins yet`}
                </EmptyStateTitle>
                <EmptyStateMessage>
                  {isOwnProfile 
                    ? "Save pins you like and start building your collection!" 
                    : "When pins are saved, they will appear here."}
                </EmptyStateMessage>
                
                {isOwnProfile && (
                  <ActionButton $primary as={Link} to="/">
                    Browse Pins
                  </ActionButton>
                )}
              </EmptyState>
            )}
          </TabContent>
        )}
      </ContentWrapper>
    </ProfileContainer>
  );
};

export default ProfilePage;