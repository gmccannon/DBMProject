import React from 'react';
import styled from 'styled-components';
import Header from '../Components/Header';
import TVCard from '../Components/TVCard';

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
`;

// Dummy data for demonstration
const tvshows = [
    { id: 1, image: '/path-to-image1.jpg', title: 'TV Title 1', subtitle: 'Subtitle 1' },
    { id: 2, image: '/path-to-image2.jpg', title: 'TV Title 2', subtitle: 'Subtitle 2' },
    // Add more TV as needed
];

function TVPage() {
    return (
    <>
      <Header mediaType={'TV Shows'}/>
      <GridContainer>
        {tvshows.map(tvshows => (
            <TVCard key={tvshows.id} image={tvshows.image} title={tvshows.title} subtitle={tvshows.subtitle} />
        ))}
      </GridContainer>
    </> 
    );
}

export default TVPage;