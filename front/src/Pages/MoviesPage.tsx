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

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error sadfadsf: {error.message}</div>}
      <HeaderContainer>
        <Title>search for movies...</Title>
        <SearchInput type="text" placeholder={`enter a title or keywords`} />
      </HeaderContainer>
      <GridContainer>
        {Movies.map(Movie => (
          <MovieCard
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
