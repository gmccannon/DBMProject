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
 * @desc    Retrieve media based on search query and table
 * @access  Public
 */
app.get('/getmedia', (req, res) => {
    try {
        const searchQuery = req.query.search || ''; // Get the search query from the request
        const table = req.query.table || '';
        
        const sql = `SELECT * FROM ${table} WHERE title LIKE ?`;  // Prepare the SQL query with a parameter to avoid a SQL injection
        const games = db.prepare(sql).all(`%${searchQuery}%`); // Use wildcard for searching

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(games));
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
        let id = req.query.search || ''; // Get the search query from the request
        let table = req.query.table || ''; // Get the table name from the request

        if (!id) {
            return res.status(400).send('ID parameter is required.');
        }

        if (!table) {
            return res.status(400).send('Table parameter is required.');
        }

        // Convert table parameter to lowercase to ensure case-insensitive matching
        table = table.toLowerCase();

        // Validate the table name to prevent SQL injection
        const validTables = ['shows', 'movies', 'books', 'games']; // Allowed tables
        if (!validTables.includes(table)) {
            return res.status(400).send('Invalid table name');
        }

        // Prepare the SQL query with the validated table name
        // Joining the genres table to also get the genre name!!
        const sql = `SELECT ${table}.*, genres.genre 
                     FROM ${table} 
                     JOIN genres ON ${table}.genre_id = genres.id 
                     WHERE ${table}.id = ?`;
        const shows = db.prepare(sql).all(id); // Safely pass the id as a parameter

        console.log(shows)

        res.json(mediaItems);
    } catch (error) {
        console.error('Ind Error:', error);
        res.status(500).send('Error searching for media.');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
