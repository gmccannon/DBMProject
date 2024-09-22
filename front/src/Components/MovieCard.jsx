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

const MovieImage = styled.img`
    width: 100%;
    height: auto;
`;

const MovieTitle = styled.h3`
    font-size: 18px;
    padding: 0 15px;
    color: #333;
`;

const MovieSubtitle = styled.p`
  font-size: 16px;
  color: #666;
  padding: 0 15px 15px 15px;
`;

const MovieCard = ({ id, image, title, subtitle }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/Movies/${id}`);
    };

    return (
    <CardContainer onClick={handleClick} role="button" tabIndex={0}>
        <MovieImage src={image} alt="Movie cover" />
        <MovieTitle>{title}</MovieTitle>
        <MovieSubtitle>{subtitle}</MovieSubtitle>
    </CardContainer>
)};

export default MovieCard;
