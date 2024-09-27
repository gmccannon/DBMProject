// src/Components/TopBar.tsx
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Adjust the path based on your structure

// Define the type for the styles object
const styles: { [key: string]: React.CSSProperties } = {
  topBar: {
    display: 'flex',
    justifyContent: 'center', // Center the navigation buttons
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '30px 0 0 0',
    position: 'relative', // To position the login/logout button absolutely within this container
    height: '80px', // Optional: Define a fixed height for consistent layout
  },
  navButtons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontFamily: 'Courier New',
    fontSize: '30px', // Large font for navigation buttons
    fontWeight: 600,
    margin: '0 10px', // Space between buttons
    padding: '10px 20px', // Padding inside buttons
    backgroundColor: 'transparent', // Transparent background
    border: 'none', // Remove default border
    cursor: 'pointer',
    outline: 'none', // Remove focus outline
    transition: 'color 0.3s, text-decoration-color 0.3s', // Smooth transition for color and underline
  },
  loginButton: {
    position: 'absolute', // Position the login button absolutely within the topBar
    top: '30px', // Align with the top padding of the topBar
    right: '20px', // 20px from the right edge
    fontFamily: 'Courier New',
    fontSize: '20px', // Smaller font size for the login button
    fontWeight: 600,
    padding: '5px 10px', // Smaller padding to make the button smaller
    backgroundColor: 'transparent',
    border: '2px solid #ADD8E6', // Light blue border to make it stand out
    borderRadius: '5px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.3s, color 0.3s', // Smooth transition for hover effects
    color: '#ADD8E6', // Initial text color matching the border
  },
  userInfo: {
    position: 'absolute',
    top: '30px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userEmail: {
    fontFamily: 'Courier New',
    fontSize: '20px',
    fontWeight: 600,
    color: '#333',
  },
  logoutButton: {
    fontFamily: 'Courier New',
    fontSize: '16px',
    fontWeight: 600,
    padding: '5px 10px',
    backgroundColor: '#DC143C', // Crimson background
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    color: 'white',
    transition: 'background-color 0.3s',
  },
};

// Helper function to determine button labels
const getButtonLabel = (path: string): string => {
  switch (path) {
    case '/Shows':
      return 'Shows';
    case '/Movies':
      return 'Movies';
    case '/Books':
      return 'Books';
    case '/Games':
      return 'Games';
    default:
      return path;
  }
};

const TopBar: React.FC = () => {
  const paths: string[] = ['/Shows', '/Movies', '/Books', '/Games'];
  const navigate = useNavigate();
  const location = useLocation();
  const activetab: string = location.pathname;

  // Access authentication state from AuthContext
  const { isAuthenticated, username, logout } = useContext(AuthContext);

  // Debugging: Log authentication state
  console.log('TopBar - isAuthenticated:', isAuthenticated);
  console.log('TopBar - username:', username);

  // Handler for navigation buttons
  const handleNavigate = (page: string): void => {
    navigate(page);
  };

  // Handler for the "Log In" button
  const handleLoginClick = (): void => {
    navigate('/login');
  };

  // Handler for the "Logout" button
  const handleLogoutClick = (): void => {
    logout();
    navigate('/');
  };

  return (
      <div style={styles.topBar}>
        <div style={styles.navButtons}>
          {paths.map((path: string, index: number) => (
              <button
                  key={index}
                  onClick={() => handleNavigate(path)}
                  style={{
                    ...styles.button,
                    textDecoration: activetab === path ? 'underline' : 'none',
                    textDecorationColor: activetab === path ? 'rgb(173, 216, 230)' : 'none', // Light blue underline for active tab
                    color: activetab === path ? '#ADD8E6' : '#333', // Change color for active tab
                  }}
              >
                {getButtonLabel(path)}
              </button>
          ))}
        </div>

        {/* Conditionally render "Log In" button or user email with "Logout" */}
        {isAuthenticated && username ? (
            <div style={styles.userInfo}>
              <span style={styles.userEmail}>{username}</span>
              <button onClick={handleLogoutClick} style={styles.logoutButton}>
                Logout
              </button>
            </div>
        ) : (
            <button
                onClick={handleLoginClick}
                style={{
                  ...styles.loginButton,
                  // Optionally, indicate active state if on /login route
                  textDecoration: activetab === '/login' ? 'underline' : 'none',
                  textDecorationColor: activetab === '/login' ? 'rgb(173, 216, 230)' : 'none',
                  color: activetab === '/login' ? '#333' : '#ADD8E6', // Change text color if active
                  backgroundColor: activetab === '/login' ? '#ADD8E6' : 'transparent', // Change background if active
                }}
            >
              Log In
            </button>
        )}
      </div>
  );
};

export default TopBar;
