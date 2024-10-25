interface Media {
    genre: string;
    id: number;
    image: string;
    title: string;
    subtitle: string;
    release_date?: string;
    maker?: string;
    rating?: number;
}

interface MediaCardProps {
    content: MediaContent;
    mediaType: string;
}

interface FormComponentProps {
    endpoint: string;
    onFormSubmit: () => void;
    mediaType: string;
}
