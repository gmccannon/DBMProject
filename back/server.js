import express, { raw } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';

const app = express();
const db = new Database('database.db');
const port = 3001;

app.use(cors());
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
        const sql = `SELECT * FROM ${table} WHERE title LIKE ? ORDER BY ${order}`; 

        // query the database, (use wildcard so that an empty parameter returns all)
        const mediaItems = db.prepare(sql).all(`%${searchQuery}%`);

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
 * @desc    Retrieve individual media item by ID
 * @access  Public
 */
app.get('/ind', (req, res) => {
    try {
        let id = req.query.search.toLocaleLowerCase() || ''; // Get the search query from the request
        let table = req.query.table.toLocaleLowerCase() || ''; // Get the table name from the request

        // Convert table parameter to lowercase to ensure case-insensitive matching
        table = table.toLowerCase();

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
 * @desc    Retrieve individual reviews by ID(s)
 * @access  Public
 */
app.get('/review', (req, res) => {
    try {
        let mediaID = req.query.mediaID.toLocaleLowerCase() || ''; // Get the table name from the request

        // the type from the request will come in as 'Books' etc, but needs to be 'book_reviews' etc to get the table
        // for the ID column, it needs to be {media}_id
        // TODO: make this not suck
        let table = req.query.mediaType.toLocaleLowerCase().slice(0, -1) + '_reviews' || ''; // Get the table name from the request
        let mediaColumnIDName = req.query.mediaType.toLocaleLowerCase().slice(0, -1) + '_id' || ''; // Get the proper column name

        // Validate the table name to prevent SQL injection
        const validTables = ['show_reviews', 'movie_reviews', 'book_reviews', 'game_reviews'];
        if (!validTables.includes(table)) {
            return res.status(400).send('Invalid table name');
        }

        // construct the query
        const sql = `SELECT *
                     FROM ${table}  
                     WHERE ${mediaColumnIDName} = ?`;
        const mediaItem = db.prepare(sql).all(mediaID);

        // debug log
        console.log(mediaItem[0])

        // send back database query as json
        // might return more then on item
        res.setHeader('Content-Type', 'application/json');
        res.send(mediaItem);
    } catch (error) {
        console.error('Ind Error:', error);
        res.status(500).send('Error searching for media.');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
