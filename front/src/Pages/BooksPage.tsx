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

// Dummy data for demonstration
const books = [
    { id: 1, image: '/path-to-image1.jpg', title: 'Book Title 1', subtitle: 'Subtitle 1' },
    { id: 2, image: '/path-to-image2.jpg', title: 'Book Title 2', subtitle: 'Subtitle 2' },
    { id: 3, image: '/path-to-image1.jpg', title: 'Book Title 1', subtitle: 'Subtitle 1' },
    { id: 4, image: '/path-to-image2.jpg', title: 'Book Title 2', subtitle: 'Subtitle 2' },
    { id: 5, image: '/path-to-image1.jpg', title: 'Book Title 1', subtitle: 'Subtitle 1' },
    { id: 6, image: '/path-to-image2.jpg', title: 'Book Title 2', subtitle: 'Subtitle 2' },
    { id: 7, image: '/path-to-image1.jpg', title: 'Book Title 1', subtitle: 'Subtitle 1' },
    { id: 8, image: '/path-to-image2.jpg', title: 'Book Title 2', subtitle: 'Subtitle 2' },
    { id: 9, image: '/path-to-image1.jpg', title: 'Book Title 1', subtitle: 'Subtitle 1' },
    // Add more books as needed
];

function BooksPage() {
    return (
    <>
      <Header mediaType={'Books'}/>
      <GridContainer>
        {books.map(book => (
            <BookCard key={book.id} image={book.image} title={book.title} subtitle={book.subtitle} />
        ))}
      </GridContainer>
    </> 
    );
}

export default BooksPage;