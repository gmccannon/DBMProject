// mediaRecommendationEngine.js
import Database from 'better-sqlite3';

const db = new Database('database.db');

/**
 * Fetch all user ratings across all media types.
 * Returns a Map where keys are user IDs and values are Maps of media IDs with types to ratings.
 */
const getUserRatings = () => {
    const reviews = db.prepare(`
        SELECT user_id, media_id, rating, 'game' AS media_type FROM game_reviews
        UNION ALL
        SELECT user_id, media_id, rating, 'movie' AS media_type FROM movie_reviews
        UNION ALL
        SELECT user_id, media_id, rating, 'show' AS media_type FROM show_reviews
        UNION ALL
        SELECT user_id, media_id, rating, 'book' AS media_type FROM book_reviews
    `).all();

    const userRatings = new Map();

    reviews.forEach(review => {
        if (!userRatings.has(review.user_id)) {
            userRatings.set(review.user_id, new Map());
        }
        userRatings.get(review.user_id).set(`${review.media_type}_${review.media_id}`, review.rating);
    });

    return userRatings;
};

/**
 * Find users who interacted with the given media.
 * @param {string} mediaKey - Media type and ID concatenated, e.g., 'book_1'.
 * @param {Map} userRatings - Map of all user ratings.
 * @returns {Array} List of user IDs who interacted with the media.
 */
const getUsersForMedia = (mediaKey, userRatings) => {
    const users = [];
    userRatings.forEach((ratings, userId) => {
        if (ratings.has(mediaKey)) {
            users.push(userId);
        }
    });
    return users;
};

/**
 * Get similar media based on the interactions of users who liked the given media.
 * @param {string} mediaKey - Media type and ID concatenated, e.g., 'book_1'.
 * @param {Array} users - Users who liked the given media.
 * @param {Map} userRatings - Map of all user ratings.
 * @param {number} topN - Number of similar media to return.
 * @returns {Array} List of recommended media keys.
 */
const getSimilarMedia = (mediaKey, users, userRatings, topN = 3) => {
    const mediaScores = new Map();

    users.forEach(userId => {
        const userRatingsMap = userRatings.get(userId);
        userRatingsMap.forEach((rating, otherMediaKey) => {
            if (otherMediaKey !== mediaKey) {
                mediaScores.set(
                    otherMediaKey,
                    (mediaScores.get(otherMediaKey) || 0) + rating
                );
            }
        });
    });

    const sortedMedia = [...mediaScores.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([mediaKey]) => mediaKey);

    return sortedMedia;
};

/**
 * Fetch detailed media information for given media keys.
 * @param {Array} mediaKeys - List of media keys to fetch details for.
 * @returns {Array} List of media details.
 */
const fetchMediaDetails = (mediaKeys) => {
    const mediaDetails = [];

    mediaKeys.forEach(mediaKey => {
        const [mediaType, mediaId] = mediaKey.split('_');
        if (!mediaType || !mediaId) {
            console.error(`Invalid mediaKey format: ${mediaKey}`);
            return;
        }

        let table = '';
        switch (mediaType) {
            case 'game':
                table = 'games';
                break;
            case 'movie':
                table = 'movies';
                break;
            case 'show':
                table = 'shows';
                break;
            case 'book':
                table = 'books';
                break;
            default:
                console.error(`Unknown mediaType: ${mediaType}`);
                return;
        }

        const stmt = db.prepare(`SELECT * FROM ${table} WHERE id = ?`);
        const mediaItem = stmt.get(parseInt(mediaId, 10));
        if (mediaItem) {
            mediaDetails.push({ mediaType, ...mediaItem });
        }
    });

    return mediaDetails;
};

/**
 * Main function to get "users also liked" recommendations.
 * @param {string} mediaType - The type of media (Books, Shows, Movies, Games).
 * @param {number} mediaId - The ID of the media.
 * @param {number} topN - Number of similar media to return.
 * @returns {Array} List of recommended media items.
 */
const getUsersAlsoLiked = (mediaType, mediaId, topN = 3) => {
    const userRatings = getUserRatings();
    const mediaKey = `${mediaType.toLowerCase()}_${mediaId}`;
    const users = getUsersForMedia(mediaKey, userRatings);
    const similarMediaKeys = getSimilarMedia(mediaKey, users, userRatings, topN);
    const recommendations = fetchMediaDetails(similarMediaKeys);
    return recommendations;
};

export default {
    getUsersAlsoLiked
};
