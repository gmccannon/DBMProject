import sqlite3
from collections import defaultdict

def get_user_ratings():
    """
    Fetch all user ratings across all media types from the database.
    Returns a dictionary where keys are user IDs, and values are dictionaries
    of media keys (e.g., 'book_1') mapped to ratings.
    """
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    query = """
        SELECT user_id, media_id, rating, 'game' AS media_type FROM game_reviews
        UNION ALL
        SELECT user_id, media_id, rating, 'movie' AS media_type FROM movie_reviews
        UNION ALL
        SELECT user_id, media_id, rating, 'show' AS media_type FROM show_reviews
        UNION ALL
        SELECT user_id, media_id, rating, 'book' AS media_type FROM book_reviews
    """
    cursor.execute(query)
    reviews = cursor.fetchall()
    conn.close()

    user_ratings = defaultdict(dict)
    for user_id, media_id, rating, media_type in reviews:
        media_key = f"{media_type}_{media_id}"
        user_ratings[user_id][media_key] = rating
    return user_ratings

def calculate_error(predicted, ground_truth):
    """
    Calculate the recommendation error using mean absolute error (MAE).
    :param predicted: List of predicted media keys.
    :param ground_truth: List of ground truth media keys.
    :return: Error value (MAE).
    """
    hits = len(set(predicted) & set(ground_truth))
    total = len(ground_truth)
    return 1 - (hits / total) if total > 0 else 1

def evaluate_recommendations(user_ratings, ground_truth):
    """
    Evaluate the recommendation engine's performance.
    :param user_ratings: User ratings dictionary.
    :param ground_truth: Predefined dictionary of ground truth recommendations.
    :return: Average error across all users.
    """
    total_error = 0
    user_count = 0

    for user_id, user_ground_truth in ground_truth.items():
        if user_id not in user_ratings:
            continue

        # pick highest-rated media items to make it simple
        user_rated_media = user_ratings[user_id]
        predicted = sorted(user_rated_media.keys(), key=lambda k: user_rated_media[k], reverse=True)[:len(user_ground_truth)]
        
        # Calculate error
        error = calculate_error(predicted, user_ground_truth)
        total_error += error
        user_count += 1

    return total_error / user_count if user_count > 0 else 1

if __name__ == "__main__":
    user_ratings = get_user_ratings()

    """
    Fetch all the real reviews
    """
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    query = """
        SELECT AVG(rating) AS average_rating FROM books
        UNION ALL
        SELECT AVG(rating) AS average_rating FROM games
        UNION ALL
        SELECT AVG(rating) AS average_rating FROM shows
        UNION ALL
        SELECT AVG(rating) AS average_rating FROM movies
    """
    cursor.execute(query)
    ground_truth = cursor.fetchall()
    conn.close()

    # Evaluate the recommendations
    avg_error = evaluate_recommendations(user_ratings, ground_truth)
    print(f"Average Recommendation Error: {avg_error:.2f}")
