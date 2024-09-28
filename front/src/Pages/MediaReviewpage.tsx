import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../Components/AuthContext';

const fetchMediaData = async (table: string, mediaNumber: string): Promise<Media[]> => {
  const response = await fetch(`http://localhost:3001/ind?table=${table.toLocaleLowerCase()}s&search=${mediaNumber}`);
  if (!response.ok) {
    throw new Error('Failed to fetch media');
  }
  return await response.json();
};

const MediaReviewPage: React.FC<MediaReviewPageProps> = ({mediaType}): JSX.Element => {
  const { mediaNumber } = useParams<string>(); // this extract the number from the URL, not any component!!!!
  const [media, setmedia] = useState<Media[]>();
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch media on initial load and when searchQuery changes
  useEffect((): void => {
    if (mediaNumber)
      fetchMedia(mediaType, mediaNumber);
  }, [mediaNumber, mediaType]);

  const fetchMedia = async (mediaType: string, mediaNumber: string): Promise<void> => {
    setLoading(true);
    try {
        const data = await fetchMediaData(mediaType, mediaNumber);
        console.log('Fetched media data:', data);  // Log the response here
        if (data) {  // Check if array has any elements
          setmedia(data);    // Set the first item in the array
        } else {
          setmedia(undefined);  // Handle case where no results are returned
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
    {media && <h1> Title: {media[0].title}</h1>}
    {media && <h1> Genre: {media[0].genre}</h1>}
    {media && <h1> Media ID: {media[0].id}</h1>}
  </> 
  );
}

export default MediaReviewPage;
