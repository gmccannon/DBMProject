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
            color: activetab === path ? 'rgb(38, 91, 172)' : 'black',
          }}
        >
          {path.substring(1) || 'Movies'}
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
    borderBottom: '1px solid black', // Black border
  },
  button: {
    fontWeight: 600,
    margin: '0 10px', // Space between buttons
    padding: '10px 20px', // Padding inside buttons
    backgroundColor: 'transparent', // Transparent background
    border: 'none', // Remove default border
    cursor: 'pointer',
    outline: 'none', // Remove focus outline
    transition: 'color 0.3s', // Smooth color transition
  },
};

export default TopBar;
