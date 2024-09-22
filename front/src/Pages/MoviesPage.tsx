import React from 'react';
import styled from 'styled-components';
import Header from '../Components/Header';
import MovieCard from '../Components/MovieCard';

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
    background-color: #f0f0f0;
`;

// Dummy data for demonstration
const movies = [
    { id: 1, image: '/path-to-image1.jpg', title: 'Movie Title 1', subtitle: 'Subtitle 1' },
    { id: 2, image: '/path-to-image2.jpg', title: 'Movie Title 2', subtitle: 'Subtitle 2' },
    // Add more Movies as needed
];

function MoviesPage() {
    return (
    <>
    <Header mediaType={'Movies'}/>
    <GridContainer>
        {movies.map(movie => (
            <MovieCard key={movie.id} image={movie.image} title={movie.title} subtitle={movie.subtitle} />
        ))}
    </GridContainer>
    </> );
}

export default MoviesPage;