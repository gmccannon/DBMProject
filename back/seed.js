import Database from 'better-sqlite3';
const db = new Database('database.db');

db.exec(`
    CREATE TABLE if NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
    );

    create table if not exists books (
        id integer NOT NULL primary key autoincrement,
        title varchar(256) NOT NULL,
        subtitle varchar(256),
        author varchar(256),
        publisher varchar(256)
    );
    
    create table if not exists shows (
        id integer NOT NULL primary key autoincrement,
        title varchar(256) NOT NULL,
        seasons varchar(256),
        writer varchar(256),
        network varchar(256)
    );
    
    create table if not exists movies (
        id integer NOT NULL primary key autoincrement,
        title varchar(256) NOT NULL,
        director varchar(256),
        release_year varchar(256)
    );

    create table if not exists games (
        id integer NOT NULL primary key autoincrement,
        title varchar(256) NOT NULL,
        publisher varchar(256),
        release_year varchar(256)
    );

    insert or replace into shows
        (title, seasons, writer, network)
        values ('Breaking Bad', '5', 'Vince Giligan', 'Drama');

    insert or replace into shows
        (title, seasons, writer, network)
        values ('Better Call Saul', '6', 'Vince Giligan', 'Drama');

    insert or replace into shows
        (title, seasons, writer, network)
        values ('Star Trek: The Next Generation', '7', 'Gene Roddenberry', 'Sci-fi');
    
    insert or replace into movies
        (title, director, release_year)
        values ('The Lord of The Rings: The Return of The King', 'Peter Jackson', '2003');
    
    insert or replace into movies
        (title, director, release_year)
        values ('The Departed', 'Martin Scorsese', '2006');

    insert or replace into games
        (title, publisher, release_year)
        values ('Dark Souls 3', 'Fromsoft', '2016');

    insert or replace into books
        (title, subtitle, author, publisher)
        values ('Blaming the User', 'You''re a 10x hacker and it must be someone else''s fault', 'The Practical Dev', 'ORLY');

    insert or replace into books
        (title, subtitle, author, publisher)
        values ('Buzzword First Design', 'Fashion-forward development', 'The Practical Dev', 'ORLY');

    insert or replace into books
        (title, subtitle, author, publisher)
        values ('Googling the Error Message', 'The internet will make those bad words go away', 'The Practical Dev', 'ORLY');

    insert or replace into books
        (title, subtitle, author, publisher)
        values ('Web Development With Assembly', 'You might as well just shoot yourself right now', 'Bob Johnson (with his therapist)', 'ORLY');

    insert or replace into books
        (title, subtitle, author, publisher)
        values ('Works on My Machine', 'Every other developer is wrong', 'R. William', 'ORLY');

    insert or replace into books
        (title, subtitle, author, publisher)
        values ('Writing Code That Nobody Else can Read', 'Does it run? Just leave it alone.', 'The Practical Dev', 'ORLY');

`);
