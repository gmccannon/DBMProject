interface Media {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    author?: string;
    publisher?: string;
    release_year?: number;
    director?: string;
    writer?: string;
    seasons?: number;
    network?: string;
    genre_id?: number;
}

interface MediaCardProps {
    content: MediaContent;
    mediaType: string;
}
