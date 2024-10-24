import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../Components/AuthContext';
import axios, { AxiosResponse } from 'axios';
import Rating from '@mui/material/Rating';
import UploadReviewForm from '../Components/UploadReviewForm'

const Container = styled.div`
  display: flex;
  justify-content: center; /* Center the columns */
  align-items: flex-start; /* Ensures both columns start at the same height */
  padding: 20px;
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: left; /* Center content horizontally in the column */
  padding-left: 5%;
  margin-left: 10%
`;

const RightColumn = styled.div`
  flex: 1;
  margin-left: 6%; /* Reduced margin for closer columns */
  display: flex;
  flex-direction: column;
  align-items: left; /* Align items to the left */
  justify-content: center;
  margin-right: 10%
`;

const Title = styled.h1`
  font-family: 'Courier New';
  font-size: 18px; /* Reduced font size */
  margin: 0 0 15px 0; /* Remove top margin for better alignment */
  text-align: left; /* Left-align the breadcrumb title */
  width: 100%; /* Take full width to align with the image */
  max-width: 493px; /* Set a max width to align with the image */
`;

const Image = styled.img`
  max-width: 493px; /* Maximum width */
  max-height: 600px; /* Maximum height */
`;


const Info = styled.h1`
  font-family: 'Courier New';
  font-size: 1.5vw;
  font-weight: 300;
  margin-bottom: 10px;
  text-align: left; /* Left-align the text in the right column */
`;

// function to get media from the database based on the specificed mediaType (table) and its specific ID
const fetchMediaData = async (table: string, mediaNumber: string): Promise<Media> => {
  // access the database endpoint
  const response: AxiosResponse = await axios.get('http://localhost:3001/ind', {
    params: {
      table: table,
      search: mediaNumber,
    }
  });
  
  // handle response error
  if (!response) {
    throw new Error('Failed to fetch media');
  }

  // returns a single Media
  return await response.data;
};

// function to get media from the database based on the specificed mediaType (table) and its specific ID
const fetchMediaReviewData = async (mediaID: string, mediaType: string): Promise<MediaReview[]> => {
  // access the database endpoint
  const response: AxiosResponse = await axios.get('http://localhost:3001/review', {
    params: {
      mediaID: mediaID,
      mediaType: mediaType,
    }
  });
  
  // handle response error
  if (!response) {
    throw new Error('Failed to fetch media');
  }

  // returns a single Media
  return await response.data;
};

const fetchIfReviewed = async (userID: number, mediaNumber: string, mediaType: string): Promise<boolean> => {
  const response: AxiosResponse = await axios.get('http://localhost:3001/user_review', {
    params: {
      userID: userID,
      mediaID: mediaNumber,
      mediaType: mediaType,
    }
  });

  if (!response) {
    throw new Error('Failed to check review status');
  }

  return response.data;
}

const MediaReviewPage: React.FC<MediaReviewPageProps> = ({mediaType}): JSX.Element => {
  // grab info for the media number from the URL and the current user ID
  const { mediaNumber } = useParams<string>();
  const {userID} = useContext(AuthContext); 

  // states
  const [media, setMedia] = useState<Media>();
  const [mediaReviews, setMediaReviews] = useState<MediaReview[]>();
  const [showForm, setShowForm] = useState<Boolean>(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState<boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch media on initial load, and when searchQuery or mediaType (page) changes
  useEffect((): void => {
    if (mediaNumber) {
      fetchMedia(mediaType, mediaNumber);
      fetchMediaReviews(mediaNumber, mediaType);
      if (userID) {
        checkIfReviewed(userID, mediaNumber, mediaType);
      }
    }
  }, [mediaNumber, mediaType, userID, showForm]);

  // function to toggle the visibility of the form
  const handleShowForm = () => {
    if (showForm) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  }

  // function to see if the user has already written a review, then update the state
  const checkIfReviewed = async (userID: number, mediaNumber: string, mediaType: string): Promise<void> => {
    try {
      const alreadyReviewed: boolean = await fetchIfReviewed(userID, mediaNumber, mediaType);
      if (alreadyReviewed) {
        setAlreadyReviewed(true);
      } else {
        setAlreadyReviewed(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
        setLoading(false);
    }
  }

  // function to update states based on info from the database
  // queried with mediaNumber (from the URL), and the mediaType
  const fetchMedia = async (mediaType: string, mediaNumber: string): Promise<void> => {
    setLoading(true);
    try {
        const data = await fetchMediaData(mediaType, mediaNumber);
        console.log('Fetched media data:', data);  // Log the response here
        if (data) {  // Check if array has any elements
          setMedia(data);    // Set the first item in the array
        } else {
          setMedia(undefined);  // Handle case where no results are returned
        }
    } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
        setLoading(false);
    }
  };

  // function to update the state of all of the reviews for the current media
  // queried with mediaNumber (from the URL), and the mediaType
  const fetchMediaReviews = async (mediaNumber: string, mediaType: string): Promise<void> => {
    setLoading(true);
    try {
        const data = await fetchMediaReviewData(mediaNumber, mediaType);
        console.log('Fetched media data:', data);  // Log the response here
        if (data) {  // Check if array has any elements
          setMediaReviews(data);    // Set the first item in the array
        } else {
          setMediaReviews(undefined);  // Handle case where no results are returned
        }
    } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
        setLoading(false);
    }
  };

  // Function to determine image path based on mediaType and mediaNumber
  const getImagePath = () => {
    // Images are stored in public/images/{mediaType}{content.id}.jpg
    return `/images/${mediaType}${mediaNumber}.jpg`;
  };

  return (
  <>
    <div>
      {/* Two-column layout */}
      <Container>
        {/* Left Column: Title and Image */}
        <LeftColumn>
          {media && (
            <Title>
              media {'>'} {mediaType.toLowerCase()} {'>'} {media.title}
            </Title>
          )}
          <Image src={getImagePath()} alt="Image not found" />
        </LeftColumn>

        {/* Right Column: Genre, Creator, Release Date */}
        <RightColumn>
          {media && <Info>Title: {media.title}</Info>}
          {media && <Info>Creator: {media.maker}</Info>}
          {media?.release_date && (
            <Info>
              Release Date: {new Date(media.release_date).toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Info>
          )}
          {media && <Info>Genre: {media.genre}</Info>}
        </RightColumn>
      </Container>
    </div>

    <h1 style={{ fontFamily: 'Courier New', textAlign: 'center', fontWeight: 100}}>reviews</h1>

    {/* Open review form prompt */}
    {!userID &&
        <p style={{ fontFamily: 'Courier New', textAlign: 'center'}}> 
          <Link style={{ fontFamily: 'Courier New', fontWeight: 500}} to={'/login'}>Login to write a review<br/></Link>
        </p>
        }
    {userID && !alreadyReviewed && (
      <p style={{ fontFamily: 'Courier New', textAlign: 'center'}}> 
        <Link to="#"  onClick={handleShowForm}> {!showForm ? "write a review" : "close form"}</Link><br/>
      </p>
    )}
    {userID && alreadyReviewed && (
      <p style={{ fontFamily: 'Courier New', textAlign: 'center'}}>{!showForm && "you have already reviewed this "} 
        <Link to="#"  onClick={handleShowForm}> {!showForm ? "edit your review" : "close form"}</Link><br/>
      </p>
    )}

    {/* Form */}
    {showForm && !alreadyReviewed && <UploadReviewForm endpoint={"uploadreview"} onFormSubmit={handleShowForm} mediaType={mediaType}/>}
    {showForm && alreadyReviewed && <UploadReviewForm endpoint={"editreview"} onFormSubmit={handleShowForm} mediaType={mediaType}/>}

    {/* Add padding below the form */}
    <div style={{ marginBottom: '30px' }}></div>

    {/* Reviews */}
    {mediaReviews && mediaReviews.map(mediaReview => (
      <>
        <hr style={{ width: '60%', margin: '0 auto', border: '.5px solid #000' }} />
        <div style={{ paddingLeft: '25%', maxWidth: '50%', wordWrap: 'break-word' }}>
          <h3 style={{ fontFamily: 'Courier New', fontWeight: 500 }}>posted by {mediaReview.username}</h3>
          <Rating value={mediaReview.rating} precision={0.25} readOnly />
          <h2 style={{ fontFamily: 'Courier New', fontWeight: 800 }}>{mediaReview.summary}</h2>
          <h4 style={{ fontFamily: 'Courier New', fontWeight: 600 }}>{mediaReview.text}</h4>
        </div>
      </>
      ))}
    {mediaReviews?.length == 0 && <h2 style={{ fontFamily: 'Courier New', textAlign: 'center', fontWeight: 100 }}>no reviews yet</h2>}

    {/* Add padding at bottom of page*/}
    <div style={{ marginBottom: '120px' }}></div>
  </> 
  );
}

export default MediaReviewPage;
