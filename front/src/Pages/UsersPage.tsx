import React, { useContext, useEffect, useState } from 'react';
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

const SearchInput = styled.input`
    display: block;
    margin: 0 auto 20px auto;
    padding: 10px;
    width: 50%;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const UsersPage = () => {
    const { userID } = useContext(AuthContext);

    const [users, setUsers] = useState<User[] | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Fetch users on initial load
    useEffect((): void => {
        fetchUsers();
    }, []); // Empty dependency array to prevent infinite loop

    // Function to retrieve all of the users
    const fetchUsers = async (): Promise<void> => {
        try {
            const users = await getUsers();
            if (users) {
                setUsers(users);
            } else {
                setUsers(null);
            }
        } catch (err: unknown) {
            console.error("Error fetching users:", err);
            setUsers(null);
        }
    };

    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Filter users based on search term
    const filteredUsers = users?.filter(user =>
        user.id !== userID &&
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Title>All Users</Title>
            <SearchInput
                type="text"
                placeholder="Search users by username..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                    <UserCard user={user} key={user.id} />
                ))
            ) : (
                <p style={{ textAlign: 'center', fontFamily: 'Courier New' }}>
                    No users found.
                </p>
            )}
        </div>
    );
}

export default UsersPage;
