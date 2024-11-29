//custom.d.ts
interface Media {
    mediaType: any;
    genre: string;
    id: number;
    image: string;
    title: string;
    subtitle: string;
    release_date?: string;
    maker?: string;
    rating?: number;
    media_type: string;
    mediaType: string;
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

interface ChangeBioFormComponentProps {
    onFormSubmit: () => void;
    currentBio: string;
}

interface Review {
    userID: number;
    title: string;
    username: string;
    media_id: number;
    media_type: string;
    rating: number;
    summary: string;
    text: string;
    posted_on: string;
    media_title: string;
}

interface User {
    id: number;
    username: string;
    bio: string;
    joined_on: string;
    fav_game_title?: string;
    fav_book_title?: string;
    fav_show_title?: string;
    fav_movie_title?: string;
    reviews: Review[]; // Ensure this line is present
}

interface MediaReview {
    userID: number;
    title: string;
    username: string;
    media_id: number;
    media_type: string;
    rating: number;
    summary: string;
    text: string;
    posted_on: string;
    media_title: string;
}