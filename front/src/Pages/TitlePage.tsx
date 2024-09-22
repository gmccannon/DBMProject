import React from 'react';
import styled from 'styled-components';

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