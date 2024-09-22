import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
`;

const TVShowsReviewPage = () => {
  const { id } = useParams(); // this extract the id from the URL, not any component!!!!
    return (
    <>
      <h1>Review for TV Show with ID: {id}</h1>
    </> 
    );
}

export default TVShowsReviewPage;