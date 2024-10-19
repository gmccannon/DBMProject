interface Media {
    genre: string;
    id: number;
    image: string;
    title: string;
    subtitle: string;
    release_date?: number;
    maker?: number;
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
