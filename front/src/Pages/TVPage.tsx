import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ShowCard from '../Components/TVCard';

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
  const [searchQuery, setSearchQuery] = useState<string>(''); // State to manage search input

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

  // Filter Shows based on search query
  const filteredShows = Shows.filter(Show => 
    Show.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error sadfadsf: {error.message}</div>}
      <HeaderContainer>
        <Title>Search for Shows...</Title>
        <SearchInput 
          type="text" 
          placeholder={`Enter a title or keywords`} 
          value={searchQuery} // Set the input value to the search query
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
      </HeaderContainer>
      <GridContainer>
        {filteredShows.map(Show => (
          <ShowCard
            key={Show.show_id}
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
