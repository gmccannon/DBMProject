import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GameCard from '../Components/GamesCard';

const HeaderContainer = styled.div`
    text-align: center;
    padding: 20px;
    background-color: white;
`;

const Title = styled.h1`
    font-family: 'Courier New';
    font-size: 32px;
    font-weight: 500;
    color: #333;
    margin-bottom: 20px;  // Space between title and search bar
`;

const SearchInput = styled.input`
  font-family: 'Courier New';
  padding: 10px;
  width: 50%;
  margin-right: 10px;
  font-size: 16px;
`;

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
`;

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
  const [searchQuery, setSearchQuery] = useState<string>(''); // State to manage search input

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

    // Filter games based on search query
    const filteredGames = Games.filter(Game => 
      Game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <HeaderContainer>
        <Title>Search for games...</Title>
        <SearchInput 
          type="text" 
          placeholder={`Enter a title or keywords`} 
          value={searchQuery} // Set the input value to the search query
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
      </HeaderContainer>
      <GridContainer>
        {filteredGames.map(Game => (
          <GameCard
            key={Game.game_id}
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
