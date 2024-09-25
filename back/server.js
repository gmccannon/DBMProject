import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('database.db');
const port = 3001;

app.use(cors());

app.get('/books', (req, res) => {
    try {
        const searchQuery = req.query.search || ''; // Get the search query from the request
        const sql = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?';  // Prepare the SQL query with a parameter to avoid a SQL injection
        const books = db.prepare(sql).all(`%${searchQuery}%`, `%${searchQuery}%`); // Use wildcard for searching

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(books));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching for books.');
    }
});

app.get('/games', (req, res) => {
    try {
        const searchQuery = req.query.search || ''; // Get the search query from the request
        const sql = 'SELECT * FROM games WHERE title LIKE ? OR publisher LIKE ?';  // Prepare the SQL query with a parameter to avoid a SQL injection
        const games = db.prepare(sql).all(`%${searchQuery}%`, `%${searchQuery}%`); // Use wildcard for searching

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(games));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching for games.');
    }
});

app.get('/movies', (req, res) => {
    try {
        const searchQuery = req.query.search || ''; // Get the search query from the request
        const sql = 'SELECT * FROM movies WHERE title LIKE ? OR director LIKE ?';  // Prepare the SQL query with a parameter to avoid a SQL injection
        const movies = db.prepare(sql).all(`%${searchQuery}%`, `%${searchQuery}%`); // Use wildcard for searching

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(movies));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching for movies.');
    }
});

app.get('/shows', (req, res) => {
    try {
        const searchQuery = req.query.search || ''; // Get the search query from the request
        const sql = 'SELECT * FROM shows WHERE title LIKE ? OR writer LIKE ?';  // Prepare the SQL query with a parameter to avoid a SQL injection
        const shows = db.prepare(sql).all(`%${searchQuery}%`, `%${searchQuery}%`); // Use wildcard for searching

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(shows));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching for shows.');
    }
});

app.get('/ind', (req, res) => {
    try {
        const id = req.query.search || ''; // Get the search query from the request
        const table = req.query.table || ''; // Get the table name from the request

        // Validate the table name to prevent SQL injection
        const validTables = ['shows', 'movies', 'books', 'games']; // Add allowed table names here
        if (!validTables.includes(table)) {
            return res.status(400).send('Invalid table name');
        }

        // Prepare the SQL query with the validated table name
        const sql = `SELECT * FROM ${table} WHERE id = ?`;
        const shows = db.prepare(sql).all(id); // Safely pass the id as a parameter

        console.log('Query result:', shows);  // Log the result

        res.setHeader('Content-Type', 'application/json');
        res.send(shows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching for shows.');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
