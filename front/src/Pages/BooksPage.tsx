import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BookCard from '../Components/BookCard';

const HeaderContainer = styled.div`
    text-align: center;
    padding: 20px;
    background-color: white;
`;

const Title = styled.h1`
    font-family: 'Courier New';
    font-size: 32px;
    font-weight: 500;
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

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
`;

type Book = {
  book_id: number;
  title: string;
  subtitle: string;
  author: string;
  publisher: string;
};

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]); // State to store books data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState<Error | null>(null); // State to manage error

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3001/books');
        const data = await response.json();
        setBooks(data); // Set the books data received from the backend
        setLoading(false); // Data has been fetched, stop loading
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchBooks();
  }, []); // Empty dependency array, runs only on mount

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error sadfadsf: {error.message}</div>}
      <HeaderContainer>
        <Title>search for books...</Title>
        <SearchInput type="text" placeholder={`enter a title or keywords`} />
      </HeaderContainer>
      <GridContainer>
        {books.map(book => (
          <BookCard
            id={book.book_id}
            image={`/path-to-image-placeholder.jpg`}
            title={book.title}
            subtitle={book.subtitle}
            author={book.author}
            publisher={book.publisher}
          />
        ))}
      </GridContainer>
    </>
  );
};

export default BooksPage;
