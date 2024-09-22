import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CardContainer = styled.div`
    width: 350px;
    height: 500px;
    margin: 15px;
    border: 1px solid #ddd;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transition: transform 0.2s;
    &:hover {
        transform: translateY(-8px);
    }
`;

const BookImage = styled.img`
    width: 100%;
    height: auto;
`;

const BookTitle = styled.h3`
    font-size: 18px;
    padding: 0 15px;
    color: #333;
`;

const BookSubtitle = styled.p`
  font-size: 16px;
  color: #666;
  padding: 0 15px 15px 15px;
`;

const BookCard = ({ id, image, title, subtitle }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/Books/${id}`);
    };

    return (
    <CardContainer onClick={handleClick} role="button" tabIndex={0}>
        <BookImage src={image} alt="Book cover" />
        <BookTitle>{title}</BookTitle>
        <BookSubtitle>{subtitle}</BookSubtitle>
    </CardContainer>
)};

export default BookCard;
