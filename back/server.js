import express, { raw } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import recommendationEngine from './recommendationEngine.js';


const app = express();
const db = new Database('database.db');
const port = 3001;

app.use(cors());
app.use(express.json());

// JWT Configuration
const JWT_SECRET = 'e4c4ac567ad9dd8b9a752f4ead74b53910874790830b9dec0611b20e3f230f598518ce91a356921ae8e252fa5fe6f34bbef04b32d9975a9fb15e0ce38ce60c6d'; // Replace with a strong, unique key
const JWT_EXPIRES_IN = '1h'; // Token expiration time

// CORS Configuration
const CORS_ORIGIN = 'http://localhost:3000'; // frontend's URL

// === Middleware ===
// Configure CORS to allow requests from the frontend's origin
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true, // If you need to send cookies
}));

// To parse JSON bodies
app.use(express.json());

// === Utility Functions ===
// Function to generate JWT tokens
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // The token is expected to be sent in the format: "Bearer TOKEN"
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Token Required' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }
        req.user = user; // Attach user information to the request object
        next();
    });
};


/**
 * @route   GET /recommendations
 * @desc    Get recommended media items for the authenticated user
 * @access  Protected
 */
app.get('/recommendations', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;

        // Generate recommendations
        const recommendedMedia = recommendationEngine.getRecommendationsForUser(userId, 10);

        if (recommendedMedia.length === 0) {
            return res.status(200).json({ message: 'No recommendations available at this time.' });
        }

        res.json({ recommendations: recommendedMedia });
    } catch (error) {
        console.error('Recommendations Error:', error);
        res.status(500).json({ message: 'Error generating recommendations.' });
    }
});

// === Routes ===
/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 */
app.post('/register', (req, res) => {
    try {
        const { username, password } = req.body;
        // Input validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
        // Check if user already exists
        const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists.' });
        }
        // Insert the new user (password stored as plaintext)
        const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
        const info = stmt.run(username, password);
        const user = { id: info.lastInsertRowid, username };
        // Generate JWT
        const token = generateToken(user);
        res.status(201).json({ token });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

/**
 * @route   POST /login
 * @desc    Authenticate user and get token
 * @access  Public
 */
app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        // Input validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
        // Retrieve user from the database
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // Compare passwords (plaintext comparison)
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // Generate JWT
        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

/**
 * @route   GET /protected
 * @desc    Example of a protected route
 * @access  Protected
 */
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}! This is a protected route.` });
});

/**
 * @route   GET /getmedia
 * @desc    Retrieve media based on search query, media type, and order
 * @access  Public
 */
app.get('/getmedia', (req, res) => {
    try {
        // search parameters from the request
        const searchQuery = req.query.search.toLocaleLowerCase() || '';
        const table = req.query.table.toLocaleLowerCase() || '';
        let reviewTable = req.query.table.toLocaleLowerCase().slice(0, -1) + '_reviews' || ''; // Get the proper table name from the request
        let order = req.query.order.toLocaleLowerCase() || '';
        
        // construct the query
        const sql = `SELECT ${table}.*, avg(rating) AS rating FROM ${table}
                    LEFT JOIN ${reviewTable} ON ${reviewTable}.media_id = ${table}.id
                    WHERE title LIKE ? OR maker LIKE ?
                    GROUP BY title
                    ORDER BY ${order}`; 

        // query the database, (use wildcard so that an empty parameter returns all)
        const mediaItems = db.prepare(sql).all(`%${searchQuery}%`, `%${searchQuery}%`);

        // debug log
        console.log(mediaItems)

        // send back database query as json 
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(mediaItems));
    } catch (error) {
        console.error('GetMedia Error:', error);
        res.status(500).send('Error searching for media.');
    }
});

/**
 * @route   GET /ind
 * @desc    Retrieve individual media data by ID
 * @access  Public
 */
app.get('/ind', (req, res) => {
    try {
        let id = req.query.search.toLocaleLowerCase() || ''; // Get the search query from the request
        let table = req.query.table.toLocaleLowerCase() || ''; // Get the table name from the request

        // Validate the table name to prevent SQL injection
        const validTables = ['shows', 'movies', 'books', 'games'];
        if (!validTables.includes(table)) {
            return res.status(400).send('Invalid table name');
        }

        // construct the query
        const sql = `SELECT ${table}.*, genres.genre 
                     FROM ${table} 
                     JOIN genres ON ${table}.genre_id = genres.id 
                     WHERE ${table}.id = ?`;
        const mediaItem = db.prepare(sql).all(id);

        // send back database query as json
        // should only return one item
        res.setHeader('Content-Type', 'application/json');
        res.send(mediaItem[0]);
    } catch (error) {
        console.error('Ind Error:', error);
        res.status(500).send('Error searching for media.');
    }
});

/**
 * @route   GET /review
 * @desc    Retrieve all reviews for a certian media
 * @access  Public
 */
app.get('/review', (req, res) => {
    try {
        let mediaID = req.query.mediaID.toLocaleLowerCase() || ''; // Get the table name from the request

        // the type from the request will come in as 'Books' etc, but needs to be 'book_reviews' etc to get the table
        // TODO: make this not suck
        let table = req.query.mediaType.toLocaleLowerCase().slice(0, -1) + '_reviews' || ''; // Get the proper table name from the request

        // Validate the table name to prevent SQL injection
        const validTables = ['show_reviews', 'movie_reviews', 'book_reviews', 'game_reviews'];
        if (!validTables.includes(table)) {
            return res.status(400).send('Invalid table name');
        }

        // construct the query, join users to display the username of who posted it
        const sql = `SELECT *
                     FROM ${table}
                     JOIN users ON ${table}.user_id = users.id
                     WHERE media_id = ?
                     ORDER BY rating DESC`;
        const mediaItem = db.prepare(sql).all(mediaID);

        // debug log
        console.log(mediaItem)

        // send back database query as json
        // return one, more, or no items
        res.setHeader('Content-Type', 'application/json');
        res.send(mediaItem);
    } catch (error) {
        console.error('Ind Error:', error);
        res.status(500).send('Error searching for reviews.');
    }
});

/**
 * @route   GET /user_review
 * @desc    Return if a user has reviewed a specific media
 * @access  Public
 */
app.get('/user_review', (req, res) => {
    try {
        const mediaID = req.query.mediaID.toLocaleLowerCase() || '';
        const userID = req.query.userID.toLocaleLowerCase() || '';
        const table = req.query.mediaType.toLocaleLowerCase().slice(0, -1) + '_reviews' || '';

        const validTables = ['show_reviews', 'movie_reviews', 'book_reviews', 'game_reviews'];
        if (!validTables.includes(table)) {
            return res.status(400).send('Invalid table name');
        }

        const sql = `SELECT *
                     FROM ${table}
                     WHERE media_id = ? AND user_id = ?`;
        const mediaItem = db.prepare(sql).all(mediaID, userID);

        const hasReviewed = mediaItem.length > 0; // Check if the user has reviewed
        res.json(hasReviewed); // Send back true or false
    } catch (error) {
        console.error('Ind Error:', error);
        res.status(500).send('Error checking for review.');
    }
});

/**
 * @route   GET /user_favorite
 * @desc    Return if a user has favorited a specific media
 * @access  Public
 */
app.get('/user_favorite', (req, res) => {
    try {
        const mediaID = req.query.mediaID.toLocaleLowerCase() || '';
        const userID = req.query.userID.toLocaleLowerCase() || '';
        const columnName = 'fav_' + req.query.mediaType.toLowerCase().slice(0, -1) + '_id' || '';

        const validColumns = ['fav_movie_id', 'fav_show_id', 'fav_book_id', 'fav_game_id'];
        if (!validColumns.includes(columnName)) {
            return res.status(400).send('Invalid table name');
        }

        const sql = `SELECT ${columnName}
                     FROM users
                     WHERE id = ?`;
        const result = db.prepare(sql).all(userID);

        const hasFavorited = result.length > 0 && result[0][columnName] == mediaID; // Check if the user has favorited
        res.json(hasFavorited); // Send back true or false
    } catch (error) {
        console.error('Ind Error:', error);
        res.status(500).send('Error checking for favorite.');
    }
});

/**
 * @route   POST /add_favorite
 * @desc    Add or update a user favorite
 * @access  Public
 */
app.post('/add_favorite', (req, res) => {
    try {
        const mediaID = req.body.mediaID || '';
        const userID = req.body.userID || '';
        const columnName = 'fav_' + req.body.mediaType.toLowerCase().slice(0, -1) + '_id';

        console.log("Received mediaID:", mediaID);
        console.log("Received userID:", userID);
        console.log("Column Name:", columnName);

        const validColumns = ['fav_movie_id', 'fav_show_id', 'fav_book_id', 'fav_game_id'];
        if (!validColumns.includes(columnName)) {
            return res.status(400).send('Invalid media type');
        }

        const sql = `UPDATE users SET ${columnName} = ? WHERE id = ?`;
        const result = db.prepare(sql).run(mediaID, userID);

        // Check if the update was successful
        if (result.changes === 0) {
            return res.status(500).send('Error: No rows were updated. Please check the user ID and try again.');
        }

        // Return success
        res.status(201).json({ message: 'Favorite added/updated successfully' });
    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).send('Error adding favorite.');
    }
});

/**
 * @route   POST /remove_favorite
 * @desc    Remove a user favorite
 * @access  Public
 */
app.post('/remove_favorite', (req, res) => {
    try {
        const userID = req.body.userID || '';
        const columnName = 'fav_' + req.body.mediaType.toLowerCase().slice(0, -1) + '_id';

        console.log("Received userID:", userID);
        console.log("Column Name:", columnName);

        const validColumns = ['fav_movie_id', 'fav_show_id', 'fav_book_id', 'fav_game_id'];
        if (!validColumns.includes(columnName)) {
            return res.status(400).send('Invalid media type');
        }

        const sql = `UPDATE users SET ${columnName} = NULL WHERE id = ?`;
        const result = db.prepare(sql).run(userID);

        console.log("Database update result:", result);

        // Check if the update was successful
        if (result.changes === 0) {
            return res.status(500).send('Error: No rows were updated. Please check the user ID and try again.');
        }

        // Return success
        res.status(201).json({ message: 'Favorite removed successfully' });
    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).send('Error adding favorite.');
    }
});

/**
 * @route   POST /uploadreview
 * @desc    Post a review for a certain media
 * @access  Public
 */
app.post('/uploadreview', (req, res) => {
    try {
        const { mediaID, userID, rating, summary, text, mediaType } = req.body; // Destructure from req.body

        // Validate the input
        if (!mediaID || !userID || !rating || !summary || !text || !mediaType) {
            return res.status(400).send('All fields are required.');
        }

        // Get the proper table name
        let table = mediaType.toLowerCase().slice(0, -1) + '_reviews';

        // Validate the table name to prevent SQL injection
        const validTables = ['show_reviews', 'movie_reviews', 'book_reviews', 'game_reviews'];
        if (!validTables.includes(table)) {
            return res.status(400).send('Invalid table name');
        }

        // Construct the query
        const sql = `INSERT INTO ${table} (user_id, media_id, rating, summary, text) VALUES (?, ?, ?, ?, ?)`;
        
        // Use run() for inserts and check for errors
        const result = db.prepare(sql).run(userID, mediaID, rating, summary, text);
        
        // Check if the insert was successful
        if (result.changes === 0) {
            return res.status(500).send('Error inserting review.');
        }

        // Return success
        res.status(201).json({ message: 'Review uploaded successfully' });
    } catch (error) {
        console.error('Ind Error:', error);
        res.status(500).send('Error uploading review.');
    }
});

/**
 * @route   POST /editreview
 * @desc    Edit a review for a certain media
 * @access  Public
 */
app.post('/editreview', (req, res) => {
    try {
        const { mediaID, userID, rating, summary, text, mediaType } = req.body; // Destructure from req.body

        // Validate the input
        if (!mediaID || !userID || (rating < 0 || rating > 5) || !summary || !text || !mediaType) {
            return res.status(400).send('All fields are required.');
        }

        // Get the proper table name
        let table = mediaType.toLowerCase().slice(0, -1) + '_reviews';

        // Validate the table name to prevent SQL injection
        const validTables = ['show_reviews', 'movie_reviews', 'book_reviews', 'game_reviews'];
        if (!validTables.includes(table)) {
            return res.status(400).send('Invalid table name');
        }

        // Construct the query
        const sql = `UPDATE ${table} 
                    SET rating = ?, summary = ?, text = ?
                    WHERE media_id = ? AND user_id = ?`;
        
        // Use run() for inserts and check for errors
        const result = db.prepare(sql).run(rating, summary, text, mediaID, userID);
        
        // Check if the insert was successful
        if (result.changes === 0) {
            return res.status(500).send('Error inserting review.');
        }

        // Return success
        res.status(201).json({ message: 'Review uploaded successfully' });
    } catch (error) {
        console.error('Ind Error:', error);
        res.status(500).send('Error uploading review.');
    }
});

/**
 * @route   POST /delete_review
 * @desc    Delete a review for a certain media
 * @access  Public
 */
app.post('/delete_review', (req, res) => {
    try {
        const {mediaID, userID, mediaType } = req.body; // Destructure from req.body

        // Validate the input
        if (!mediaID || !userID || !mediaType) {
            return res.status(400).send('All fields are required.');
        }

        // Get the proper table name
        let table = mediaType.toLowerCase().slice(0, -1) + '_reviews';

        // Validate the table name to prevent SQL injection
        const validTables = ['show_reviews', 'movie_reviews', 'book_reviews', 'game_reviews'];
        if (!validTables.includes(table)) {
            return res.status(400).send('Invalid table name');
        }

        // Construct the query
        const sql = `DELETE FROM ${table} 
                    WHERE media_id = ? AND user_id = ?`;
        
        // Use run() for inserts and check for errors
        const result = db.prepare(sql).run(mediaID, userID);
        
        // Check if the insert was successful
        if (result.changes === 0) {
            return res.status(500).send('Error deleting review.');
        }

        // Return success
        res.status(201).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Ind Error:', error);
        res.status(500).send('Error deleting review.');
    }
});

/**
 * @route   GET /get_users
 * @desc    Retrieve all users and their info
 * @access  Public
 */
app.get('/get_users', (req, res) => {
    try {

        // construct the query
        const sql = `SELECT 
        id, username, bio, joined_on, fav_game_id, fav_book_id, fav_show_id, fav_movie_id, fav_genre_id
        FROM users`;
        const users = db.prepare(sql).all();

        // send back database query as json
        res.setHeader('Content-Type', 'application/json');
        res.send(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).send('Error searching for users');
    }
});

app.get('/get_user_by_id', (req, res) => {
    try {
        const { userID } = req.query; // Retrieve userID from req.query

        if (!userID) {
            return res.status(400).json({ error: "UserID is required" });
        }

        // Construct the query
        const sql = `
SELECT 
    u.id AS user_id, 
    u.username, 
    u.bio, 
    u.joined_on, 
    games.title AS fav_game_title,
    books.title AS fav_book_title,
    shows.title AS fav_show_title,
    movies.title AS fav_movie_title,
    u.fav_genre_id,
    r.media_type,
    r.media_id,
    r.rating,
    r.summary,
    r.text,
    r.posted_on,
    CASE
        WHEN r.media_type = 'game' THEN g.title
        WHEN r.media_type = 'movie' THEN m.title
        WHEN r.media_type = 'show' THEN s.title
        WHEN r.media_type = 'book' THEN b.title
        ELSE NULL
    END AS media_title
FROM users u
LEFT JOIN games ON u.fav_game_id = games.id
LEFT JOIN books ON u.fav_book_id = books.id
LEFT JOIN shows ON u.fav_show_id = shows.id
LEFT JOIN movies ON u.fav_movie_id = movies.id
LEFT JOIN (
    SELECT DISTINCT user_id, media_type, media_id, rating, summary, text, posted_on 
    FROM (
        SELECT user_id, 'game' AS media_type, media_id, rating, summary, text, posted_on 
        FROM game_reviews
        UNION ALL
        SELECT user_id, 'movie' AS media_type, media_id, rating, summary, text, posted_on 
        FROM movie_reviews
        UNION ALL
        SELECT user_id, 'show' AS media_type, media_id, rating, summary, text, posted_on 
        FROM show_reviews
        UNION ALL
        SELECT user_id, 'book' AS media_type, media_id, rating, summary, text, posted_on 
        FROM book_reviews
    ) r_reviews
) r ON u.id = r.user_id
LEFT JOIN games g ON r.media_type = 'game' AND r.media_id = g.id
LEFT JOIN movies m ON r.media_type = 'movie' AND r.media_id = m.id
LEFT JOIN shows s ON r.media_type = 'show' AND r.media_id = s.id
LEFT JOIN books b ON r.media_type = 'book' AND r.media_id = b.id
WHERE u.id = ?
ORDER BY r.posted_on DESC

        `;

        const userResults = db.prepare(sql).all(userID);

        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create the user object
        const user = {
            id: userResults[0].user_id,
            username: userResults[0].username,
            bio: userResults[0].bio,
            joined_on: userResults[0].joined_on,
            fav_game_title: userResults[0].fav_game_title,
            fav_book_title: userResults[0].fav_book_title,
            fav_show_title: userResults[0].fav_show_title,
            fav_movie_title: userResults[0].fav_movie_title,
            fav_genre_id: userResults[0].fav_genre_id,
            reviews: []
        };

        // Group reviews into an array for the user
        userResults.forEach((row) => {
            if (row.media_type && row.media_title) {
                user.reviews.push({
                    media_type: row.media_type,
                    media_title: row.media_title,
                    rating: row.rating,
                    summary: row.summary,
                    text: row.text,
                    posted_on: row.posted_on
                });
            }
        });

        // Send the user data as a response
        res.setHeader('Content-Type', 'application/json');
        res.json(user);

        console.log(user)

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).send('Error searching for users');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
