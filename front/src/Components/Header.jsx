import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
    text-align: center;
    padding: 20px;
    background-color: white;
`;

const Title = styled.h1`
    font-family: 'Helvetica';
    font-size: 32px;
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

const Header = ({mediaType}) => (
    <HeaderContainer>
        <Title>Search For {mediaType}</Title>
        <SearchInput type="text" placeholder={`Search for ${mediaType}...`} />
        {/* Add more UI elements if needed */}
    </HeaderContainer>
);

export default Header;
