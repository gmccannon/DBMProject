import React from 'react';
import styled from 'styled-components';
import Header from '../Components/Header';
import GameCard from '../Components/GamesCard';

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
`;

// Dummy data for demonstration
const Gameshows = [
    { id: 1, image: '/path-to-image1.jpg', title: 'Game Title 1', subtitle: 'Subtitle 1' },
    { id: 2, image: '/path-to-image2.jpg', title: 'Game Title 2', subtitle: 'Subtitle 2' },
    { id: 2, image: '/path-to-image2.jpg', title: 'Game Title 2', subtitle: 'Subtitle 2' },
    // Add more Game as needed
];

function GamesPage() {
    return (
    <>
      <Header mediaType={'Games'}/>
      <GridContainer>
        {Gameshows.map(games => (
            <GameCard key={games.id} image={games.image} title={games.title} subtitle={games.subtitle} />
        ))}
      </GridContainer>
    </> 
    );
}

export default GamesPage;