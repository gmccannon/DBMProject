import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MovieCard from '../Components/MovieCard';

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

type Movie = {
  movie_id: number;
  title: string;
  subtitle: string;
  release_year: string;
  director: string;
};

const MoviesPage = () => {
  const [Movies, setMovies] = useState<Movie[]>([]); // State to store Movies data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState<Error | null>(null); // State to manage error
  const [searchQuery, setSearchQuery] = useState<string>(''); // State to manage search input

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:3001/Movies');
        const data = await response.json();
        setMovies(data); // Set the Movies data received from the backend
        setLoading(false); // Data has been fetched, stop loading
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchMovies();
  }, []); // Empty dependency array, runs only on mount

    // Filter Movies based on search query
    const filteredMovies = Movies.filter(Movie => 
      Movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error sadfadsf: {error.message}</div>}
      <HeaderContainer>
        <Title>Search for Movies...</Title>
        <SearchInput 
          type="text" 
          placeholder={`Enter a title or keywords`} 
          value={searchQuery} // Set the input value to the search query
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
      </HeaderContainer>
      <GridContainer>
        {filteredMovies.map(Movie => (
          <MovieCard
            key={Movie.movie_id}
            id={Movie.movie_id}
            image={`/path-to-image-placeholder.jpg`}
            title={Movie.title}
            director={Movie.director}
            release_year={Movie.release_year}
          />
        ))}
      </GridContainer>
    </>
  );
};

export default MoviesPage;
