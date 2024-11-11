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
}

interface User {
    id: number;
    username: string;
    bio: number;
    joined_on: string;
    fav_game: number;
    fav_book: number;
    fav_movie: number;
    fav_show: number;
    fav_genre: number;
}
