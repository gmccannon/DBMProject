import React from 'react';
import styled from 'styled-components';
import Header from '../Components/Header';
import MovieCard from '../Components/MovieCard';

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
`;

// Dummy data for demonstration
const movies = [
  { "id": 1, "image": "/path-to-image1.jpg", "title": "Movie Title 1", "subtitle": "Subtitle 1" },
  { "id": 2, "image": "/path-to-image2.jpg", "title": "Movie Title 2", "subtitle": "Subtitle 2" },
  { "id": 3, "image": "/path-to-image3.jpg", "title": "Movie Title 3", "subtitle": "Subtitle 3" },
  { "id": 4, "image": "/path-to-image4.jpg", "title": "Movie Title 4", "subtitle": "Subtitle 4" },
  { "id": 5, "image": "/path-to-image5.jpg", "title": "Movie Title 5", "subtitle": "Subtitle 5" },
  { "id": 6, "image": "/path-to-image6.jpg", "title": "Movie Title 6", "subtitle": "Subtitle 6" },
  { "id": 7, "image": "/path-to-image7.jpg", "title": "Movie Title 7", "subtitle": "Subtitle 7" },
  { "id": 8, "image": "/path-to-image8.jpg", "title": "Movie Title 8", "subtitle": "Subtitle 8" },
  { "id": 9, "image": "/path-to-image9.jpg", "title": "Movie Title 9", "subtitle": "Subtitle 9" }
    // Add more Movies as needed
];

const MoviesPage = () => {
    return (
    <>
      <Header mediaType={'Movies'}/>
      <GridContainer>
        {movies.map(movie => (
            <MovieCard id={movie.id} image={movie.image} title={movie.title} subtitle={movie.subtitle}/>
        ))}
      </GridContainer>
    </> );
}

export default MoviesPage;