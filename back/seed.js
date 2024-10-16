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
        rating REAL NOT NULL CHECK (rating BETWEEN 0.5 AND 5), -- Rating must be between 1 and 5
        summary VARCHAR,
        text VARCHAR NOT NULL,
        PRIMARY KEY (user_id, game_id), -- Composite primary key to ensure a user can only review a game once
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete reviews if user is deleted
        FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE -- Delete reviews if game is deleted
    );

    CREATE TABLE movie_reviews (
        user_id INTEGER NOT NULL,
        movie_id INTEGER NOT NULL,
        rating REAL NOT NULL CHECK (rating BETWEEN 0.5 AND 5), -- Rating must be between 1 and 5
        summary VARCHAR,
        text VARCHAR NOT NULL,
        PRIMARY KEY (user_id, movie_id), -- Composite primary key to ensure a user can only review a movie once
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete reviews if user is deleted
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE -- Delete reviews if movie is deleted
    );

    CREATE TABLE show_reviews (
        user_id INTEGER NOT NULL,
        show_id INTEGER NOT NULL,
        rating REAL NOT NULL CHECK (rating BETWEEN 0.5 AND 5.0), -- Rating must be between 0.5 and 5.0
        summary VARCHAR,
        text VARCHAR NOT NULL,
        PRIMARY KEY (user_id, show_id), -- Composite primary key to ensure a user can only review a show once
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete reviews if user is deleted
        FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE -- Delete reviews if show is deleted
    );

    CREATE TABLE book_reviews (
        user_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        rating REAL NOT NULL CHECK (rating BETWEEN 0.5 AND 5), -- Rating must be between 1 and 5
        summary VARCHAR,
        text VARCHAR NOT NULL,
        PRIMARY KEY (user_id, book_id), -- Composite primary key to ensure a user can only review a book once
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete reviews if user is deleted
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE -- Delete reviews if book is deleted
    );

    INSERT OR REPLACE INTO genres
        (genre)
    VALUES 
        ('Fantasy'),
        ('Science Fiction'),
        ('Drama'),
        ('Adventure'),
        ('Fiction');

    INSERT OR REPLACE INTO books
        (title, author, publication_date, genre_id, word_count, best_seller)
    VALUES 
        ('Don Quixote', 'Miguel de Cervantes', '1605-01-16', 4, 383748, true),
        ('For Whom the Bell Tolls', 'Ernest Hemingway', '1940-10-21', 5, 174106, true),
        ('The Lord of the Rings', 'J.R.R. Tolkien', '1954-07-29', 1, 455125, true),
        ('Nineteen Eighty-Four', 'George Orwell', '1949-06-08', 5, 88442, true),
        ('Animal Farm', 'George Orwell', '1945-08-17', 5, 29966, true),
        ('The Hobbit', 'J.R.R. Tolkien', '1937-09-21', 1, 95022, true),
        ('The Old Man and the Sea', 'Ernest Hemingway', '1952-09-01', 5, 26925, true),
        ('Fahrenheit 451', 'Ray Bradbury', '1953-10-19', 5, 46411, true),
        ('Brave New World', 'Aldous Huxley', '1932-08-30', 5, 63210, true),
        ('One Hundred Years of Solitude', 'Gabriel García Márquez', '1967-05-30', 4, 41781, true),
        ('Slaughterhouse-Five', 'Kurt Vonnegut', '1969-03-31', 5, 27528, true),
        ('The Bell Jar', 'Sylvia Plath', '1963-01-14', 5, 74300, true),
        ('The Chronicles of Narnia', 'C.S. Lewis', '1950-10-16', 1, 167593, true);

    INSERT OR REPLACE INTO movies
        (title, director, release_date, genre_id, duration, oscar_winner)
    VALUES 
        ('The Lord of the Rings: The Return of the King', 'Peter Jackson', '2003-12-17', 1, 201, true),
        ('The Departed', 'Martin Scorsese', '2006-10-06', 3, 151, true),
        ('The Lord of the Rings: The Fellowship of the Ring', 'Peter Jackson', '2001-12-19', 1, 178, true),
        ('The Lord of the Rings: The Two Towers', 'Peter Jackson', '2002-12-18', 1, 179, true),
        ('No Country for Old Men', 'Ethan Coen', '2007-11-21', 3, 122, true),
        ('The Shawshank Redemption', 'Frank Darabont', '1994-09-23', 4, 142, true),
        ('Pulp Fiction', 'Quentin Tarantino', '1994-10-14', 3, 154, true),
        ('The Godfather', 'Francis Ford Coppola', '1972-03-24', 4, 175, true),
        ('Fight Club', 'David Fincher', '1999-10-15', 3, 139, false),
        ('Schindler''s List', 'Steven Spielberg', '1993-12-15', 4, 195, true),
        ('Inception', 'Christopher Nolan', '2010-07-16', 1, 148, false);

    INSERT OR REPLACE INTO shows
        (title, writer, release_date, genre_id, episodes, emmy_winner)
    VALUES 
        ('Breaking Bad', 'Vince Gilligan', '2008-01-20', 3, 62, true),
        ('Better Call Saul', 'Vince Gilligan', '2015-02-08', 3, 63, false),
        ('Star Trek: The Next Generation', 'Gene Roddenberry', '1987-09-28', 2, 178, true),
        ('The West Wing', 'Aaron Sorkin', '1999-09-22', 3, 154, true),
        ('The Wire', 'David Simon', '2002-06-02', 3, 60, false),
        ('House', 'David Shore', '2004-11-16', 3, 177, true),
        ('Game of Thrones', 'David Benioff and D.B. Weiss', '2011-04-17', 2, 73, true),
        ('The Sopranos', 'David Chase', '1999-01-10', 2, 86, true);

    INSERT OR REPLACE INTO games
        (title, studio, release_date, genre_id, platform, multiplayer)
    VALUES 
        ('Dark Souls 3', 'FromSoftware', '2016-03-24', 1, 'PC', true);

    INSERT OR REPLACE INTO users
        (id, username, password)
    VALUES 
        (1, 'george1', '123'),
        (2, 'george2', '123'),
        (3, 'george3', '123'),
        (4, 'george4', '123'),
        (5, 'george5', '123'),
        (6, 'george6', '123'),
        (7, 'george7', '123'),
        (8, 'george8', '123');

    INSERT OR REPLACE INTO book_reviews
        (user_id, book_id, rating, summary, text)
    VALUES 
        (1, 2, 4.5, 'Good', 'This was a good book');

    INSERT OR REPLACE INTO movie_reviews
        (user_id, movie_id, rating, summary, text)
    VALUES 
        (1, 2, 3.5, 'Good movie', 'This was a good movie'),
        (2, 2, 4.5, 'Very Good', 'Like the other guy i liked this movie');

    INSERT OR REPLACE INTO game_reviews
        (user_id, game_id, rating, summary, text)
    VALUES 
        (1, 1, 5, 'Good', 'This was a good game');

INSERT OR REPLACE INTO show_reviews
    (user_id, show_id, rating, summary, text)
VALUES 
    (1, 1, 0.5, 'Overhyped', 'Honestly, I didn''t get the hype. It was slow in many places and the characters didn''t connect with me.'),
    (2, 1, 1, 'Not my favorite', 'Breaking Bad started out strong, but it lost me halfway through. Too much build-up and not enough payoff.'),
    (3, 1, 2, 'Mixed feelings', 'There were moments of brilliance, but I couldn''t really root for the characters. Walter White''s arc was interesting but frustrating.'),
    (4, 1, 3, 'Great cinematography', 'Visually stunning and the acting was on point. Some episodes dragged, but the overall plot was engaging.'),
    (5, 1, 4, 'Amazing characters', 'The writing, particularly for Jesse and Walt, was phenomenal. Some of the best character development I''ve seen.'),
    (6, 1, 5, 'A masterpiece', 'Breaking Bad redefined TV. The storytelling was flawless, and every episode kept me on the edge of my seat.'),
    (7, 1, 5, 'One of the best ever', 'Breaking Bad is hands down one of the best shows ever made. The transformation of Walter White is legendary.'),
    (8, 1, 5, 'Perfect ending', 'The finale was perfect, tying up all loose ends. Not many shows manage to end on such a high note, but Breaking Bad did it right.');

`);
