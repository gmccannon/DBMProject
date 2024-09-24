import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../Components/Header';
import MovieCard from '../Components/MovieCard';

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
`;

// Define the Movie type based on your schema
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

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show error state
  }

  return (
    <>
      <Header mediaType={'Movies'} />
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
