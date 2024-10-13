import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import axios, { AxiosResponse } from 'axios';
import { AuthContext } from './AuthContext';
import { useParams } from 'react-router-dom';

// function to upload review to the database
const uploadReview = async (mediaNumber: string, userID: number, rating: number, summary: string, text: string, mediaType: string) => {
    // access the database endpoint
    const response: AxiosResponse = await axios.post('http://localhost:3001/uploadreview', {
        mediaID: mediaNumber,  // Corrected key name
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

    // returns a single Media
    return await response.data;
};

const UploadReviewForm: React.FC<FormComponentProps> = ({ onFormSubmit, mediaType }) => {
    const { mediaNumber } = useParams<string>(); // method to extract the media number from the URL
    const { userID } = useContext(AuthContext); // grab info for the current user ID

    // states
    const [rating, setRating] = useState<number>(5);
    const [summary, setSummary] = useState<string>('');
    const [text, setText] = useState<string>('');

    // function to handle a review submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Submit the form (you can add additional checks for other fields)
        if (mediaNumber && userID) {
            try {
                await uploadReview(mediaNumber, userID, rating, summary, text, mediaType);
            } catch (error) {
                console.error('Error uploading review:', error);
            }
        }

        // Inform the parent component that the form was submitted
        onFormSubmit();
    };

    return (
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
                    onChange={(event, newValue) => { setRating(newValue !== null ? newValue : 5); }}
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
                    Post Review
                </Button>
            </div>
        </Box>
    );
};

export default UploadReviewForm;
