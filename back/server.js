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
        const games = db.prepare('select * from games').all();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(games));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching for games.');
    }
});

app.get('/movies', (req, res) => {
    try {
        const movies = db.prepare('select * from movies').all();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(movies));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching for movies.');
    }
});

app.get('/shows', (req, res) => {
    try {
        const shows = db.prepare('select * from shows').all();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(shows));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching for shows.');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
