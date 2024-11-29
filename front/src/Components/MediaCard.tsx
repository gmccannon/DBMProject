import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Rating  from '@mui/material/Rating';

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
    text-overflow: ellipsis;
    overflow: hidden;
    margin-bottom: 0px;
    white-space: nowrap;
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {content.maker && <Maker>{content.maker}</Maker>}
                {content.rating && content.rating !== 0 && (
                    <Rating style={{ marginRight: '10px' }} value={content.rating} precision={0.25} readOnly />
                )}
            </div>


        </CardContainer>
    );
};

export default MediaCard;
