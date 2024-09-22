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
  { "id": 1, "image": "/path-to-image1.jpg", "title": "Game Title 1", "subtitle": "Subtitle 1" },
  { "id": 2, "image": "/path-to-image2.jpg", "title": "Game Title 2", "subtitle": "Subtitle 2" },
  { "id": 3, "image": "/path-to-image3.jpg", "title": "Game Title 3", "subtitle": "Subtitle 3" },
  { "id": 4, "image": "/path-to-image4.jpg", "title": "Game Title 4", "subtitle": "Subtitle 4" },
  { "id": 5, "image": "/path-to-image5.jpg", "title": "Game Title 5", "subtitle": "Subtitle 5" },
  { "id": 6, "image": "/path-to-image6.jpg", "title": "Game Title 6", "subtitle": "Subtitle 6" },
  { "id": 7, "image": "/path-to-image7.jpg", "title": "Game Title 7", "subtitle": "Subtitle 7" },
  { "id": 8, "image": "/path-to-image8.jpg", "title": "Game Title 8", "subtitle": "Subtitle 8" },
  { "id": 9, "image": "/path-to-image9.jpg", "title": "Game Title 9", "subtitle": "Subtitle 9" }
    // Add more Game as needed
];

const GamesPage = () => {
    return (
    <>
      <Header mediaType={'Games'}/>
      <GridContainer>
        {Gameshows.map(games => (
            <GameCard id={games.id} image={games.image} title={games.title} subtitle={games.subtitle} />
        ))}
      </GridContainer>
    </> 
    );
}

export default GamesPage;