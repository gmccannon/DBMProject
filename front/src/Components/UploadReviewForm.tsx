import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';

const UploadReviewForm: React.FC<FormComponentProps> = ( {onFormSubmit} ) => {
    const [rating, setRating] = useState<number>(5);
    const [summary, setSummary] = useState<string>();
    const [text, setText] = useState<string>();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Submit the form (you can add additional checks for other fields)
        alert('Form submitted');

         /* tell the parent component that the form was submited, as of right now
         this is just to hid the form body after submission */
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
        <Rating precision={0.5} defaultValue={5} onChange={(event, newValue) => {setRating(newValue !== null ? newValue : 5);}}/>
        <br/>
        <TextField
            id="outlined-multiline-flexible"
            label="Multiline"
            defaultValue="Default Value"
            multiline
            maxRows={1}
            required
        />
        <br/>
        <TextField
            id="outlined-textarea"
            label="Multiline Placeholder"
            defaultValue="Default Value"
            rows={4}
            multiline
            required
        />
        <br/>
        <Button variant="outlined" size="medium" type="submit">
          Post Review
        </Button>
        </div>
    </Box>
  )
}

export default UploadReviewForm

