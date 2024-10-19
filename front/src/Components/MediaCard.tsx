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

const Title = styled.h3`
    font-family: 'Courier New';
    font-size: 16px;
    font-weight: 2000;
    color: #333;
    margin-bottom: 20px;
`;

const Image = styled.img`
    width: 100%;
    height: auto;
`;

const MediaCard: React.FC<MediaCardProps> = ({ content, mediaType }) => {
    // use navigation method from react router
    const navigate = useNavigate();

    // function to navigate to individual media's info page 
    const handleClick = () => {
        navigate(`/${mediaType}/${content.id}`);
    };
    
    return (
    <CardContainer onClick={handleClick} role="button" tabIndex={0}>
        {content.image &&<Image src={content.image} alt="Book cover" />}
        {content.title &&<Title>{content.title}</Title>}

        {content.maker &&<Title>{content.maker}</Title>}
    </CardContainer>
)};

export default MediaCard;
