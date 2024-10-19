import express, { raw } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';

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
        let order = req.query.order.toLocaleLowerCase() || '';

        // handle case of books and release date search
        // books table calls it 'publication_date' not 'release_date'
        if (table === 'books' && order === 'release_date') {
            order = 'publication_date';
        }
        
        // construct the query
        const sql = `SELECT * FROM ${table} 
        WHERE title LIKE ? OR maker LIKE ?
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
