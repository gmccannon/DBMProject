interface Media {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    author?: string; // Optional if not all media has an author
    publisher?: string; // Optional if not all media has a publisher
    release_year?: number; // Optional if not all media has a release year
    director?: string; // Optional if not all media has a director
    writer?: string; // Optional if not all media has a writer
    seasons?: number; // Optional if not all media has a seasons property
}
interface MediaCardProps {
    content: MediaContent;
    mediaType: string;
}
