import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
    text-align: center;
    padding: 20px;
    background-color: white;
`;

const Title = styled.h1`
    font-size: 32px;
    color: #333;
    margin-bottom: 20px;  // Space between title and search bar
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 50%;
  margin-right: 10px;
  font-size: 16px;
`;

const Header = () => (
    <HeaderContainer>
        <Title>Search For Books</Title>
        <SearchInput type="text" placeholder="Search for books..." />
        {/* Add more UI elements if needed */}
    </HeaderContainer>
);

export default Header;
