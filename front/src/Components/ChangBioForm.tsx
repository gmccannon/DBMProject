import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AuthContext } from './AuthContext';
import { changeBio } from '../lib/actions';

const ChangeBioForm: React.FC<ChangeBioFormComponentProps> = ({ onFormSubmit, currentBio }) => {
    // grab the current user ID
    const { userID } = useContext(AuthContext);

    // states
    const [text, setText] = useState<string>('');

    // function to handle a review submission
    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();

        // edit bio
        if (userID) {
            try {
                await changeBio(userID, text);
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
                <TextField
                    id="text"
                    defaultValue={currentBio}
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
                    {"Edit Bio"}
                </Button>
            </div>
        </Box>
    );
};

export default ChangeBioForm;
