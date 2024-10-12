import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../Components/AuthContext';
import axios, { AxiosResponse } from 'axios';

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
  // method to extract the media number from the URL
  const { mediaNumber } = useParams<string>();
  // grab info for the current user ID
  const {userID} = useContext(AuthContext);

  // states
  const [media, setMedia] = useState<Media>();
  const [mediaReviews, setMediaReviews] = useState<MediaReview[]>();
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch media on initial load, and when searchQuery or mediaType (page) changes
  useEffect((): void => {
    if (mediaNumber) {
      fetchMedia(mediaType, mediaNumber);
      fetchMediaReviews(mediaNumber, mediaType);
    }
  }, [mediaNumber, mediaType]);

  // function to update states based on info from the database
  // queried with mediaID (ID from the URL), and the mediaType
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

  // function to update state of the media reviews
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
    {media && <h1> Type: {mediaType}</h1>}
    {media && <h1> Title: {media.title}</h1>}
    {media && <h1> Genre: {media.genre}</h1>}
    {media && <h1> Media ID: {media.id}</h1>}

    {mediaReviews && mediaReviews.map(mediaReview => (
      <>
        <h1> {mediaReview.rating} </h1>
        <h1> {mediaReview.summary} </h1>
        <h1> {mediaReview.text} </h1>
      </>
      ))}
  </> 
  );
}

export default MediaReviewPage;
