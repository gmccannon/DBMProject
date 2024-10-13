interface Media {
    genre: string;
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
}

interface MediaCardProps {
    content: MediaContent;
    mediaType: string;
}

interface FormComponentProps {
    onFormSubmit: () => void;
}
