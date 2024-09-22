import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TopBar = () => {
  const paths = ['/TVShows', '/', '/Books'];
  const navigate = useNavigate();
  const location = useLocation();
  const activetab = location.pathname;

  const handleNavigate = (page: string) => {
    navigate(page);
  };

  return (
    <div style={styles.topBar}>
      {paths.map((path, index) => (
        <button
          key={index}
          onClick={() => handleNavigate(path)}
          style={{
            ...styles.button,
            textDecoration: activetab === path ? 'underline' : 'none',
            textDecorationColor: activetab === path ? 'rgb(173, 216, 230)' : 'none', // Light blue underline for active tab
          }}
        >
          {path === '/TVShows' ? 'shows' : path === '/' ? 'movies' : 'books'}
        </button>
      ))}
    </div>
  );
};

const styles = {
  topBar: {
    display: 'flex',
    justifyContent: 'center', // Center the buttons horizontally
    alignItems: 'center',
    backgroundColor: 'white', // White background
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Shadow effect
    padding: '10px 0', // Padding for better spacing
  },
  button: {
    fontSize: '24px', // Make the text bigger
    fontWeight: 600,
    margin: '0 10px', // Space between buttons
    padding: '10px 20px', // Padding inside buttons
    backgroundColor: 'transparent', // Transparent background
    border: 'none', // Remove default border
    cursor: 'pointer',
    outline: 'none', // Remove focus outline
    transition: 'color 0.3s, text-decoration-color 0.3s', // Smooth transition for color and underline
  },
};

export default TopBar;
