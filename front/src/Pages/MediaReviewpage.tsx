import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../Components/AuthContext';
import axios, { AxiosResponse } from 'axios';
import Rating from '@mui/material/Rating';
import UploadReviewForm from '../Components/UploadReviewForm'

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

  return (
  <>
    {media && <h1 style={{ fontFamily: 'Courier New'}}> media {'>'} {mediaType.toLowerCase()} {'>'} {media.title}</h1>}
    {media && <h1 style={{ fontFamily: 'Courier New'}}> {media.genre}</h1>}
    {media && <h1 style={{ fontFamily: 'Courier New'}}> Creator: {media.maker}</h1>}
    {media?.release_date && (
      <h1 style={{ fontFamily: 'Courier New'}}>
        Release Date: {new Date(media.release_date).toLocaleDateString("en-US", {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </h1>
    )}


    {/* Open review form prompt */}
    {!userID && <Link style={{ fontFamily: 'Courier New', fontWeight: 500, textAlign: 'center'}} to={'/login'}>Login to write a review<br/></Link>}
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
  </> 
  );
}

export default MediaReviewPage;
