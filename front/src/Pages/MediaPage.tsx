import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MediaCard from '../Components/MediaCard';
import axios from 'axios';

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
    margin-bottom: 20px;
`;

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
`;

const SearchInput = styled.input`
    font-family: 'Courier New';
    padding: 10px;
    width: 35%;
    margin-right: 10px;
    font-size: 16px;
`;

const OrderSelect = styled.select`
    font-family: 'Courier New';
    padding: 10px;
    font-size: 16px;
    background-color: white;
`;

// Function to fetch media data with the search query
const fetchmediaData = async (query: string, table: string, order: string): Promise<Media[]> => {
    // access the database endpoint
    const response = await axios.get('http://localhost:3001/getmedia', {
        params: {
          table: table,
          search: query,
          order: order,
        }
    });

    // handle error
    if (!response.status) {
        throw new Error('Failed to fetch media');
    }

    // returns a list of Media
    return await response.data; 
};

const MediaPage: React.FC<MediaPageProps> = ({mediaType}): JSX.Element => {
    //states
    const [media, setmedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [order, setOrder] = useState<string>('title');

    // Fetch media on initial load and when searchQuery changes
    useEffect((): void => {
        fetchMedia(searchQuery, mediaType, order);
    }, [searchQuery, mediaType, order]); // Trigger re-fetch when searchQuery or page changes

    // function to update states based on info from the database
    const fetchMedia = async (query: string, media: string, order: string): Promise<void> => {
        setLoading(true);
        try {
            const data: Media[] = await fetchmediaData(query, media, order);
            setmedia(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {error && <div>Error: {error.message}</div>}
            <HeaderContainer>
                {/* Page Title */}
                <Title>search for {mediaType.toLowerCase()}...</Title>
                {/* Search Bar */}
                <SearchInput 
                    type="text" 
                    placeholder={`enter a title or keywords`} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                {/* Order Select Dropdown */}
                <OrderSelect 
                    value={order} 
                    onChange={(e) => setOrder(e.target.value)}
                >
                    <option value="title">Title</option>
                    <option value="release_date">Release Date</option>
                </OrderSelect>
            </HeaderContainer>
            <GridContainer>
                {media.map(media => (
                    <MediaCard
                        key={media.id}
                        content={media}
                        mediaType={mediaType}
                    />
                ))}
            </GridContainer>
        </>
    );
};

export default MediaPage;
