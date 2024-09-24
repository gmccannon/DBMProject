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
  show_id: number;
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
        const data = await response.json();
        setShows(data); // Set the Shows data received from the backend
        setLoading(false); // Data has been fetched, stop loading
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
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
            id={Show.show_id}
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
