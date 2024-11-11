import React, { useContext, useEffect, useState } from 'react'
import { getUsers } from '../lib/actions';
import UserCard from '../Components/UserCard';
import { AuthContext } from '../Components/AuthContext';
import styled from 'styled-components';

const Title = styled.h1`
    font-family: 'Courier New';
    font-size: 32px;
    font-weight: 500;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
`;

const UsersPage = () => {
    const {userID} = useContext(AuthContext); 
    
    const [users, setUsers] = useState<User[] | null>(null);

    // Fetch media on initial load, and if users change
    useEffect((): void => {
        fetchUsers();
    }, [users]);

    // function to retrieve all of the users
    const fetchUsers = async (): Promise<void> => {
        try {
            const users = await getUsers();
            if (users) { 
                setUsers(users);
            } else {
                setUsers(null);
            }
            } 
        catch (err: unknown) {
            
        }
    };

    return (
        <div>
            <Title>all users</Title>
            {users && users
            .filter(user => user.id !== userID) // filter out the current user
            .map(user => (
                <UserCard user={user} key={user.id} />
            ))}
        </div>
    )
}

export default UsersPage
