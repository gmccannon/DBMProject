import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getUserByID } from '../lib/actions';

const UserInfoPage = () => {
    const { URLUserID } = useParams<{ URLUserID: string }>();
    const [user, setUser] = useState<User | null>(null);

    // Fetch user on initial load or if URLUserID changes
    useEffect((): void => {
        if (URLUserID) {
            fetchUsers();
        }
    }, [URLUserID]);

    // function to retrieve the user by ID
    const fetchUsers = async (): Promise<void> => {
        try {
            const numURLUserID = Number(URLUserID);

            if (!isNaN(numURLUserID)) { // Ensure ID is a valid number
                const user = await getUserByID(numURLUserID);
                setUser(user);
            } else {
                console.error("Invalid user ID");
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        }
    };

    return (
        <div>
            <h1>User info page for {user?.username || 'Unknown User'}</h1>
            {user && (
                <div>
                    <p>Bio: {user.bio}</p>
                    <p>Joined on: {user.joined_on}</p>
                    {/* Add more fields as needed */}
                </div>
            )}
        </div>
    );
};

export default UserInfoPage
