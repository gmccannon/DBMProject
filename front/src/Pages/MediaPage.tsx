// MediaPage.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MediaCard from '../Components/MediaCard';
import axios, { AxiosResponse } from 'axios';
import { Media } from './mediaTypes'; // Adjust the import path as needed

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
    width: 30%;
    margin-right: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 3px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #666;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
`;

const OrderSelect = styled.select`
    font-family: 'Courier New';
    width: 7%; /* Match width with SearchInput */
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 3px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        outline: none;
        border-color: #666;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
`;

const OrderOption = styled.option`
    font-family: 'Courier New';
    font-size: 16px;
    color: #333;
`;

interface MediaPageProps {
    mediaType: string;
}

// Function to fetch media data with the search query
const fetchMediaData = async (query: string, table: string, order: string): Promise<Media[]> => {
    try {
        const response: AxiosResponse<Media[]> = await axios.get('http://localhost:3001/getmedia', {
            params: {
                table: table,
                search: query,
                order: order,
            }
        });

        // Check if response data is valid
        if (response.status !== 200) {
            throw new Error('Failed to fetch media');
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

const MediaPage: React.FC<MediaPageProps> = ({ mediaType }): React.JSX.Element => {
    // States
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [order, setOrder] = useState<string>('title');

    // Fetch media on initial load, searchQuery change, or order change
    useEffect((): void => {
        const fetchMedia = async () => {
            setLoading(true);
            try {
                const data: Media[] = await fetchMediaData(searchQuery, mediaType, order);
                setMedia(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, [searchQuery, mediaType, order]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {error && <div>Error: {error.message}</div>}
            <HeaderContainer>
                {/* Page Title */}
                <Title>Search for {mediaType.toLowerCase()}...</Title>
                {/* Search Bar */}
                <SearchInput
                    type="text"
                    placeholder="Enter a title or keywords"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* Order Select Dropdown */}
                <OrderSelect
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                >
                    <OrderOption value="title">Title</OrderOption>
                    <OrderOption value="release_date">Release Date</OrderOption>
                </OrderSelect>
            </HeaderContainer>
            {/* Media Area */}
            <GridContainer>
                {media.length > 0 ? (
                    media.map((item) => (
                        <MediaCard
                            key={item.id}
                            content={item}
                            mediaType={mediaType}
                        />
                    ))
                ) : (
                    <div>No media found.</div>
                )}
            </GridContainer>
        </>
    );
};

export default MediaPage;
