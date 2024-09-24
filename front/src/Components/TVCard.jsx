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

const TVImage = styled.img`
    width: 100%;
    height: auto;
`;

const TVTitle = styled.h3`
    font-size: 18px;
    padding: 0 15px;
    color: #333;
`;

const TVSubtitle = styled.p`
  font-size: 16px;
  color: #666;
  padding: 0 15px 15px 15px;
`;

const TVCard = ({ id, image, title, seasons, writer, network }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/TVShows/${id}`);
    };

    return (
    <CardContainer onClick={handleClick} role="button" tabIndex={0}>
        <TVImage src={image} alt="TV cover" />
        <TVTitle>{title}</TVTitle>
        <TVSubtitle>{seasons} Seasons</TVSubtitle>
        <TVSubtitle>{writer}</TVSubtitle>
        <TVSubtitle>{network}</TVSubtitle>
    </CardContainer>
)};

export default TVCard;