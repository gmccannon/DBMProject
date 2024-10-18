// src/Components/TopBar.tsx
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from './AuthContext';

const TopBarContainer = styled.div`
  display: flex; // Use flexbox for layout
  align-items: center; // Center items vertically
  background-color: white;
  padding: 1rem 2rem; // Padding for spacing
  height: 5rem; // Set a consistent height
  position: relative; // Enable positioning for child elements
`;

const ButtonContainer = styled.div`
  display: flex; // Use flexbox for buttons
  justify-content: center; // Center navigation buttons
  position: absolute; // Positioning absolutely within the parent
  left: 50%; // Move to the center
  transform: translateX(-50%); // Offset by half its width to truly center it
  gap: 1.25rem; // Space between buttons
`;

const Button = styled.button`
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.875rem; // Font size set in rem (30px converted)
  font-weight: 600;
  padding: 0.625rem 1.25rem; // Padding for button size
  background-color: transparent; // Transparent background
  border: none; // Remove default border
  cursor: pointer;
  outline: none; // Remove focus outline
  transition: color 0.3s, text-decoration-color 0.3s; // Smooth transition for color and underline
`;

const ProfileButton = styled(Button)`
  margin-left: auto; // Push the profile/login button to the right
`;

// helper function for the button label
const getButtonLabel = (path: string): string => {
  switch (path) {
    case '/Shows':
      return 'shows';
    case '/Movies':
      return 'movies';
    case '/Books':
      return 'books';
    case '/Games':
      return 'games';
    default:
      return path;
  }
};

const TopBar: React.FC = () => {
  // paths for media
  const paths: string[] = ['/Shows', '/Movies', '/Books', '/Games'];

  // use navigation method from react router
  const navigate = useNavigate();

  // method to get current URL from react router, and decide the active tab
  // this is not used for navigation, this is simply used to decide which topbar button to highlight
  const location = useLocation();
  const activetab: string = location.pathname;

  // grab info for the current user from AuthContext component
  const { isAuthenticated, username } = useContext(AuthContext);

  // function to navigate to the specific media page
  const handleNavigate = (page: string): void => {
    navigate(page);
  };

  // function to navigate to the login page
  const handleLoginClick = (): void => {
    navigate('/login');
  };

  // function to navigate to profile page
  const handleProfileClick = (): void => {
    navigate('/profile');
  };

  return (
    <TopBarContainer>
      {/* All buttons in a single container */}
      <ButtonContainer>
        {paths.map((path: string, index: number) => (
          <Button
            key={index}
            onClick={() => handleNavigate(path)}
            style={{
              textDecoration: activetab === path ? 'underline' : 'none',
              textDecorationColor: activetab === path ? 'rgb(173, 216, 230)' : 'none', // Light blue underline for active tab
            }}
          >
            {getButtonLabel(path)}
          </Button>
        ))}
      </ButtonContainer>

      {/* Profile/Login button on the right */}
      <ProfileButton
        onClick={isAuthenticated && username ? handleProfileClick : handleLoginClick}
        style={{
          textDecoration: activetab === (isAuthenticated && username ? '/profile' : '/login') ? 'underline' : 'none',
          textDecorationColor: activetab === (isAuthenticated && username ? '/profile' : '/login') ? 'rgb(173, 216, 230)' : 'none', // Light blue underline for active tab
        }}
      >
        {isAuthenticated && username ? username : 'login'}
      </ProfileButton>
    </TopBarContainer>
  );
};

export default TopBar;
