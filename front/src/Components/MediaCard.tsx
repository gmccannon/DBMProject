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
    font-style: italic;
    padding-left: 10px;
`;

const Maker = styled.h3`
    font-family: 'Courier New';
    font-size: 16px;
    font-weight: 400;
    color: #333;
    margin-bottom: 20px;
    padding-left: 10px;
`;

const Image = styled.img`
    width: 100%;
    height: 80%;
`;

const MediaCard: React.FC<MediaCardProps> = ({ content, mediaType }) => {
    const navigate = useNavigate();

    // Function to handle navigation to individual media's info page
    const handleClick = () => {
        navigate(`/${mediaType}/${content.id}`);
    };

    // Function to determine image path based on mediaType and mediaNumber
    const getImagePath = () => {
        // Images are stored in public/images/{mediaType}{content.id}.jpg
        return `/images/${mediaType}${content.id}.jpg`;
    };

    return (
        <CardContainer onClick={handleClick} role="button" tabIndex={0}>
            <Image src={getImagePath()} alt={`${content.title} cover`} />
            {content.title && <Title>{content.title}</Title>}
            {content.maker && <Maker>{content.maker}</Maker>}
        </CardContainer>
    );
};

export default MediaCard;
