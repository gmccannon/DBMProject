import React from 'react';
import styled from 'styled-components';
import Header from '../Components/Header';
import BookCard from '../Components/BookCard';
import TopBar from '../Components/TopBar'

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
    background-color: #f0f0f0;
`;

// Dummy data for demonstration
const books = [
    { id: 1, image: '/path-to-image1.jpg', title: 'Book Title 1', subtitle: 'Subtitle 1' },
    { id: 2, image: '/path-to-image2.jpg', title: 'Book Title 2', subtitle: 'Subtitle 2' },
    // Add more books as needed
];

function BooksPage() {
    return ( <GridContainer>
        {books.map(book => (
            <BookCard key={book.id} image={book.image} title={book.title} subtitle={book.subtitle} />
        ))}
    </GridContainer> );
}

export default BooksPage;