import express, { raw } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('database.db');
const port = 3001;

app.use(cors());

app.get('/getmedia', (req, res) => {
    try {
        const searchQuery = req.query.search || ''; // Get the search query from the request
        const table = req.query.table || '';
        
        const sql = `SELECT * FROM ${table} WHERE title LIKE ?`;  // Prepare the SQL query with a parameter to avoid a SQL injection
        const games = db.prepare(sql).all(`%${searchQuery}%`); // Use wildcard for searching

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(games));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error searching for games.');
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
        // Joining the genres table to also get the genre name!!
        const sql = `SELECT ${table}.*, genres.genre 
                     FROM ${table} 
                     JOIN genres ON ${table}.genre_id = genres.id 
                     WHERE ${table}.id = ?`;
        const shows = db.prepare(sql).all(id); // Safely pass the id as a parameter

        console.log(shows)

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
