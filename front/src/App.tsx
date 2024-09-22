import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import BookCard from './BookCard';

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
    background-color: #f0f0f0;
`;

function App() {
    // Dummy data for demonstration
    const books = [
        { id: 1, image: '/path-to-image1.jpg', title: 'Book Title 1', subtitle: 'Subtitle 1' },
        { id: 2, image: '/path-to-image2.jpg', title: 'Book Title 2', subtitle: 'Subtitle 2' },
        // Add more books as needed
    ];

    return (
        <div>
            <Header />
            <GridContainer>
                {books.map(book => (
                    <BookCard key={book.id} image={book.image} title={book.title} subtitle={book.subtitle} />
                ))}
            </GridContainer>
        </div>
    );
}

export default App;
