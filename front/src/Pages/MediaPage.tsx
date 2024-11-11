import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MediaCard from '../Components/MediaCard';
import { Pagination } from '@mui/material';
import { fetchMediaCardData } from '../lib/actions';

const HeaderContainer = styled.div`
    text-align: center;
    padding-bottom: 20px;
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
    width: 9%; /* Match width with SearchInput */
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

const MediaPage: React.FC<MediaPageProps> = ({mediaType}): React.JSX.Element => {
    //states
    const [media, setmedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [order, setOrder] = useState<string>('rating desc');
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the total number of pages and get the items for the current page
    const itemsPerPage = 12;
    const totalPages = Math.ceil(media.length / itemsPerPage);
    const currentMedia = media.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Fetch media on initial load, page, searchQuery, order, and page pagination change
    useEffect((): void => {
        fetchMedia(searchQuery, mediaType, order);
    }, [searchQuery, mediaType, order, currentPage]);

    // function to update states based on info from the database
    const fetchMedia = async (query: string, media: string, order: string): Promise<void> => {
        setLoading(true);
        try {
            const data: Media[] = await fetchMediaCardData(query, media, order);
            setmedia(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (event: any, value: React.SetStateAction<number>) => {
        setCurrentPage(value);
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
                    {/* NOTE: what is placed in the value tag here is what goes into the sql query after ORDER
                    thus, specify the exact column name to order and append (space) desc if nessessary */}
                    <OrderOption value="title">title</OrderOption>
                    <OrderOption value="rating desc">rating(high)</OrderOption>
                    <OrderOption value="rating">rating(low)</OrderOption>
                    <OrderOption value="release_date desc">release(new)</OrderOption>
                    <OrderOption value="release_date">release(old)</OrderOption>
                </OrderSelect>
            </HeaderContainer>

            {/* Media Area*/}
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                shape="rounded"
                style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', fontFamily: 'Courier New' }}
            />
            <GridContainer>
                {currentMedia.map(media => (
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
