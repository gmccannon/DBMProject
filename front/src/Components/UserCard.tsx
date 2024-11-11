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
        <div onClick={() => handleNavToUser(user.id)}>
            <hr style={{ width: '60%', margin: '0 auto', border: '.5px solid #000' }} />
            <div style={{ paddingLeft: '25%', maxWidth: '50%', wordWrap: 'break-word' }}>
                <h3 style={{ fontFamily: 'Courier New', fontWeight: 500 }}>{user.username}</h3>
                <h2 style={{ fontFamily: 'Courier New', fontWeight: 800 }}>{user.bio}</h2>
                <h4 style={{ fontFamily: 'Courier New', fontWeight: 600 }}>{user.joined_on}</h4>
            </div>         
        </div>
    )
}

export default UserCard
