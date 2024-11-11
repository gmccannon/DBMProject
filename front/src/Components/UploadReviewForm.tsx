import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { AuthContext } from './AuthContext';
import { Link, useParams } from 'react-router-dom';

import { deleteReview, uploadReview } from '../lib/actions';

// Note: endpoint can be uploadreview or editreview
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
                justifyContent: 'center', // Vertically center
                width: '40%', // Set width to 30% of the page
                margin: '0 auto', // Center horizontally
                fontFamily: 'Courier New', // Apply Courier New font to the entire form
                '& .MuiTextField-root': { m: 1, width: '100%' }, // Ensure text fields take up full width within the form
            }}
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <div style={{ width: '100%' }}> {/* Ensure the child elements take full width */}
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
                    onChange={(e) => setSummary(e.target.value)}
                    multiline
                    required
                    InputLabelProps={{
                        style: { fontFamily: 'Courier New' }, // Apply Courier New font to label
                    }}
                    InputProps={{
                        style: { fontFamily: 'Courier New' }, // Apply Courier New font to input text
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: 'black', // Change border color to black when focused
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black', // Change label color to black when focused
                        }
                    }}
                />
                <br />
                <TextField
                    id="text"
                    label="Review Text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    multiline
                    rows={4}
                    required
                    InputLabelProps={{
                        style: { fontFamily: 'Courier New' }, // Apply Courier New font to label
                    }}
                    InputProps={{
                        style: { fontFamily: 'Courier New' }, // Apply Courier New font to input text
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: 'black', // Change border color to black when focused
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black', // Change label color to black when focused
                        }
                    }}
                />

                <br />
                <Button 
                    style={{ color: 'black', borderColor: 'black', fontFamily: 'Courier New', display: 'flex', justifyContent: 'center'}} 
                    variant="outlined" 
                    size="medium" 
                    type="submit"
                >
                    {endpoint === "uploadreview" ? "Post Review" : "Edit Review"}
                </Button>
            </div>
        </Box>
        <p style={{ fontFamily: 'Courier New', textAlign: 'center' }}>
            {endpoint === "editreview" && <Link to="#" onClick={handleDelete}>or delete your review</Link>}
            <br />
        </p>
        </>
    );
};

export default UploadReviewForm;
