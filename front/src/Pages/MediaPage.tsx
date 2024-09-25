import React, { useState } from 'react';
import styled from 'styled-components';
import MediaCard from '../Components/MediaCard';

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

const SearchInput = styled.input`
    font-family: 'Courier New';
    padding: 10px;
    width: 50%;
    margin-right: 10px;
    font-size: 16px;
`;

const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
`;

// Function to fetch media data with an optional search query
const fetchmediaData = async (query: string, media: string): Promise<Media[]> => {
    const response = await fetch(`http://localhost:3001/${media}?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch media');
    }
    return await response.json();
};

const MediaPage: React.FC<MediaPageProps> = ({mediaType}) => {
    const [media, setmedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const fetchMedia = async (query: string, media: string) => {
        setLoading(true);
        try {
            const data = await fetchmediaData(query, media);
            setmedia(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setLoading(false);
        }
    };

    // Fetch media on initial load and when searchQuery changes
    React.useEffect(() => {
        fetchMedia(searchQuery, mediaType);
    }, [searchQuery]); // Trigger re-fetch when searchQuery changes

    return (
        <>
            {error && <div>Error: {error.message}</div>}
            <HeaderContainer>
                <Title>search for {mediaType.toLowerCase()}...</Title>
                <SearchInput 
                    type="text" 
                    placeholder={`Enter a title or keywords`} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
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