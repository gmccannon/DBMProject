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

const MediaReviewPage: React.FC<MediaReviewPageProps> = ({mediaType}): JSX.Element => {
  const { mediaNumber } = useParams<string>();   // method to extract the media number from the URL
  const {userID} = useContext(AuthContext);   // grab info for the current user ID

  // states
  const [media, setMedia] = useState<Media>();
  const [mediaReviews, setMediaReviews] = useState<MediaReview[]>();
  const [showForm, setShowForm] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch media on initial load, and when searchQuery or mediaType (page) changes
  useEffect((): void => {
    if (mediaNumber) {
      fetchMedia(mediaType, mediaNumber);
      fetchMediaReviews(mediaNumber, mediaType);
    }
  }, [mediaNumber, mediaType, showForm]);

  // function to toggle the visibility of the form
  const handleShowForm = () => {
    if (showForm) {
      setShowForm(false);
    } else {
      setShowForm(true);
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

  //TODO: make it so if the user has already posted a review, the prompt becomes to edit the review
  //TODO: add the functionality to edit a review

  return (
  <>
    {media && <h1> Media {'>'} {mediaType} {'>'} {media.title}</h1>}
    {media && <h1> Genre: {media.genre}</h1>}
    {media && <h1> Media ID: {media.id}</h1>}

    {!userID && <Link to={'/login'}>Login to write a review<br/></Link>}
    {userID && <><Link to="#" onClick={handleShowForm}>Write a review</Link><br/></>}
    {showForm && <UploadReviewForm onFormSubmit={handleShowForm} mediaType={mediaType}/>}

    {mediaReviews && mediaReviews.map(mediaReview => (
      <div>
        <hr style={{ width: '100%', margin: '0 auto', border: '1px solid #000' }} />
        <h3> {mediaReview.username} </h3>
        <Rating value={mediaReview.rating} precision={0.25} readOnly />
        <h1> {mediaReview.summary} </h1>
        <h2> {mediaReview.text} </h2>
      </div>
      ))}
    {mediaReviews?.length == 0 && <h1>No reviews yet</h1>}
  </> 
  );
}

export default MediaReviewPage;
