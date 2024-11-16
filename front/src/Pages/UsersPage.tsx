import React, { useContext, useEffect, useState, useMemo } from 'react';
import { getUsers, getUserByID } from '../lib/actions';
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
    const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
    const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
    const [errorUsers, setErrorUsers] = useState<string | null>(null);
    const [errorReviews, setErrorReviews] = useState<string | null>(null);
    const [reviewsMap, setReviewsMap] = useState<{ [key: number]: MediaReview[] }>({});

    // Debounce search term to optimize performance
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Fetch users on initial load
    useEffect((): void => {
        fetchUsers();
    }, []); // Empty dependency array to prevent infinite loop

    // Function to retrieve all users
    const fetchUsers = async (): Promise<void> => {
        setLoadingUsers(true);
        setErrorUsers(null);
        try {
            const fetchedUsers = await getUsers();
            if (fetchedUsers) {
                setUsers(fetchedUsers);
            } else {
                setUsers(null);
            }
        } catch (err: unknown) {
            console.error("Error fetching users:", err);
            setErrorUsers("Failed to fetch users. Please try again later.");
            setUsers(null);
        } finally {
            setLoadingUsers(false);
        }
    };

    // Function to fetch reviews for a specific user
    const fetchReviewsForUser = async (userId: number): Promise<void> => {
        try {
            const userWithReviews = await getUserByID(userId);
            if (userWithReviews && userWithReviews.reviews) {
                setReviewsMap(prev => ({
                    ...prev,
                    [userId]: userWithReviews.reviews,
                }));
            }
        } catch (err: unknown) {
            console.error(`Error fetching reviews for user ${userId}:`, err);
            setErrorReviews(`Failed to fetch reviews for user ID ${userId}.`);
        }
    };

    // Fetch reviews when searchCategory is 'reviewed' and debouncedSearchTerm is not empty
    useEffect(() => {
        const fetchAllRequiredReviews = async () => {
            if (searchCategory !== 'reviewed' || !debouncedSearchTerm.trim() || !users) {
                return;
            }

            // Identify users who haven't had their reviews fetched yet
            const usersToFetch = users.filter(user => user.id !== userID && !reviewsMap[user.id]);

            if (usersToFetch.length === 0) {
                return; // All necessary reviews are already fetched
            }

            setLoadingReviews(true);
            setErrorReviews(null);

            // Fetch reviews for all required users
            await Promise.all(usersToFetch.map(user => fetchReviewsForUser(user.id)));

            setLoadingReviews(false);
        };

        fetchAllRequiredReviews();
    }, [searchCategory, debouncedSearchTerm, users, userID, reviewsMap]);

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
                return "Search users by reviewed media...";
            default:
                return "Search users...";
        }
    };

    // Memoize filtered users for performance optimization
    const filteredUsers = useMemo(() => {
        if (!users) return null;

        return users.filter(user => {
            if (user.id === userID) return false; // Exclude current user

            if (!debouncedSearchTerm.trim()) return true; // If search term is empty, include all users

            const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();

            switch (searchCategory) {
                case 'username':
                    return user.username.toLowerCase().includes(lowerCaseSearchTerm);
                case 'bio':
                    return user.bio && user.bio.toString().toLowerCase().includes(lowerCaseSearchTerm);
                case 'reviewed':
                    const userReviews = reviewsMap[user.id];
                    if (!userReviews) return false; // If reviews not fetched yet, exclude temporarily
                    return userReviews.some(review =>
                        review.media_title.toLowerCase().includes(lowerCaseSearchTerm)
                    );
                default:
                    return user.username.toLowerCase().includes(lowerCaseSearchTerm);
            }
        });
    }, [users, userID, debouncedSearchTerm, searchCategory, reviewsMap]);

    return (
        <div>
            <Title>All Users</Title>
            <SearchContainer>
                <label htmlFor="search-input" style={{ display: 'none' }}>Search Users</label>
                <SearchInput
                    id="search-input"
                    type="text"
                    placeholder={getPlaceholder()}
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <label htmlFor="search-category" style={{ display: 'none' }}>Search Category</label>
                <SelectCategory id="search-category" value={searchCategory} onChange={handleCategoryChange}>
                    <option value="username">Username</option>
                    <option value="bio">Bio</option>
                    <option value="reviewed">Reviewed</option>
                    {/* Add more categories as needed */}
                </SelectCategory>
            </SearchContainer>
            {loadingUsers ? (
                <p style={{ textAlign: 'center', fontFamily: 'Courier New' }}>Loading users...</p>
            ) : errorUsers ? (
                <p style={{ textAlign: 'center', fontFamily: 'Courier New', color: 'red' }}>{errorUsers}</p>
            ) : searchCategory === 'reviewed' && loadingReviews ? (
                <p style={{ textAlign: 'center', fontFamily: 'Courier New' }}>Loading reviews...</p>
            ) : errorReviews ? (
                <p style={{ textAlign: 'center', fontFamily: 'Courier New', color: 'red' }}>{errorReviews}</p>
            ) : filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                    <UserCard user={user} key={user.id} />
                ))
            ) : (
                <p style={{ textAlign: 'center', fontFamily: 'Courier New' }}>
                    No users found.
                </p>
            )}
            {/* Add padding at bottom of page */}
            <div style={{ marginBottom: '120px' }}></div>
        </div>
    );
}

export default UsersPage;
