// MediaCard.tsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Media } from '../Pages/mediaTypes'; // Adjust the import path as needed

const CardContainer = styled.div`
    width: 350px;
    height: 500px;
    margin: 15px;
    border: 1px solid #ddd;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transition: transform 0.2s;
    cursor: pointer;

    &:hover {
        transform: translateY(-8px);
    }
`;

const Image = styled.img`
    width: 100%;
    height: 60%;
    object-fit: cover;
`;

const ContentContainer = styled.div`
    padding: 10px;
    text-align: center;
`;

const Title = styled.h3`
    font-family: 'Courier New';
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin: 10px 0;
`;

const Subtitle = styled.p`
    font-family: 'Courier New';
    font-size: 14px;
    color: #666;
    margin: 5px 0;
`;

interface MediaCardProps {
    content: Media;
    mediaType: string;
}

const MediaCard: React.FC<MediaCardProps> = ({ content, mediaType }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${mediaType}/${content.id}`);
    };

    return (
        <CardContainer onClick={handleClick} role="button" tabIndex={0}>
            {content.image_url ? (
                <Image src={content.image_url} alt={`${content.title} cover`} />
            ) : (
                <Image src="/placeholder.png" alt="Placeholder cover" /> // Use a placeholder image if no image is available
            )}
            <ContentContainer>
                <Title>{content.title}</Title>
                {content.author && <Subtitle>Author: {content.author}</Subtitle>}
                {content.studio && <Subtitle>Studio: {content.studio}</Subtitle>}
                {content.writer && <Subtitle>Writer: {content.writer}</Subtitle>}
                {content.director && <Subtitle>Director: {content.director}</Subtitle>}
            </ContentContainer>
        </CardContainer>
    );
};

export default MediaCard;
