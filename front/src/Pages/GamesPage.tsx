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
        const data = await response.json();
        setGames(data); // Set the Games data received from the backend
        setLoading(false); // Data has been fetched, stop loading
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchGames();
  }, []); // Empty dependency array, runs only on mount

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error sadfadsf: {error.message}</div>}
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
