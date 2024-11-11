import React from 'react'
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }: { user: User }) => {
    // use navigation method from react router
    const navigate = useNavigate();

    // function to navigate to users page
    const handleNavToUser = (user_id: number): void => {
        navigate(`/users/${user_id}`);
    };

    return (
        <div>
            <h1>{user.username}</h1>
            <button onClick={() => handleNavToUser(user.id)}>
                {user.id}
            </button>
        </div>
    )
}

export default UserCard
