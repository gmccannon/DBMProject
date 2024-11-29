// recommendationEngine.js
import Database from 'better-sqlite3';

const db = new Database('database.db');

/**
 * Fetch all user ratings across all media types.
 * Returns a Map where keys are user IDs and values are Maps of media IDs to ratings.
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
 * Calculate similarity between two users using Pearson Correlation.
 * @param {Map} ratingsA
 * @param {Map} ratingsB
 * @returns {number} Similarity score between -1 and 1
 */
const calculatePearsonCorrelation = (ratingsA, ratingsB) => {
    const commonKeys = [...ratingsA.keys()].filter(key => ratingsB.has(key));

    const n = commonKeys.length;
    if (n === 0) return 0;

    let sumA = 0, sumB = 0, sumA_sq = 0, sumB_sq = 0, sumAB = 0;

    commonKeys.forEach(key => {
        const a = ratingsA.get(key);
        const b = ratingsB.get(key);
        sumA += a;
        sumB += b;
        sumA_sq += a * a;
        sumB_sq += b * b;
        sumAB += a * b;
    });

    const numerator = (n * sumAB) - (sumA * sumB);
    const denominator = Math.sqrt((n * sumA_sq - sumA * sumA) * (n * sumB_sq - sumB * sumB));

    if (denominator === 0) return 0;

    return numerator / denominator;
};

/**
 * Generate recommendations for a specific user based on User-Based Collaborative Filtering.
 * @param {number} targetUserId
 * @param {Map} userRatings
 * @param {number} topN
 * @returns {Array} List of recommended media IDs with media type
 */
const generateRecommendations = (targetUserId, userRatings, topN = 10) => {
    const targetRatings = userRatings.get(targetUserId);
    if (!targetRatings) return [];

    const similarities = [];

    userRatings.forEach((ratings, userId) => {
        if (userId !== targetUserId) {
            const sim = calculatePearsonCorrelation(targetRatings, ratings);
            if (sim > 0) { // Consider only positive similarities
                similarities.push({ userId, similarity: sim });
            }
        }
    });

    // Sort users by similarity descending
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Select top similar users
    const topSimilarUsers = similarities.slice(0, 20); // Adjust the number as needed

    const recommendationScores = new Map();
    const similaritySums = new Map();

    topSimilarUsers.forEach(({ userId, similarity }) => {
        const userRatingsMap = userRatings.get(userId);
        userRatingsMap.forEach((rating, mediaKey) => {
            if (!targetRatings.has(mediaKey)) {
                const currentScore = recommendationScores.get(mediaKey) || 0;
                const currentSum = similaritySums.get(mediaKey) || 0;
                recommendationScores.set(mediaKey, currentScore + (rating * similarity));
                similaritySums.set(mediaKey, currentSum + similarity);
            }
        });
    });

    // Calculate predicted ratings
    const predictedRatings = [];
    recommendationScores.forEach((score, mediaKey) => {
        const sumSim = similaritySums.get(mediaKey);
        const predictedRating = score / sumSim;
        predictedRatings.push({ mediaKey, predictedRating });
    });

    // Sort predictions by predicted rating descending
    predictedRatings.sort((a, b) => b.predictedRating - a.predictedRating);

    // Return top N recommendations
    return predictedRatings.slice(0, topN).map(item => item.mediaKey);
};

/**
 * Fetch detailed media information given media keys.
 * @param {Array} mediaKeys
 * @returns {Array} List of media details
 */
const fetchMediaDetails = (mediaKeys) => {
    const mediaDetails = [];

    mediaKeys.forEach(mediaKey => {
        const [mediaType, mediaId] = mediaKey.split('_');
        if (!mediaType || !mediaId) {
            console.error(`Invalid mediaKey format: ${mediaKey}`);
            return; // Skip invalid keys
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
                return; // Skip unknown media types
        }

        const stmt = db.prepare(`SELECT * FROM ${table} WHERE id = ?`);
        const mediaItem = stmt.get(parseInt(mediaId, 10));
        if (mediaItem) {
            mediaDetails.push({ mediaType, ...mediaItem });
        } else {
            console.warn(`Media item not found: type=${mediaType}, id=${mediaId}`);
        }
    });

    return mediaDetails;
};

/**
 * Main function to get recommendations for a user.
 * @param {number} userId
 * @param {number} topN
 * @returns {Array} List of recommended media items
 */
const getRecommendationsForUser = (userId, topN = 10) => {
    const userRatings = getUserRatings();
    const recommendedMediaKeys = generateRecommendations(userId, userRatings, topN);
    const recommendedMedia = fetchMediaDetails(recommendedMediaKeys);
    return recommendedMedia;
};

export default {
    getRecommendationsForUser
};
