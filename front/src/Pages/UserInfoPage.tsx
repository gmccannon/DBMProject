import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getUserByID } from '../lib/actions';
import { Rating } from '@mui/material';

const UserInfoPage = () => {
    const { URLUserID } = useParams<{ URLUserID: string }>();
    const [user, setUser] = useState<User | null>(null);

    // Fetch user on initial load or if URLUserID changes
    useEffect((): void => {
        if (URLUserID) {
            fetchUsers();
        }
    }, [URLUserID]);

    const fetchUsers = async (): Promise<void> => {
        try {
            const numURLUserID = Number(URLUserID);
    
            if (!isNaN(numURLUserID)) { // Ensure ID is a valid number
                const user = await getUserByID(numURLUserID);
    
                // Remove duplicate reviews
                const uniqueReviews = user.reviews.reduce((unique: any[], review: any) => {
                    // Check if the review's media_id and media_type are already in the unique array
                    const isDuplicate = unique.some(r => r.media_id === review.media_id && r.media_type === review.media_type);
                    if (!isDuplicate) {
                        unique.push(review);
                    }
                    return unique;
                }, []);
                
                // Set the user data with unique reviews
                setUser({ ...user, reviews: uniqueReviews });
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
                    
                    {/* Display Favorite Media */}
                    <div>
                        <h2>Favorites</h2>
                        <ul>
                            {user.fav_game_title && <li> {user.fav_game_title}</li>}
                            {user.fav_book_title && <li>{user.fav_book_title}</li>}
                            {user.fav_show_title && <li> {user.fav_show_title}</li>}
                            {user.fav_movie_title && <li> {user.fav_movie_title}</li>}
                        </ul>
                    </div>

                    {/* Display Reviews */}
                    <div>
                        <h2>Reviews</h2>
                        {user.reviews && user.reviews.length > 0 ? (
                            <ul>
                                {user.reviews.map((mediaReview, index) => (
                                    <>
                                        <hr style={{ width: '60%', margin: '0 auto', border: '.5px solid #000' }} />
                                        <div style={{ paddingLeft: '25%', maxWidth: '50%', wordWrap: 'break-word' }}>
                                        <h3 style={{ fontFamily: 'Courier New', fontWeight: 500 }}>posted for {mediaReview.media_title} on {mediaReview.posted_on}</h3>
                                        <Rating value={mediaReview.rating} precision={0.25} readOnly />
                                        <h2 style={{ fontFamily: 'Courier New', fontWeight: 800 }}>{mediaReview.summary}</h2>
                                        <h4 style={{ fontFamily: 'Courier New', fontWeight: 600 }}>{mediaReview.text}</h4>
                                        </div>
                                    </>
                                ))}
                            </ul>
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserInfoPage
