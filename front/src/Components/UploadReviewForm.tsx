import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import axios, { AxiosResponse } from 'axios';
import { AuthContext } from './AuthContext';
import { Link, useParams } from 'react-router-dom';

// function to upload review to the database
const uploadReview = async (endpoint: string, mediaNumber: string, userID: number, rating: number, summary: string, text: string, mediaType: string): Promise<void> => {
    // access the database endpoint
    const response: AxiosResponse = await axios.post(`http://localhost:3001/${endpoint}`, {
        mediaID: mediaNumber,
        userID: userID,
        rating: rating,
        summary: summary,
        text: text,
        mediaType: mediaType,
    });

    // handle response error
    if (!response) {
        throw new Error('Failed to fetch media');
    }
};

// function to upload review to the database
const deleteReview = async (mediaNumber: string, userID: number, mediaType: string): Promise<void> => {
    // access the database endpoint
    const response: AxiosResponse = await axios.post(`http://localhost:3001/delete_review`, {
        mediaID: mediaNumber,
        userID: userID,
        mediaType: mediaType,
    });

    // handle response error
    if (!response) {
        throw new Error('Failed to delete review');
    }
};

const UploadReviewForm: React.FC<FormComponentProps> = ({ endpoint, onFormSubmit, mediaType }) => {
    // grab info for the media number from the URL and the current user ID
    const { mediaNumber } = useParams<string>();
    const { userID } = useContext(AuthContext);

    // states
    const [rating, setRating] = useState<number>(5);
    const [summary, setSummary] = useState<string>('');
    const [text, setText] = useState<string>('');

    // function to handle a review submission
    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();

        // edit or post the review
        if (mediaNumber && userID) {
            try {
                await uploadReview(endpoint, mediaNumber, userID, rating, summary, text, mediaType);
            } catch (error) {
                console.error('Error uploading review:', error);
            }
        }

        // Inform the parent component that the form was submitted
        onFormSubmit();
    };

    const handleDelete = async (): Promise<void> => {
        
        // delete review
        if (mediaNumber && userID) {
            try {
                await deleteReview(mediaNumber, userID, mediaType);
            } catch (error) {
                console.error('Error uploading review:', error);
            }
        }

        // Inform the parent component that the form was submitted
        onFormSubmit();
    }

    return (
        <>
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // Horizontally center
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <div>
                    <Rating
                        precision={0.5}
                        value={rating}
                        onChange={(event, newValue) => { 
                            if (newValue !== null) {
                                setRating(newValue);
                            }
                        }}
                    />
                    <br />
                    <TextField
                        id="summary"
                        label="Summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)} // Control the input
                        multiline
                        required
                    />
                    <br />
                    <TextField
                        id="text"
                        label="Review Text"
                        value={text}
                        onChange={(e) => setText(e.target.value)} // Control the input
                        multiline
                        rows={4} // Set rows to 4 for multiline input
                        required
                    />
                    <br />
                    <Button variant="outlined" size="medium" type="submit">
                        {endpoint == "uploadreview" ? "Post Review" : "Edit Review"}
                    </Button>
                </div>
            </Box>
            <p style={{ fontFamily: 'Courier New', textAlign: 'center'}}><Link to="#"  onClick={handleDelete}>or delete your review </Link><br/></p>
        </>
    );
};

export default UploadReviewForm;
