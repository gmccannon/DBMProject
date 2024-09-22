import React from 'react';
import styled from 'styled-components';
import Header from '../Components/Header';
import BookCard from '../Components/BookCard';

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
`;

const  TitlePage = () => {
    return (
    <>
      <GridContainer>Click a button above</GridContainer>
    </> 
    );
}

export default TitlePage;