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

const MediaCard: React.FC<MediaCardProps> = ({ content, mediaType }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${mediaType}/${content.id}`);
    };

    return (
    <CardContainer onClick={handleClick} role="button" tabIndex={0}>
        {content.image &&<BookImage src={content.image} alt="Book cover" />}
        {content.title &&<BookTitle>{content.title}</BookTitle>}
        {content.subtitle &&<BookSubtitle>{content.subtitle}</BookSubtitle>}
        {content.author &&<BookSubtitle>{content.author}</BookSubtitle>}
        {content.publisher &&<BookSubtitle>{content.publisher}</BookSubtitle>}
        {content.release_year &&<BookSubtitle>{content.release_year}</BookSubtitle>}
        {content.director &&<BookSubtitle>{content.director}</BookSubtitle>}
        {content.writer &&<BookSubtitle>{content.writer}</BookSubtitle>}
        {content.seasons && <BookSubtitle>{content.seasons} seasons</BookSubtitle>}
        {content.network && <BookSubtitle>{content.network}</BookSubtitle>}
    </CardContainer>
)};

export default MediaCard;
