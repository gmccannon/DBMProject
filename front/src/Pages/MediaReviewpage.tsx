import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const MediaReviewPage: React.FC<MediaReviewPageProps> = ({mediaType}) => {
  const { id } = useParams(); // this extract the id from the URL, not any component!!!!
    return (
    <>
      <h1>Review for {mediaType} with ID: {id}</h1>
    </> 
    );
}

export default MediaReviewPage;
