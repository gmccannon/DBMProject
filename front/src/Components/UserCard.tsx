import React from 'react'
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }: { user: User }) => {
    // use navigation method from react router
    const navigate = useNavigate();

    // function to navigate to user page
    const handleNavToUser = (user_id: number): void => {
        navigate(`/users/${user_id}`);
    };

    return (
        <div onClick={() => handleNavToUser(user.id)}>
            <hr style={{ width: '60%', margin: '0 auto', border: '.5px solid #000' }} />
            <div style={{ paddingLeft: '25%', maxWidth: '50%', wordWrap: 'break-word' }}>
                <h2 style={{ fontFamily: 'Courier New', fontWeight: 700 }}>{user.username}</h2>
                <h3 style={{ fontFamily: 'Courier New', fontWeight: 400 }}>{user.bio}</h3>
                <h4 style={{ fontFamily: 'Courier New', fontWeight: 300 }}>joined on {user.joined_on}</h4>
            </div>         
        </div>
    )
}

export default UserCard
