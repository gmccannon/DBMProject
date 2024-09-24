import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../Components/Header';
import GameCard from '../Components/GamesCard';

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
`;

// Define the Game type based on your schema
type Game = {
  game_id: number;
  title: string;
  subtitle: string;
  release_year: string;
  publisher: string;
};

const GamesPage = () => {
  const [Games, setGames] = useState<Game[]>([]); // State to store Games data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState<Error | null>(null); // State to manage error

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:3001/games');
        if (!response.ok) {
          throw new Error('There was an error fetching the data');
        }
        const data = await response.json();
        setGames(data); // Set the Games data received from the backend
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

    fetchGames();
  }, []); // Empty dependency array, runs only on mount

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show error state
  }

  return (
    <>
      <Header mediaType={'Games'} />
      <GridContainer>
        {Games.map(Game => (
          <GameCard
            id={Game.game_id}
            image={`/path-to-image-placeholder.jpg`}
            title={Game.title}
            publisher={Game.publisher}
            release_year={Game.release_year}
          />
        ))}
      </GridContainer>
    </>
  );
};

export default GamesPage;
