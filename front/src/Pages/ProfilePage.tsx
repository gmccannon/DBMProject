import React, { useContext } from 'react'
import { AuthContext } from '../Components/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  // use navigation method from react router
  const navigate = useNavigate();

  // Handler for the "Logout" button
  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  // grab info for the current user, and method to login the user from AuthContext component
  const { username, userID, logout} = useContext(AuthContext);

  // TODO: List the users favorites here

  return (
    <div>
      <h1>Profile for {username}</h1>
      <h1>ID number for profile: {userID}</h1>
      <button onClick={handleLogout} >Logout</button>
    </div>
  )
}

export default ProfilePage
