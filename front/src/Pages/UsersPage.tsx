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

// Container to hold both search input and drop-down
const SearchContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
`;

// Styled search input
const SearchInput = styled.input`
    padding: 10px;
    width: 50%;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

// Styled drop-down select
const SelectCategory = styled.select`
    margin-left: 10px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
`;

const UsersPage = () => {
    const { userID } = useContext(AuthContext);

    const [users, setUsers] = useState<User[] | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchCategory, setSearchCategory] = useState<string>('name'); // Default category

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

    // Handle category selection changes
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchCategory(e.target.value);
    };

    // Filter users based on search term and category (Functionality to be implemented)
    const filteredUsers = users?.filter(user => {
        if (user.id === userID) return false; // Exclude current user

        // Placeholder for category-based filtering
        // Example (to be implemented):
        // if (searchCategory === 'email') {
        //     return user.email.toLowerCase().includes(searchTerm.toLowerCase());
        // }

        // Default to username search
        return user.username.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div>
            <Title>All Users</Title>
            <SearchContainer>
                <SearchInput
                    type="text"
                    placeholder="Search bar..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <SelectCategory value={searchCategory} onChange={handleCategoryChange}>
                    <option value="username">name</option>
                    <option value="email">reviewed</option>
                    {/* Add more categories as needed */}
                </SelectCategory>
            </SearchContainer>
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
