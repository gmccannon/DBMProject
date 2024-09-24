import Database from 'better-sqlite3';
const db = new Database('database.db');

db.exec(`
    create table if not exists books (
        book_id integer NOT NULL primary key autoincrement,
        title varchar(256) NOT NULL,
        subtitle varchar(256),
        author varchar(256),
        publisher varchar(256)
    );
    
    create table if not exists shows (
        show_id integer NOT NULL primary key autoincrement,
        title varchar(256) NOT NULL,
        seasons varchar(256),
        writer varchar(256),
        network varchar(256)
    );
    
    create table if not exists movies (
        movie_id integer NOT NULL primary key autoincrement,
        title varchar(256) NOT NULL,
        director varchar(256),
        release_year varchar(256)
    );

    create table if not exists games (
        game_id integer NOT NULL primary key autoincrement,
        title varchar(256) NOT NULL,
        publisher varchar(256),
        release_year varchar(256)
    );

    insert or replace into shows
        (title, seasons, writer, network)
        values ('Breaking Bad', '6', 'Vince Giligan', 'AMC');
    
    insert or replace into movies
        (title, director, release_year)
        values ('The Lord of The Rings: The Return of The King', 'Peter Jackson', '2003');

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
        values ('Coding Drunk', 'Make Programming Fun Again', 'N.E. Briated', 'ORLY');

    insert or replace into books
        (title, subtitle, author, publisher)
        values ('Googling the Error Message', 'The internet will make those bad words go away', 'The Practical Dev', 'ORLY');

    insert or replace into books
        (title, subtitle, author, publisher)
        values ('Memorizing Six Git Commands', 'The popular approach to version control', 'The Practical Dev', 'ORLY');

    insert or replace into books
        (title, subtitle, author, publisher)
        values ('Web Development With Assembly', 'You might as well just yourself right now', 'Bob Johnson (with his therapist)', 'ORLY');

    insert or replace into books
        (title, subtitle, author, publisher)
        values ('Works on My Machine', 'How to convince your manager', 'R. William', 'ORLY');

    insert or replace into books
        (title, subtitle, author, publisher)
        values ('Writing Code That Nobody Else can Read', 'Does it run? Just leave it alone.', 'The Practical Dev', 'ORLY');

`);
