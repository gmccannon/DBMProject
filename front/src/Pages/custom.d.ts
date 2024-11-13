interface MediaPageProps {
    mediaType: string;
}

interface MediaReviewPageProps {
    mediaType: string;
}

interface MediaReview {
    summary: string;
    text: string;
    rating: number;
    userID: string;
    title: string;
    username: string;
    posted_on: string;
    media_title: string;
}

interface User {
    fav_movie_title: ReactNode;
    id: number;
    username: string;
    bio: number;
    joined_on: string;
    fav_game_id: number;
    fav_book_id: number;
    fav_movie_id: number;
    fav_show_id: number;
    fav_genre_id: number;
    fav_movie_title: string;
    fav_game_title: string;
    fav_show_title: string;
    fav_book_title: string;
    reviews: MediaReview[];
}
