import React, { useContext } from 'react'
import { AuthContext } from '../Components/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  // Handler for the "Logout" button
  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  const { username, userID, logout} = useContext(AuthContext);
  return (
    <div>
      <h1>Profile for {username}</h1>
      <h1>ID number: {userID}</h1>
      <button onClick={handleLogout} >Logout</button>
    </div>
  )
}

export default ProfilePage
