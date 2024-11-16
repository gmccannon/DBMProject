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
    flex-wrap: wrap; /* Ensures responsiveness on smaller screens */
`;

// Styled search input
const SearchInput = styled.input`
    padding: 10px;
    width: 50%;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;

    @media (max-width: 600px) {
        width: 100%;
        margin-bottom: 10px;
    }
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

    @media (max-width: 600px) {
        margin-left: 0;
        width: 100%;
    }
`;

const UsersPage = () => {
    const { userID } = useContext(AuthContext);

    const [users, setUsers] = useState<User[] | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchCategory, setSearchCategory] = useState<string>('username'); // Default category

    // Fetch users on initial load
    useEffect((): void => {
        fetchUsers();
    }, []); // Empty dependency array to prevent infinite loop

    // Function to retrieve all of the users
    const fetchUsers = async (): Promise<void> => {
        try {
            const fetchedUsers = await getUsers();
            if (fetchedUsers) {
                setUsers(fetchedUsers);
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
        setSearchTerm(''); // Optional: Clear search term when category changes
    };

    // Update placeholder based on selected category
    const getPlaceholder = (): string => {
        switch (searchCategory) {
            case 'username':
                return "Search users by username...";
            case 'bio':
                return "Search users by bio...";
            case 'reviewed':
                return "Search users by reviews..."; // Placeholder for future functionality
            default:
                return "Search users...";
        }
    };

    // Filter users based on search term and category
    const filteredUsers = users?.filter(user => {
        if (user.id === userID) return false; // Exclude current user

        if (!searchTerm.trim()) return true; // If search term is empty, include all users

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        switch (searchCategory) {
            case 'username':
                return user.username.toLowerCase().includes(lowerCaseSearchTerm);
            case 'bio':
                return user.bio && user.bio.toString().toLowerCase().includes(lowerCaseSearchTerm);
            case 'reviewed':
                // Placeholder: Implement review-based search in the future
                // Example:
                // return user.reviews.some(review => review.content.toLowerCase().includes(lowerCaseSearchTerm));
                return true; // Temporarily include all users
            default:
                return user.username.toLowerCase().includes(lowerCaseSearchTerm);
        }
    });

    return (
        <div>
            <Title>All Users</Title>
            <SearchContainer>
                <SearchInput
                    type="text"
                    placeholder={getPlaceholder()}
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <SelectCategory value={searchCategory} onChange={handleCategoryChange}>
                    <option value="username">Username</option>
                    <option value="bio">Bio</option>
                    <option value="reviewed">Reviewed</option>
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
