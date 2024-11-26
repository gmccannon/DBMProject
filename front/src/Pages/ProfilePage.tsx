// src/Pages/ProfilePage.tsx

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserByID, getRecommendations } from '../lib/actions';
import { Box, Button, Rating } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MediaCard from '../Components/MediaCard';

const ProfilePage: React.FC = () => {
    const { userID, logout, token } = useContext(AuthContext);

    const [user, setUser] = useState<User | null>(null);
    const [recommendations, setRecommendations] = useState<Media[]>([]);

    // Use navigation method from react router
    const navigate = useNavigate();

    // Handler for the "Logout" button
    const handleLogout = (): void => {
        logout();
        navigate('/');
    };

    // Fetch user and recommendations on initial load or if userID changes
    useEffect(() => {
        if (userID) {
            fetchUserData();
            fetchRecommendations();
        }
    }, [userID]);

    const fetchUserData = async (): Promise<void> => {
        try {
            const numUserID = Number(userID);

            if (!isNaN(numUserID)) {
                const userData = await getUserByID(numUserID);

                // Remove duplicate reviews
                const uniqueReviews = userData.reviews.reduce(
                    (unique: Review[], review: Review) => {
                        const isDuplicate = unique.some(
                            (r) =>
                                r.media_id === review.media_id &&
                                r.media_type === review.media_type
                        );
                        if (!isDuplicate) {
                            unique.push(review);
                        }
                        return unique;
                    },
                    []
                );

                setUser({ ...userData, reviews: uniqueReviews });
            } else {
                console.error('Invalid user ID');
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null);
        }
    };

    const fetchRecommendations = async (): Promise<void> => {
        try {
            if (token) {
                const recommendationsData = await getRecommendations(token);
                setRecommendations(recommendationsData);
            } else {
                console.error('No authentication token available');
                setRecommendations([]);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setRecommendations([]);
        }
    };

    // Define top 3 recommendations
    const topRecommendations = recommendations.slice(0, 3);

    return (
        <div>
            {/* Header and Logout Button */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                    variant="text"
                    onClick={handleLogout}
                    sx={{
                        alignSelf: 'flex-end',
                        textTransform: 'none',
                        fontSize: 26,
                        fontFamily: 'Courier New',
                        marginRight: 6,
                        color: 'black',
                    }}
                >
                    logout
                </Button>
                <AccountCircleIcon sx={{ alignSelf: 'center', fontSize: 90 }} />
            </Box>

            {/* User Information */}
            <h1
                style={{
                    fontFamily: 'Courier New',
                    textAlign: 'center',
                    fontWeight: 100,
                }}
            >
                {user?.username || 'Unknown User'}
            </h1>
            {user && (
                <div>
                    <p
                        style={{
                            fontFamily: 'Courier New',
                            textAlign: 'center',
                            fontWeight: 100,
                        }}
                    >
                        Bio: {user.bio}
                    </p>
                    <p
                        style={{
                            fontFamily: 'Courier New',
                            textAlign: 'center',
                            fontWeight: 100,
                        }}
                    >
                        Joined on: {user.joined_on}
                    </p>

                    {/* Display Favorite Media */}
                    <div style={{ marginTop: 60 }}>
                        <h2
                            style={{
                                fontFamily: 'Courier New',
                                textAlign: 'center',
                                fontWeight: 600,
                            }}
                        >
                            favorites
                        </h2>
                        <div
                            style={{
                                fontFamily: 'Courier New',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginBottom: 50,
                                marginTop: -10,
                                fontStyle: 'italic',
                            }}
                        >
                            {user.fav_game_title && (
                                <h2 style={{ fontWeight: 100, marginBottom: -5 }}>
                                    {user.fav_game_title}
                                </h2>
                            )}
                            {user.fav_book_title && (
                                <h2 style={{ fontWeight: 100, marginBottom: -5 }}>
                                    {user.fav_book_title}
                                </h2>
                            )}
                            {user.fav_show_title && (
                                <h2 style={{ fontWeight: 100, marginBottom: -5 }}>
                                    {user.fav_show_title}
                                </h2>
                            )}
                            {user.fav_movie_title && (
                                <h2 style={{ fontWeight: 100, marginBottom: -5 }}>
                                    {user.fav_movie_title}
                                </h2>
                            )}
                        </div>
                    </div>

                    {/* Display Recommendations */}
                    <div>
                        <h2
                            style={{
                                fontFamily: 'Courier New',
                                textAlign: 'center',
                                fontWeight: 600,
                            }}
                        >
                            recommendations
                        </h2>
                        {topRecommendations && topRecommendations.length > 0 ? (
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    marginBottom: '50px',
                                }}
                            >
                                {topRecommendations.map((mediaItem) => (
                                    <MediaCard
                                        key={mediaItem.id}
                                        content={mediaItem}
                                        mediaType={mediaItem.media_type}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center' }}>No recommendations yet.</p>
                        )}
                    </div>

                    {/* Display Reviews */}
                    <div>
                        <h2
                            style={{
                                fontFamily: 'Courier New',
                                textAlign: 'center',
                                fontWeight: 600,
                            }}
                        >
                            reviews
                        </h2>
                        {user.reviews && user.reviews.length > 0 ? (
                            <ul>
                                {user.reviews.map((mediaReview, index) => (
                                    <React.Fragment key={index}>
                                        <hr
                                            style={{
                                                width: '60%',
                                                margin: '0 auto',
                                                border: '.5px solid #000',
                                            }}
                                        />
                                        <div
                                            style={{
                                                paddingLeft: '25%',
                                                maxWidth: '50%',
                                                wordWrap: 'break-word',
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    fontFamily: 'Courier New',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                You posted a review for{' '}
                                                <span style={{ fontStyle: 'italic' }}>
                                                    {mediaReview.media_title}
                                                </span>{' '}
                                                on {mediaReview.posted_on}
                                            </h3>
                                            <Rating
                                                value={mediaReview.rating}
                                                precision={0.25}
                                                readOnly
                                            />
                                            <h2
                                                style={{
                                                    fontFamily: 'Courier New',
                                                    fontWeight: 800,
                                                }}
                                            >
                                                {mediaReview.summary}
                                            </h2>
                                            <h4
                                                style={{
                                                    fontFamily: 'Courier New',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {mediaReview.text}
                                            </h4>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </ul>
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>
                </div>
            )}
            {/* Add padding at bottom of page */}
            <div style={{ marginBottom: '120px' }}></div>
        </div>
    );
};

export default ProfilePage;
