import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../Components/Header';
import ShowCard from '../Components/TVCard';

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
`;

// Define the Show type based on your schema
type Show = {
  Show_id: number;
  title: string;
  seasons: string;
  writer: string;
  network: string;
};

const ShowsPage = () => {
  const [Shows, setShows] = useState<Show[]>([]); // State to store Shows data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState<Error | null>(null); // State to manage error

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('http://localhost:3001/Shows');
        if (!response.ok) {
          throw new Error('There was an error fetching the data');
        }
        const data = await response.json();
        setShows(data); // Set the Shows data received from the backend
        setLoading(false); // Data has been fetched, stop loading
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unknown error occurred')); // Handle unknown error types
        }
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchShows();
  }, []); // Empty dependency array, runs only on mount

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show error state
  }

  return (
    <>
      <Header mediaType={'Shows'} />
      <GridContainer>
        {Shows.map(Show => (
          <ShowCard
            id={Show.Show_id}
            image={`/path-to-image-placeholder.jpg`}
            title={Show.title}
            writer={Show.writer}
            seasons={Show.seasons}
            network={Show.network}
          />
        ))}
      </GridContainer>
    </>
  );
};

export default ShowsPage;
