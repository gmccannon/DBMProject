import Database from 'better-sqlite3';
const db = new Database('database.db');

db.exec(`
    CREATE TABLE genres (
        id INTEGER PRIMARY KEY,
        genre VARCHAR NOT NULL UNIQUE -- Ensure each genre is unique
    );

    CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        username VARCHAR UNIQUE NOT NULL, -- Enforce unique usernames and make it required
        password VARCHAR NOT NULL, -- Ensure password is required
        bio VARCHAR,
        joined_on DATE DEFAULT CURRENT_DATE, -- Set default to current date for new users
        fav_game_id INTEGER,
        fav_book_id INTEGER,
        fav_movie_id INTEGER,
        fav_show_id INTEGER,
        fav_genre_id INTEGER,
        FOREIGN KEY (fav_game_id) REFERENCES games(id) ON DELETE SET NULL, -- Set to NULL if game is deleted
        FOREIGN KEY (fav_book_id) REFERENCES books(id) ON DELETE SET NULL, -- Set to NULL if book is deleted
        FOREIGN KEY (fav_movie_id) REFERENCES movies(id) ON DELETE SET NULL, -- Set to NULL if movie is deleted
        FOREIGN KEY (fav_show_id) REFERENCES shows(id) ON DELETE SET NULL, -- Set to NULL if show is deleted
        FOREIGN KEY (fav_genre_id) REFERENCES genres(id) ON DELETE SET NULL -- Set to NULL if genre is deleted
    );

    CREATE TABLE movies (
        id INTEGER PRIMARY KEY,
        title VARCHAR NOT NULL,
        director VARCHAR NOT NULL,
        release_date DATE NOT NULL CHECK (release_date <= CURRENT_DATE), -- Ensure release date is not in the future
        genre_id INTEGER,
        duration INTEGER CHECK (duration > 0), -- Ensure duration is a positive number
        oscar_winner BOOLEAN DEFAULT FALSE, -- Default to false if not specified
        FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL -- Set to NULL if genre is deleted
    );

    CREATE TABLE shows (
        id INTEGER PRIMARY KEY,
        title VARCHAR NOT NULL,
        writer VARCHAR NOT NULL,
        release_date DATE NOT NULL CHECK (release_date <= CURRENT_DATE), -- Ensure release date is not in the future
        genre_id INTEGER,
        episodes INTEGER CHECK (episodes > 0), -- Ensure episodes count is a positive number
        emmy_winner BOOLEAN DEFAULT FALSE, -- Default to false if not specified
        FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL -- Set to NULL if genre is deleted
    );

    CREATE TABLE books (
        id INTEGER PRIMARY KEY,
        title VARCHAR NOT NULL,
        author VARCHAR NOT NULL,
        publication_date DATE NOT NULL CHECK (publication_date <= CURRENT_DATE), -- Ensure publication date is not in the future
        genre_id INTEGER,
        word_count INTEGER CHECK (word_count > 0), -- Ensure word count is positive
        best_seller BOOLEAN DEFAULT FALSE, -- Default to false if not specified
        FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL -- Set to NULL if genre is deleted
    );

    CREATE TABLE games (
        id INTEGER PRIMARY KEY,
        title VARCHAR NOT NULL,
        studio VARCHAR NOT NULL,
        release_date DATE NOT NULL CHECK (release_date <= CURRENT_DATE), -- Ensure release date is not in the future
        genre_id INTEGER,
        platform VARCHAR NOT NULL CHECK (platform IN ('PC', 'Console', 'Mobile')), -- Limit platforms to specific values
        multiplayer BOOLEAN DEFAULT FALSE, -- Default to false if not specified
        FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL -- Set to NULL if genre is deleted
    );

    CREATE TABLE game_reviews (
        user_id INTEGER NOT NULL,
        game_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 10), -- Rating must be between 1 and 10
        summary VARCHAR,
        text VARCHAR NOT NULL,
        PRIMARY KEY (user_id, game_id), -- Composite primary key to ensure a user can only review a game once
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete reviews if user is deleted
        FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE -- Delete reviews if game is deleted
    );

    CREATE TABLE movie_reviews (
        user_id INTEGER NOT NULL,
        movie_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 10), -- Rating must be between 1 and 10
        summary VARCHAR,
        text VARCHAR NOT NULL,
        PRIMARY KEY (user_id, movie_id), -- Composite primary key to ensure a user can only review a movie once
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete reviews if user is deleted
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE -- Delete reviews if movie is deleted
    );

    CREATE TABLE show_reviews (
        user_id INTEGER NOT NULL,
        show_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 10), -- Rating must be between 1 and 10
        summary VARCHAR,
        text VARCHAR NOT NULL,
        PRIMARY KEY (user_id, show_id), -- Composite primary key to ensure a user can only review a show once
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete reviews if user is deleted
        FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE -- Delete reviews if show is deleted
    );

    CREATE TABLE book_reviews (
        user_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 10), -- Rating must be between 1 and 10
        summary VARCHAR,
        text VARCHAR NOT NULL,
        PRIMARY KEY (user_id, book_id), -- Composite primary key to ensure a user can only review a book once
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete reviews if user is deleted
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE -- Delete reviews if book is deleted
    );

    insert or replace into genres
        (genre)
        values ('Fantasy');

    insert or replace into books
        (title, author, publication_date, genre_id, word_count, best_seller)
        values ('Book1', 'Author1', '1999-12-31', 1, 12345, false);

    insert or replace into movies
        (title, director, release_date, genre_id, duration, oscar_winner)
        values ('Movie1', 'Director1', '1998-12-31', 1, 2134, false);
    
    insert or replace into shows
        (title, writer, release_date, genre_id, episodes, emmy_winner)
        values ('Show1', 'Writer1', '1997-12-31', 1, 4356, false);

    insert or replace into games
        (title, studio, release_date, genre_id, platform, multiplayer)
        values ('Game1', 'Studio1', '1996-12-31', 1, 'PC', false);

    insert or replace into books
        (title, author, publication_date, genre_id, word_count, best_seller)
        values ('Book2', 'Author1', '1999-12-31', 1, 12345, false);

    insert or replace into movies
        (title, director, release_date, genre_id, duration, oscar_winner)
        values ('Movie2', 'Director1', '1998-12-31', 1, 2134, false);
    
    insert or replace into shows
        (title, writer, release_date, genre_id, episodes, emmy_winner)
        values ('Show2', 'Writer1', '1997-12-31', 1, 4356, false);

    insert or replace into games
        (title, studio, release_date, genre_id, platform, multiplayer)
        values ('Game2', 'Studio1', '1996-12-31', 1, 'PC', false);
`);
