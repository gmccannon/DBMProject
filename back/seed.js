import Database from 'better-sqlite3';
const db = new Database('database.db');

//schema
db.exec(`
    DROP TABLE IF EXISTS game_reviews;
    DROP TABLE IF EXISTS movie_reviews;
    DROP TABLE IF EXISTS show_reviews;
    DROP TABLE IF EXISTS book_reviews;
    DROP TABLE IF EXISTS games;
    DROP TABLE IF EXISTS books;
    DROP TABLE IF EXISTS shows;
    DROP TABLE IF EXISTS movies;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS genres;

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
        maker VARCHAR NOT NULL,
        release_date DATE NOT NULL CHECK (release_date <= CURRENT_DATE), -- Ensure release date is not in the future
        genre_id INTEGER,
        duration INTEGER CHECK (duration > 0), -- Ensure duration is a positive number
        oscar_winner BOOLEAN DEFAULT FALSE, -- Default to false if not specified
        FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL -- Set to NULL if genre is deleted
    );

    CREATE TABLE shows (
        id INTEGER PRIMARY KEY,
        title VARCHAR NOT NULL,
        maker VARCHAR NOT NULL,
        release_date DATE NOT NULL CHECK (release_date <= CURRENT_DATE), -- Ensure release date is not in the future
        genre_id INTEGER,
        episodes INTEGER CHECK (episodes > 0), -- Ensure episodes count is a positive number
        emmy_winner BOOLEAN DEFAULT FALSE, -- Default to false if not specified
        FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL -- Set to NULL if genre is deleted
    );

    CREATE TABLE books (
        id INTEGER PRIMARY KEY,
        title VARCHAR NOT NULL,
        maker VARCHAR NOT NULL,
        release_date DATE NOT NULL CHECK (release_date <= CURRENT_DATE), -- Ensure publication date is not in the future
        genre_id INTEGER,
        word_count INTEGER CHECK (word_count > 0), -- Ensure word count is positive
        best_seller BOOLEAN DEFAULT FALSE, -- Default to false if not specified
        FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL -- Set to NULL if genre is deleted
    );

    CREATE TABLE games (
        id INTEGER PRIMARY KEY,
        title VARCHAR NOT NULL,
        maker VARCHAR NOT NULL,
        release_date DATE NOT NULL CHECK (release_date <= CURRENT_DATE), -- Ensure release date is not in the future
        genre_id INTEGER,
        platform VARCHAR NOT NULL CHECK (platform IN ('PC', 'Console', 'Mobile')), -- Limit platforms to specific values
        multiplayer BOOLEAN DEFAULT FALSE, -- Default to false if not specified
        FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL -- Set to NULL if genre is deleted
    );

    CREATE TABLE game_reviews (
        user_id INTEGER NOT NULL,
        media_id INTEGER NOT NULL,
        rating REAL NOT NULL CHECK (rating BETWEEN 0.5 AND 5), -- Rating must be between 1 and 5
        summary VARCHAR,
        text VARCHAR NOT NULL,
        posted_on DATE DEFAULT CURRENT_DATE,
        PRIMARY KEY (user_id, media_id), -- Composite primary key to ensure a user can only review a game once
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete reviews if user is deleted
        FOREIGN KEY (media_id) REFERENCES games(id) ON DELETE CASCADE -- Delete reviews if game is deleted
    );

    CREATE TABLE movie_reviews (
        user_id INTEGER NOT NULL,
        media_id INTEGER NOT NULL,
        rating REAL NOT NULL CHECK (rating BETWEEN 0.5 AND 5), -- Rating must be between 1 and 5
        summary VARCHAR,
        text VARCHAR NOT NULL,
        posted_on DATE DEFAULT CURRENT_DATE,
        PRIMARY KEY (user_id, media_id), -- Composite primary key to ensure a user can only review a movie once
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete reviews if user is deleted
        FOREIGN KEY (media_id) REFERENCES movies(id) ON DELETE CASCADE -- Delete reviews if movie is deleted
    );

    CREATE TABLE show_reviews (
        user_id INTEGER NOT NULL,
        media_id INTEGER NOT NULL,
        rating REAL NOT NULL CHECK (rating BETWEEN 0.5 AND 5.0), -- Rating must be between 0.5 and 5.0
        summary VARCHAR,
        text VARCHAR NOT NULL,
        posted_on DATE DEFAULT CURRENT_DATE,
        PRIMARY KEY (user_id, media_id), -- Composite primary key to ensure a user can only review a show once
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete reviews if user is deleted
        FOREIGN KEY (media_id) REFERENCES shows(id) ON DELETE CASCADE -- Delete reviews if show is deleted
    );

    CREATE TABLE book_reviews (
        user_id INTEGER NOT NULL,
        media_id INTEGER NOT NULL,
        rating REAL NOT NULL CHECK (rating BETWEEN 0.5 AND 5), -- Rating must be between 1 and 5
        summary VARCHAR,
        text VARCHAR NOT NULL,
        posted_on DATE DEFAULT CURRENT_DATE,
        PRIMARY KEY (user_id, media_id), -- Composite primary key to ensure a user can only review a book once
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete reviews if user is deleted
        FOREIGN KEY (media_id) REFERENCES books(id) ON DELETE CASCADE -- Delete reviews if book is deleted
    );

    CREATE TABLE IMDbTitles (
        tconst VARCHAR(20) PRIMARY KEY,
        primary_title VARCHAR(255) NOT NULL,
        original_title VARCHAR(255) NOT NULL
    );

    CREATE TABLE IMDbRatings (
        tconst VARCHAR(20) PRIMARY KEY,
        average_rating DECIMAL(3,1) CHECK (average_rating >= 0.0 AND average_rating <= 10.0),
        num_votes INTEGER CHECK (num_votes >= 0),
        FOREIGN KEY (tconst) REFERENCES IMDbTitles(tconst) ON DELETE CASCADE
    );

`);

//Add data
db.exec(`
    INSERT OR REPLACE INTO genres
        (genre)
    VALUES 
        ('Fantasy'),
        ('Science Fiction'),
        ('Drama'),
        ('Adventure'),
        ('Fiction'),
        ('Comedy');
`);

db.exec(`
    INSERT OR REPLACE INTO games
        (title, maker, release_date, genre_id, platform, multiplayer)
    VALUES 
        ('Dark Souls 3', 'FromSoftware', '2016-03-24', 1, 'PC', true),
        ('Dark Souls', 'FromSoftware', '2011-09-22', 1, 'PC', true),
        ('Mass Effect 2', 'BioWare', '2010-01-26', 2, 'PC', true),
        ('Red Dead Redemption 2', 'Rockstar Games', '2018-10-26', 4, 'PC', true),
        ('Half-Life 2', 'Valve', '2004-11-16', 2, 'PC', false),
        ('GTA IV', 'Rockstar Games', '2008-04-29', 4, 'PC', true),
        ('The Elder Scrolls IV: Oblivion', 'Bethesda Game Studios', '2006-03-20', 1, 'PC', false),
        ('Batman: Arkham City', 'Rocksteady Studios', '2011-10-18', 1, 'PC', true),
        ('Red Dead Redemption', 'Rockstar Games', '2010-05-18', 4, 'Console', true),
        ('Call of Duty: Black Ops', 'Treyarch', '2010-11-09', 6, 'PC', true),
        ('Portal 2', 'Valve', '2011-04-18', 2, 'PC', false);
`);

//Add data
db.exec(`
    INSERT OR REPLACE INTO movies
        (title, maker, release_date, genre_id, duration, oscar_winner)
    VALUES 
        ('The Lord of the Rings: The Return of the King', 'Peter Jackson', '2003-12-17', 1, 201, true),
        ('The Departed', 'Martin Scorsese', '2006-10-06', 3, 151, true),
        ('The Lord of the Rings: The Fellowship of the Ring', 'Peter Jackson', '2001-12-19', 1, 178, true),
        ('The Lord of the Rings: The Two Towers', 'Peter Jackson', '2002-12-18', 1, 179, true),
        ('No Country for Old Men', 'Ethan Coen', '2007-11-21', 3, 122, true),
        ('The Shawshank Redemption', 'Frank Darabont', '1994-09-23', 3, 142, true),
        ('The Good, the Bad and the Ugly', 'Sergio Leone', '1966-12-23', 4, 178, true),
        ('Rain Man', 'Barry Levinson', '1988-12-16', 6, 133, true),
        ('Catch Me If You Can', 'Steven Spielberg', '2002-12-25', 4, 141, false),
        ('Inception', 'Christopher Nolan', '2010-07-16', 5, 148, false),
        ('Field of Dreams', 'Phil Robinson', '1989-04-21', 5, 107, true),
        ('The Dark Knight', 'Christopher Nolan', '2008-07-18', 5, 152, false),
        ('Forrest Gump', 'Robert Zemeckis', '1994-07-06', 6, 142, true),
        ('Gladiator', 'Ridley Scott', '2000-05-05', 2, 155, true),
        ('Titanic', 'James Cameron', '1997-12-19', 6, 195, true),
        ('Everything Everywhere All at Once', 'Daniel Kwan, Daniel Scheinert', '2022-03-11', 5, 139, true),
        ('The Matrix', 'The Wachowskis', '1999-03-31', 4, 136, false),
        ('The Silence of the Lambs', 'Jonathan Demme', '1991-02-14', 3, 118, true),
        ('Spider-Man: No Way Home', 'Jon Watts', '2021-12-17', 4, 148, false),
        ('Dune', 'Denis Villeneuve', '2021-10-22', 1, 155, false),
        ('Avengers: Endgame', 'Anthony Russo, Joe Russo', '2019-04-26', 4, 181, true),
        ('Parasite', 'Bong Joon-ho', '2019-05-30', 3, 132, true),
        ('The Revenant', 'Alejandro González Iñárritu', '2015-12-25', 2, 156, true),
        ('The Irishman', 'Martin Scorsese', '2019-11-27', 3, 209, false),
        ('Once Upon a Time in Hollywood', 'Quentin Tarantino', '2019-07-26', 4, 161, false),
        ('Soul', 'Pete Docter', '2020-12-25', 5, 100, true),
        ('Knives Out', 'Rian Johnson', '2019-11-27', 4, 130, false);
`);

//Add data
db.exec(`
    INSERT OR REPLACE INTO books
        (title, maker, release_date, genre_id, word_count, best_seller)
    VALUES 
        ('Don Quixote', 'Miguel de Cervantes', '1605-01-16', 4, 383748, true),
        ('For Whom the Bell Tolls', 'Ernest Hemingway', '1940-10-21', 5, 174106, true),
        ('The Lord of the Rings', 'J.R.R. Tolkien', '1954-07-29', 1, 455125, true),
        ('Nineteen Eighty-Four', 'George Orwell', '1949-06-08', 5, 88442, true),
        ('Animal Farm', 'George Orwell', '1945-08-17', 5, 29966, true),
        ('The Hobbit', 'J.R.R. Tolkien', '1937-09-21', 1, 95022, true),
        ('The Old Man and the Sea', 'Ernest Hemingway', '1952-09-01', 5, 26925, true),
        ('Fahrenheit 451', 'Ray Bradbury', '1953-10-19', 5, 46411, true),
        ('The Sun Also Rises', 'Ernest Hemingway', '1926-10-22', 5, 102707, true),
        ('One Hundred Years of Solitude', 'Gabriel García Márquez', '1967-05-30', 5, 41781, true),
        ('War and Peace', 'Leo Tolstoy', '1869-01-01', 5, 587287, true),
        ('A Farewell to Arms', 'Ernest Hemingway', '1929-09-27', 5, 75000, true),
        ('The Chronicles of Narnia', 'C.S. Lewis', '1950-10-16', 1, 167593, true),
        ('The Midnight Library', 'Matt Haig', '2020-08-13', 5, 99197, true),
        ('Normal People', 'Sally Rooney', '2018-08-28', 5, 263000, true),
        ('The Alchemist', 'Paulo Coelho', '1988-11-01', 4, 70300, true),
        ('Where the Crawdads Sing', 'Delia Owens', '2018-08-14', 5, 115000, true),
        ('Circe', 'Madeline Miller', '2018-04-10', 5, 105000, true),
        ('Project Hail Mary', 'Andy Weir', '2021-05-04', 1, 105000, true),
        ('The Night Circus', 'Erin Morgenstern', '2011-09-13', 4, 101000, true),
        ('The Song of Achilles', 'Madeline Miller', '2011-09-20', 5, 110000, true),
        ('The Road', 'Cormac McCarthy', '2006-09-26', 5, 58768, true),
        ('The Night Watchman', 'Louise Erdrich', '2020-03-03', 5, 127000, true),
        ('Anxious People', 'Fredrik Backman', '2019-08-27', 5, 106000, true),
        ('The Invisible Life of Addie LaRue', 'V.E. Schwab', '2020-10-06', 5, 130000, true),
        ('Harry Potter and the Sorcerer’s Stone', 'J.K. Rowling', '1997-09-01', 1, 76944, true),
        ('Slaughterhouse-Five', 'Kurt Vonnegut', '1969-03-31', 5, 27517, true),
        ('The House in the Cerulean Sea', 'TJ Klune', '2020-03-17', 5, 116000, true),
        ('The Priory of the Orange Tree', 'Samantha Shannon', '2019-02-26', 1, 198000, true),
        ('Pride and Prejudice', 'Jane Austen', '1813-01-28', 4, 122189, true);
`);

//Add data
db.exec(`
    INSERT OR REPLACE INTO shows
        (title, maker, release_date, genre_id, episodes, emmy_winner)
    VALUES 
        ('Breaking Bad', 'Vince Gilligan', '2008-01-20', 3, 62, true),
        ('Better Call Saul', 'Vince Gilligan', '2015-02-08', 3, 63, false),
        ('Star Trek: The Next Generation', 'Gene Roddenberry', '1987-09-28', 2, 178, true),
        ('The West Wing', 'Aaron Sorkin', '1999-09-22', 3, 154, true),
        ('The Wire', 'David Simon', '2002-06-02', 3, 60, false),
        ('House', 'David Shore', '2004-11-16', 3, 177, true),
        ('Chernobyl', 'Craig Mazin', '2019-05-06', 3, 5, true),
        ('The Sopranos', 'David Chase', '1999-01-10', 3, 86, true),
        ('Stranger Things', 'The Duffer Brothers', '2016-07-15', 1, 34, true),
        ('The Mandalorian', 'Jon Favreau', '2019-11-12', 2, 24, true),
        ('The Crown', 'Peter Morgan', '2016-11-04', 3, 60, true),
        ('Succession', 'Jesse Armstrong', '2018-06-03', 3, 39, true),
        ('The Witcher', 'Lauren Schmidt Hissrich', '2019-12-20', 1, 16, false),
        ('Money Heist (La Casa de Papel)', 'Álex Pina', '2017-05-02', 5, 41, true),
        ('The Boys', 'Eric Kripke', '2019-07-26', 6, 24, true),
        ('Narcos', 'Chris Brancato', '2015-08-28', 2, 30, true),
        ('Black Mirror', 'Charlie Brooker', '2011-12-04', 6, 22, true),
        ('Squid Game', 'Hwang Dong-hyuk', '2021-09-17', 6, 9, true),
        ('Severance', 'Dan Erickson', '2022-02-18', 6, 9, true),
        ('Wednesday', 'Tim Burton', '2022-11-23', 6, 8, true);
`);

//Add data
db.exec(`
    INSERT OR REPLACE INTO users
        (id, username, password, bio, fav_game_id, fav_book_id, fav_movie_id, fav_show_id, fav_genre_id)
    VALUES 
        (1, 'Harambe', '123', 'Tech enthusiast, movie lover.', NULL, NULL, 2, NULL, NULL),
        (2, 'Guru99', '123', 'Game developer, avid reader.', NULL, NULL, 2, NULL, NULL),
        (3, 'BookishBri', '123', 'Bookworm with a passion for films.', NULL, NULL, 3, NULL, NULL),
        (4, 'PixelPioneer', '123', 'Gamer by day, movie buff by night.', NULL, NULL, 4, NULL, NULL),
        (5, 'ShowSeeker', '123', 'Always exploring new shows and games.', NULL, NULL, 5, NULL, NULL),
        (6, 'CaptianPicard', '123', 'Music lover, passionate about sci-fi books.', NULL, NULL, 6, NULL, NULL),
        (7, 'FilmBuff', '123', 'Hobbyist photographer, show fanatic.', NULL, NULL, 7, NULL, NULL),
        (8, 'NickBosa', '123', 'Game addict, movie critic.', NULL, NULL, 8, NULL, NULL),
        (9, 'SciFiFan', 'password9', 'Loves all things science fiction.', 1, 3, 1, 1, 2),
        (10, 'DramaQueen', 'password10', 'Passionate about dramatic stories.', NULL, NULL, 2, 3, 3),
        (11, 'AdventureAddict', 'password11', 'Always seeking the next adventure.', NULL, 5, 4, 4, 4),
        (12, 'ComedyLover', 'password12', 'Enjoys a good laugh.', NULL, NULL, 6, 5, 6),
        (13, 'FantasyFreak', 'password13', 'Enthralled by fantasy worlds.', 1, 6, 3, 1, 1),
        (14, 'BookWorm', 'password14', 'Can’t get enough of reading.', NULL, 2, NULL, NULL, 5),
        (15, 'MovieManiac', 'password15', 'Obsessed with movies of all genres.', NULL, NULL, 7, NULL, 3),
        (16, 'ShowGuru', 'password16', 'Keeps up with every new show.', NULL, NULL, NULL, 6, 3),
        (17, 'GameMaster', 'password17', 'Avid gamer and game critic.', 1, NULL, NULL, NULL, 1),
        (18, 'CinemaBuff', 'password18', 'Passionate about cinema and film analysis.', NULL, NULL, 5, NULL, 3),
        (19, 'LiteraryLover', 'password19', 'Appreciates classic and modern literature.', NULL, 1, NULL, NULL, 5),
        (20, 'TVTuner', 'password20', 'Never misses a new TV series.', NULL, NULL, NULL, 7, 3);

`);

//Add data
db.exec(`
    INSERT OR REPLACE INTO book_reviews
        (user_id, media_id, rating, summary, text)
    VALUES 
        (1, 1, 4.0, 'Enjoyable', 'I found this book very engaging and well-written'),
        (2, 3, 3.5, 'Decent', 'A decent read with some interesting moments'),
        (3, 5, 5.0, 'Excellent', 'An outstanding book that I thoroughly enjoyed'),
        (4, 7, 2.5, 'Average', 'This book was just okay, not very memorable'),
        (5, 9, 4.5, 'Impressive', 'A compelling story that kept me hooked till the end'),
        (6, 11, 3.0, 'Okay', 'Not bad, but not exceptional either'),
        (7, 13, 5.0, 'Masterpiece', 'A must-read for fans of this genre'),
        (8, 15, 4.2, 'Well Done', 'Great characters and an interesting plot'),
        (9, 17, 2.0, 'Disappointing', 'This book did not meet my expectations'),
        (10, 19, 3.8, 'Solid', 'A solid book with a few standout moments'),
        (11, 21, 4.8, 'Fantastic', 'Highly enjoyable with excellent storytelling'),
        (12, 23, 2.8, 'Mediocre', 'Some good parts, but overall not very engaging'),
        (13, 25, 4.6, 'Captivating', 'I couldn’t put this book down'),
        (14, 27, 3.5, 'Good Effort', 'A good effort, but it fell short in some areas'),
        (15, 29, 5.0, 'Brilliant', 'Absolutely brilliant from start to finish'),
        (16, 30, 4.0, 'Great', 'A great read with memorable moments'),
        (17, 2, 3.2, 'Passable', 'Passable, but not particularly exciting'),
        (18, 4, 4.7, 'Excellent Read', 'Thoroughly enjoyed this book'),
        (19, 6, 3.0, 'Average', 'It was fine, but nothing special'),
        (20, 8, 4.9, 'Incredible', 'An incredible book that exceeded expectations'),
        (1, 10, 3.7, 'Interesting', 'This book had an intriguing premise but lost momentum midway'),
        (2, 12, 4.2, 'Thought-Provoking', 'A fascinating exploration of complex themes'),
        (3, 14, 4.5, 'Engaging', 'I was drawn in by the characters and their stories'),
        (4, 16, 2.0, 'Underwhelming', 'I expected more based on the reviews I read'),
        (5, 18, 5.0, 'Outstanding', 'This book surpassed all my expectations!'),
        (6, 20, 3.3, 'Mediocre', 'It was okay, but I wouldn’t read it again'),
        (7, 22, 4.0, 'Well-Crafted', 'A carefully crafted story with great attention to detail'),
        (8, 24, 2.5, 'Boring', 'Unfortunately, this book didn’t hold my interest'),
        (9, 26, 4.9, 'Exceptional', 'Easily one of the best books I’ve ever read'),
        (10, 28, 3.6, 'Decent', 'A decent read, though it lacked originality'),
        (11, 1, 4.8, 'Gripping', 'Couldn’t put this book down—loved every page!'),
        (12, 3, 2.2, 'Forgettable', 'I didn’t connect with the characters or the story'),
        (13, 5, 4.3, 'Imaginative', 'A creative and well-written story that held my attention'),
        (14, 7, 5, 'An Old Classic', 'Old mand and the sea is a Hemmingway Classic!'),
        (15, 9, 5.0, 'Amazing', 'A masterpiece that I’ll recommend to everyone I know'),
        (16, 11, 3.8, 'Solid Read', 'An enjoyable read with a few standout chapters'),
        (17, 13, 4.6, 'Rich', 'The world-building in this book was incredible!'),
        (18, 15, 2.7, 'Not Great', 'A few good moments, but overall it fell flat'),
        (19, 17, 3.9, 'Enjoyable', 'An enjoyable read with a satisfying conclusion'),
        (20, 19, 4.4, 'Compelling', 'A compelling story with well-drawn characters'),
        (1, 21, 2.3, 'Disappointing', 'The story had potential but didn’t deliver'),
        (2, 23, 4.7, 'Beautiful', 'A beautifully written book with a touching story'),
        (3, 25, 3.1, 'Fine', 'It was fine, but I wouldn’t go out of my way to recommend it'),
        (4, 27, 4.0, 'Captivating', 'A captivating tale with memorable characters'),
        (5, 29, 5.0, 'Phenomenal', 'One of the best books I’ve read this year'),
        (6, 30, 2.9, 'Okay', 'It had its moments but wasn’t consistently good'),
        (7, 2, 4.3, 'Well-Written', 'A well-written book with a unique perspective'),
        (8, 4, 3.5, 'Average', 'Good but not great—worth a read if you’re interested in the genre'),
        (9, 6, 5.0, 'Stellar', 'An absolutely stellar book with great pacing'),
        (10, 8, 2.5, 'Dull', 'I struggled to stay interested in this book'),
        (11, 10, 4.1, 'Charming', 'A charming and heartwarming story'),
        (12, 12, 3.2, 'Okay', 'This book was okay, but not particularly memorable'),
        (13, 14, 4.5, 'Fantastic', 'A fantastic read with a powerful message'),
        (14, 16, 1.9, 'Not Good', 'I found this book frustrating and poorly written'),
        (15, 18, 4.8, 'Wonderful', 'A wonderful story with characters I truly cared about'),
        (16, 20, 3.4, 'Average', 'A solid effort, but it lacked emotional impact'),
        (17, 22, 4.6, 'Great Read', 'A great read with excellent pacing and storytelling'),
        (18, 24, 2.6, 'Forgettable', 'Not very memorable, but not awful either'),
        (19, 26, 5.0, 'Breathtaking', 'A breathtaking story that left me speechless'),
        (20, 28, 3.7, 'Good Effort', 'A good effort with some standout parts');
`);

//Add data
db.exec(`
INSERT OR REPLACE INTO movie_reviews
    (user_id, media_id, rating, summary, text)
VALUES 
    (1, 1, 5, 'Epic and Emotional', 'The Lord of the Rings: The Return of the King is a masterpiece, wrapping up an epic journey with deep emotional moments. A must-watch for fantasy lovers!'),
    (2, 1, 4, 'Great Conclusion', 'An incredible finish to an amazing trilogy, though I feel the pacing could have been better in certain parts. Still, a fantastic movie overall.'),
    (3, 2, 5, 'Intense and Thrilling', 'The Departed kept me on the edge of my seat the entire time. The performances are top-notch, and the twists were shocking!'),
    (4, 2, 4, 'A Brilliant Crime Drama', 'Martin Scorsese does it again with a gripping story full of tension. The cast is fantastic, though I felt the ending could have been different.'),
    (5, 3, 5, 'Timeless Classic', 'The Lord of the Rings: The Fellowship of the Ring is the perfect start to an unforgettable journey. Incredible world-building and unforgettable characters.'),
    (6, 3, 4, 'Magical and Engaging', 'A magical adventure that sets the stage for the epic trilogy. Great acting and beautiful landscapes, though it takes a little while to get going.'),
    (7, 4, 5, 'Unmatched Fantasy Epic', 'The Lord of the Rings: The Two Towers is an exhilarating follow-up. Action-packed and emotionally charged with breathtaking battles.'),
    (8, 4, 4, 'Solid Sequel', 'An intense follow-up to the first film. The stakes are raised, but I think the pacing is slower than the first film. Still, a solid entry in the series.'),
    (9, 5, 5, 'Masterpiece of Tension', 'No Country for Old Men is a haunting, suspenseful film that keeps you on edge. The performances are fantastic, and the plot is hauntingly unpredictable.'),
    (10, 5, 4, 'Gripping and Dark', 'A dark and gripping crime thriller. The pacing was excellent, but I found the ending a bit too open-ended for my taste.'),
    (11, 6, 5, 'An Iconic Story', 'The Shawshank Redemption is a deeply moving and inspiring film. The performances are outstanding, and the message of hope is unforgettable.'),
    (12, 6, 5, 'A Classic Drama', 'A powerful story with fantastic acting. The only issue I had was with the pacing in the middle of the film. Still, an all-time great.'),
    (13, 7, 5, 'A Western Masterpiece', 'The Good, the Bad and the Ugly is a perfect example of why the Western genre is so iconic. Brilliant storytelling, incredible cinematography, and unforgettable characters.'),
    (14, 7, 4, 'Legendary Western', 'A brilliant Western film with unforgettable characters and an iconic soundtrack. However, it did feel a bit slow at times for my liking.'),
    (15, 8, 5, 'Heartwarming and Touching', 'Rain Man is a touching and heartwarming story about family and love. Dustin Hoffman’s performance is incredible. A must-watch for anyone who loves great drama films.'),
    (16, 8, 4, 'An Emotional Journey', 'A beautiful and emotional film. The performances were strong, but I did find some parts of the film a bit predictable.'),
    (17, 9, 5, 'A Brilliant Con Movie', 'Catch Me If You Can is a clever and entertaining film with great performances, especially from Leonardo DiCaprio. The cat-and-mouse game is thrilling.'),
    (18, 9, 4, 'Fun and Lighthearted', 'A fun and engaging movie. DiCaprio is brilliant, but the plot could have been a little more fleshed out. Still, a very entertaining watch.'),
    (19, 10, 5, 'Mind-Bending Masterpiece', 'Inception is a complex and visually stunning film. The plot will have you questioning reality, and the performances are top-tier. A must-see for fans of sci-fi and action.'),
    (20, 10, 4, 'Thought-Provoking', 'A fascinating film that explores the nature of dreams and reality. It’s a bit confusing at times, but the action and visuals are spectacular.'),
    (1, 11, 5, 'A Perfect Sci-Fi Classic', 'The Matrix is an iconic sci-fi film with groundbreaking effects and a thought-provoking story. Keanu Reeves is perfect as Neo, and the action sequences are legendary.'),
    (2, 11, 4, 'A Mind-Bending Thriller', 'A revolutionary film that changed the sci-fi genre. The concepts are mind-bending, but the pacing can be a bit slow in places.'),
    (3, 12, 5, 'An Underrated Gem', 'The Silence of the Lambs is a chilling and masterfully crafted thriller. Jodie Foster and Anthony Hopkins deliver unforgettable performances.'),
    (4, 12, 4, 'Chilling and Suspenseful', 'A brilliant psychological thriller with great performances from the cast. The story is gripping, though it can be a bit unsettling at times.'),
    (5, 13, 5, 'Epic and Heartfelt', 'Forrest Gump is a touching and heartwarming film. Tom Hanks is incredible, and the story is timeless. A must-watch for anyone who loves great drama films.'),
    (6, 13, 4, 'A Classic Drama', 'A beautiful and emotional film with a stellar performance from Tom Hanks. While the pacing can feel slow at times, the story is timeless.'),
    (7, 14, 5, 'A True Epic', 'Gladiator is an epic and emotional film. The performances, especially from Russell Crowe, are unforgettable. The story is timeless, and the action is intense.'),
    (8, 14, 4, 'A Powerful Tale', 'An emotional and powerful film with incredible action scenes. The pacing is a bit slow in the middle, but the ending is truly satisfying.'),
    (9, 15, 5, 'An Emotional Rollercoaster', 'Titanic is a breathtaking love story set against the backdrop of a historical tragedy. The performances and visuals are stunning. A true masterpiece.'),
    (10, 15, 4, 'A Heartfelt Story', 'A beautiful and tragic love story. While the romance is touching, I felt that some of the character development could have been stronger.'),
    (11, 16, 5, 'Unbelievably Good', 'Everything Everywhere All at Once is a mind-blowing and unique film. It tackles so many themes with creativity and heart. A must-see for fans of sci-fi and drama.'),
    (12, 16, 4, 'A Wild Ride', 'A bold and creative film that pushes boundaries. The storytelling is unique, but the pacing can be a bit jarring at times.'),
    (13, 17, 5, 'A Sci-Fi Masterpiece', 'Dune is an epic and visually stunning film. The world-building is incredible, and the story is gripping. It’s a slow burn but worth every minute.'),
    (14, 17, 4, 'An Incredible Journey', 'Dune is a visually stunning sci-fi epic with a complex story. While it’s a bit slow, it’s a great introduction to the world of Arrakis.'),
    (15, 18, 5, 'A Cinematic Marvel', 'Avengers: Endgame is the culmination of over a decade of storytelling, and it delivers on every level. The action, emotion, and spectacle are unmatched.'),
    (16, 18, 4, 'A Fitting End', 'A satisfying conclusion to the Avengers saga. The action scenes are incredible, though some parts felt a bit rushed.'),
    (17, 19, 5, 'A Masterpiece of Storytelling', 'Parasite is a brilliantly crafted film that blends social commentary with suspense and humor. A modern masterpiece that is unforgettable.'),
    (18, 19, 4, 'A Unique Thriller', 'Parasite is a brilliant and unique film. The twists and turns will keep you hooked, but I felt the pacing slowed down a bit in the middle.'),
    (19, 20, 5, 'Unforgettable and Intense', 'The Revenant is a raw and intense survival story. Leonardo DiCaprio’s performance is nothing short of brilliant, and the cinematography is stunning.'),
    (20, 20, 4, 'A Gripping Tale', 'A brutal and gripping story. While the cinematography is beautiful, I felt some of the pacing dragged in certain parts.'),
    (1, 21, 5, 'A Masterpiece of Storytelling', 'The Irishman is a gripping and masterfully told film. The performances from De Niro, Pacino, and Pesci are phenomenal.'),
    (2, 21, 4, 'An Engaging Crime Drama', 'A slow-burn film, but it’s engaging and rewarding. The performances are excellent, though the pacing could have been tighter.'),
    (3, 22, 5, 'Tarantino at His Best', 'Once Upon a Time in Hollywood is a love letter to classic Hollywood. The performances are incredible, and the storytelling is captivating.'),
    (4, 22, 4, 'A Fun Ride', 'A nostalgic and fun film. The acting is great, but the pacing can feel a little slow at times. Still, a unique Tarantino film.'),
    (1, 1, 4.5, 'Exciting', 'A thrilling movie that kept me on the edge of my seat'),
    (2, 3, 3.8, 'Decent', 'Good but lacked depth in some areas'),
    (3, 5, 4.9, 'Outstanding', 'An exceptional movie with brilliant performances'),
    (4, 7, 4.2, 'Solid', 'A well-made movie with a gripping story'),
    (5, 9, 5.0, 'Fantastic', 'Absolutely loved every minute of it'),
    (6, 11, 3.5, 'Entertaining', 'A fun movie, though not very original'),
    (7, 13, 4.6, 'Memorable', 'A movie I’ll be thinking about for a long time'),
    (8, 15, 3.9, 'Good', 'Good movie, but it had a few slow moments'),
    (9, 17, 4.8, 'Exceptional', 'A standout film with incredible visuals'),
    (10, 19, 3.7, 'Enjoyable', 'A decent watch with some strong performances'),
    (11, 21, 3.0, 'Great', 'An okay movie, but not my favorite'),
    (12, 23, 3.6, 'Average', 'An average film that had its moments'),
    (13, 25, 4.3, 'Engaging', 'A captivating movie with a strong narrative'),
    (14, 27, 4.7, 'Impressive', 'Impressive direction and great acting'),
    (15, 2, 3.3, 'Okay', 'An okay movie, but not very memorable'),
    (16, 4, 4.1, 'Well Done', 'A solid effort with a compelling storyline'),
    (17, 6, 5.0, 'Masterpiece', 'A masterpiece that everyone should watch'),
    (18, 8, 4.4, 'Great', 'A great movie with some standout moments'),
    (19, 10, 3.9, 'Decent', 'A decent film with some strong visuals'),
    (20, 12, 4.5, 'Thrilling', 'A thrilling movie with excellent pacing'),
    (1, 14, 3.7, 'Fine', 'It was fine, but not particularly memorable'),
    (2, 16, 4.2, 'Well-Crafted', 'A well-crafted film with an engaging story'),
    (3, 18, 4.6, 'Amazing', 'A truly amazing movie experience'),
    (4, 20, 3.8, 'Good', 'Good overall, but a bit predictable'),
    (5, 22, 4.9, 'Exceptional', 'A phenomenal movie with a touching story'),
    (6, 24, 3.5, 'Entertaining', 'A fun and lighthearted movie'),
    (7, 26, 1.7, 'Meh', 'Not Really my favorite'),
    (8, 1, 4.0, 'Nice', 'A nice movie with some memorable scenes'),
    (9, 3, 4.4, 'Engaging', 'Engaging storyline with great characters'),
    (10, 5, 3.6, 'Okay', 'Okay movie, but it lacked originality'),
    (11, 7, 5.0, 'Phenomenal', 'A phenomenal movie with great attention to detail'),
    (12, 9, 4.3, 'Good', 'A good watch with a satisfying ending'),
    (13, 11, 3.8, 'Fine', 'It was fine, though not very memorable'),
    (14, 13, 4.8, 'Fantastic', 'A fantastic movie with a compelling message'),
    (15, 15, 3.9, 'Solid', 'A solid film with a few minor flaws'),
    (16, 17, 4.5, 'Exciting', 'Exciting and well-paced from start to finish'),
    (17, 19, 3.7, 'Entertaining', 'An entertaining watch, but nothing groundbreaking'),
    (18, 21, 5.0, 'Brilliant', 'A brilliant movie that exceeded expectations'),
    (19, 23, 4.2, 'Great', 'Great performances and an engaging story'),
    (20, 25, 4.6, 'Wonderful', 'A wonderful movie with stunning visuals'),
    (1, 27, 3.4, 'Average', 'An average film with a few standout moments');
;

`);

//Add data
db.exec(`
    INSERT OR REPLACE INTO show_reviews
        (user_id, media_id, rating, summary, text)
    VALUES 
        (5, 1, 4, 'Amazing characters', 'The writing, particularly for Jesse and Walt, was phenomenal. Some of the best character development I''ve seen.'),
        (6, 1, 5, 'A masterpiece', 'Breaking Bad redefined TV. The storytelling was flawless, and every episode kept me on the edge of my seat.'),
        (7, 1, 5, 'One of the best ever', 'Breaking Bad is hands down one of the best shows ever made. The transformation of Walter White is legendary.'),
        (8, 1, 5, 'Perfect ending', 'The finale was perfect, tying up all loose ends. Not many shows manage to end on such a high note, but Breaking Bad did it right.'),
        (9, 1, 4.5, 'Amazing characters', 'Breaking Bad has some of the most complex characters in TV history.'),
        (10, 2, 5.0, 'Intriguing plot twists', 'Better Call Saul keeps you guessing with its clever storytelling.'),
        (11, 3, 4.0, 'Iconic series', 'Star Trek: The Next Generation is a classic that set the standard for sci-fi TV.'),
        (12, 4, 3.5, 'Good but inconsistent', 'The West Wing is inspiring, but some seasons have pacing issues.'),
        (13, 5, 4.5, 'Intense drama', 'The Wire offers a raw and realistic portrayal of society.'),
        (14, 6, 4.0, 'Engaging medical drama', 'House is both entertaining and thought-provoking with great performances.'),
        (15, 7, 5.0, 'Brilliant miniseries', 'Chernobyl is a meticulously crafted masterpiece that portrays the disaster with depth.'),
        (16, 8, 5.0, 'Iconic mafia drama', 'The Sopranos is a groundbreaking show with incredible character development.'),
        (17, 1, 4.0, 'Gripping storyline', 'Breaking Bad keeps you on the edge of your seat throughout the series.'),
        (18, 2, 4.5, 'Excellent character arcs', 'Better Call Saul masterfully develops its characters over time.'),
        (19, 3, 5.0, 'Timeless and influential', 'Star Trek: The Next Generation continues to inspire with its vision.'),
        (20, 4, 4.0, 'Inspirational and political', 'The West Wing offers a compelling look into the workings of the White House.'),
        (1, 1, 4.2, 'Entertaining', 'A fun and engaging show with great characters'),
        (2, 3, 3.5, 'Decent', 'An okay show with a few standout episodes'),
        (3, 5, 4.8, 'Brilliant', 'A brilliantly written series with excellent pacing'),
        (4, 7, 4.0, 'Solid', 'A solid show with strong performances'),
        (5, 9, 5.0, 'Outstanding', 'One of the best shows I’ve seen in a while'),
        (6, 11, 3.7, 'Good', 'Good show, though it felt a bit slow at times'),
        (7, 13, 4.5, 'Engaging', 'Engaging storyline with great character development'),
        (8, 15, 3.9, 'Fine', 'Fine, but not as memorable as I had hoped'),
        (9, 17, 4.7, 'Amazing', 'An amazing series with a compelling narrative'),
        (10, 19, 3.6, 'Okay', 'Okay overall, but it lacked originality'),
        (11, 2, 4.4, 'Enjoyable', 'A very enjoyable show with great chemistry among the cast'),
        (12, 4, 3.8, 'Average', 'An average series that had some high points'),
        (13, 6, 5.0, 'Phenomenal', 'A phenomenal show that kept me hooked throughout'),
        (14, 8, 4.3, 'Well-Made', 'Well-made with excellent cinematography'),
        (15, 10, 3.9, 'Decent', 'Decent overall, but a bit predictable at times'),
        (16, 12, 4.6, 'Great', 'A great show with a well-thought-out plot'),
        (17, 14, 3.7, 'Fine', 'It was fine, but lacked emotional depth'),
        (18, 16, 4.8, 'Exceptional', 'An exceptional series with incredible acting'),
        (19, 18, 3.4, 'Mediocre', 'Mediocre, with only a few interesting episodes'),
        (20, 20, 2.9, 'Fantastic', 'All over the place, cant really recommend'),
        (1, 2, 4.5, 'Interesting', 'An interesting series with some unique elements'),
        (2, 4, 4.6, 'Awesome', 'Would watch it again many times!'),
        (3, 6, 5.0, 'Spectacular', 'A spectacular series with an unforgettable ending'),
        (4, 8, 4.4, 'Good', 'Good overall, with a few standout episodes'),
        (5, 10, 4.7, 'Thrilling', 'A thrilling series that kept me on the edge of my seat'),
        (6, 12, 3.9, 'Decent', 'A decent watch, but nothing groundbreaking'),
        (7, 14, 4.5, 'Engaging', 'Engaging with well-rounded characters'),
        (8, 16, 3.8, 'Fine', 'Fine, but not as great as the reviews made it out to be'),
        (9, 18, 4.9, 'Masterpiece', 'An absolute masterpiece with stellar performances'),
        (10, 20, 3.5, 'Well-Crafted', 'A well-crafted show with a satisfying conclusion'),
        (11, 1, 3.7, 'Average', 'An average series that didn’t fully deliver on its promise'),
        (12, 3, 4.3, 'Good', 'A good show with a well-paced storyline'),
        (13, 5, 5.0, 'Amazing', 'Amazing show—highly recommend watching it'),
        (14, 7, 4.6, 'Impressive', 'An impressive series with a strong cast'),
        (15, 9, 3.8, 'Okay', 'Okay overall, but lacked depth in the later episodes'),
        (16, 11, 4.8, 'Outstanding', 'An outstanding show with a thought-provoking story'),
        (17, 13, 3.9, 'Decent', 'Decent entertainment, but not particularly memorable'),
        (18, 15, 4.7, 'Fantastic', 'A fantastic series with some unforgettable moments'),
        (19, 17, 4.0, 'Good', 'Good overall, but had a few weaker episodes'),
        (20, 19, 4.4, 'Great', 'A great show with excellent character arcs');
 
`);


//Add data
db.exec(`
-- Dark Souls 3
INSERT OR REPLACE INTO game_reviews
    (user_id, media_id, rating, summary, text)
VALUES 
    (1, 1, 5, 'Challenging and rewarding', 'Dark Souls 3 is an incredibly challenging game, but the sense of accomplishment after each victory is unmatched. The graphics and lore are fantastic. Highly recommend for anyone looking for a deep and immersive experience.'),
    (5, 1, 4, 'Difficult, but enjoyable', 'The game offers an incredible world, but it can be unforgiving at times. If you enjoy punishing difficulty and intricate combat mechanics, this is the game for you.'),
    (8, 1, 4, 'Engaging, though frustrating', 'I loved the world-building and character design in Dark Souls 3, but the difficulty spikes were frustrating. A must-play for fans of hardcore challenges.');

-- Dark Souls
INSERT OR REPLACE INTO game_reviews
    (user_id, media_id, rating, summary, text)
VALUES 
    (2, 2, 5, 'An iconic classic', 'Dark Souls is a game that defines the action RPG genre. Its atmospheric world and tough-but-fair combat make it unforgettable. The sense of exploration is unparalleled.'),
    (10, 2, 4, 'A challenging adventure', 'The combat and story are fantastic, but the difficulty might be off-putting for casual players. It’s a rewarding experience, but be prepared for frustration.'),
    (15, 2, 5, 'Masterpiece', 'Dark Souls is a game that challenges you to become better. The difficulty is daunting, but once you understand the mechanics, it becomes one of the most satisfying games ever made.');

-- Mass Effect 2
INSERT OR REPLACE INTO game_reviews
    (user_id, media_id, rating, summary, text)
VALUES 
    (3, 3, 5, 'A sci-fi masterpiece', 'Mass Effect 2 blends an incredible story with engaging characters and meaningful decisions. It’s one of the best RPGs I’ve ever played.'),
    (7, 3, 5, 'Incredible RPG', 'I loved the rich narrative and diverse cast. The choices you make actually matter, and the world-building is phenomenal. A must-play for RPG fans.'),
    (9, 3, 4, 'Great, but some pacing issues', 'Mass Effect 2 is a wonderful experience overall, but it does have some pacing issues in its middle sections. Still, the decisions and character development make up for it.');

-- Red Dead Redemption 2
INSERT OR REPLACE INTO game_reviews
    (user_id, media_id, rating, summary, text)
VALUES 
    (4, 4, 5, 'A western masterpiece', 'Red Dead Redemption 2 is a game that draws you into its world. The story is engaging, the characters are well-developed, and the world feels alive. It’s the closest thing to a perfect open-world game.'),
    (6, 4, 5, 'Unforgettable experience', 'The level of detail in Red Dead Redemption 2 is incredible. The story and interactions with NPCs are emotional and memorable. A must-play for fans of open-world games.'),
    (11, 4, 4, 'Engaging, but long', 'While I loved the story and setting, the game can feel a bit slow at times. Nonetheless, it’s a fantastic experience overall and worth playing for anyone into westerns and open-world adventures.');

-- Half-Life 2
INSERT OR REPLACE INTO game_reviews
    (user_id, media_id, rating, summary, text)
VALUES 
    (12, 5, 5, 'A classic', 'Half-Life 2 is one of the best first-person shooters ever. The atmosphere, storytelling, and innovative mechanics still hold up today. It’s a must-play for any FPS fan.'),
    (13, 5, 4, 'Great, but aged', 'Half-Life 2 remains an incredible game, though its age shows in some parts. Still, the storytelling and physics are revolutionary for its time.'),
    (16, 5, 5, 'Groundbreaking', 'Half-Life 2 changed the landscape of FPS games. The narrative, physics, and world-building were ahead of its time and make it a timeless classic.');

-- GTA IV
INSERT OR REPLACE INTO game_reviews
    (user_id, media_id, rating, summary, text)
VALUES 
    (3, 6, 4, 'A great, but flawed entry', 'GTA IV brought a fresh realism to the series, but the story pacing was a bit uneven. The open world is fantastic, though.'),
    (5, 6, 5, 'Amazing world-building', 'GTA IV is one of the best open-world games ever. The attention to detail and the story-driven approach make it stand out from the rest of the series.'),
    (7, 6, 4, 'Solid, but not the best', 'While GTA IV offers a lot of fun and a deep story, I personally prefer the more over-the-top chaos of the previous titles. Still, a great experience.');

-- The Elder Scrolls IV: Oblivion
INSERT OR REPLACE INTO game_reviews
    (user_id, media_id, rating, summary, text)
VALUES 
    (2, 7, 5, 'An RPG classic', 'Oblivion offers a vast world and an immersive RPG experience. Its open-ended gameplay is perfect for anyone who loves exploration.'),
    (14, 7, 5, 'A masterpiece', 'Oblivion holds up as one of the best RPGs ever made. The quests are varied, and the world feels alive. A timeless classic.'),
    (17, 7, 4, 'Great, but dated', 'Oblivion is still an incredible RPG, but some of its mechanics feel outdated by modern standards. Still, it’s a game I’ll never forget.');

-- Batman: Arkham City
INSERT OR REPLACE INTO game_reviews
    (user_id, media_id, rating, summary, text)
VALUES 
    (10, 8, 5, 'The definitive Batman experience', 'Arkham City provides an incredible Batman experience. The combat, exploration, and story are all top-notch, making it a must-play for fans of the Dark Knight.'),
    (18, 8, 5, 'Perfect Batman game', 'Arkham City combines amazing gameplay with an engaging story. The world is rich, and the combat is fluid and fun. It’s the best Batman game I’ve ever played.'),
    (19, 8, 4, 'Great gameplay, but short', 'Arkham City is a fantastic game with superb combat and exploration, but the story felt a bit short. Still, it’s a must-play for superhero fans.');

-- Red Dead Redemption
INSERT OR REPLACE INTO game_reviews
    (user_id, media_id, rating, summary, text)
VALUES 
    (11, 9, 5, 'A true western masterpiece', 'Red Dead Redemption tells a captivating story in a stunning open world. The characters are memorable, and the atmosphere is perfect. A must-play for any gamer.'),
    (13, 9, 4, 'Great, but a bit repetitive', 'While Red Dead Redemption offers a fantastic story and world, the gameplay can feel a bit repetitive at times. Still, it’s a game worth playing for the narrative alone.'),
    (14, 9, 5, 'An incredible open-world experience', 'Red Dead Redemption offers a deep story and an immersive world. The characters and writing are top-tier, making it one of the best games of its generation.');

-- Call of Duty: Black Ops
INSERT OR REPLACE INTO game_reviews
    (user_id, media_id, rating, summary, text)
VALUES 
    (4, 10, 4, 'Fun multiplayer', 'Black Ops offers a solid multiplayer experience. The campaign is enjoyable, but it’s the online play that truly shines.'),
    (6, 10, 5, 'Great multiplayer shooter', 'The multiplayer in Black Ops is addictive, and the campaign is memorable. The balance and variety of game modes make it a standout in the Call of Duty series.'),
    (20, 10, 3, 'Decent, but not amazing', 'Black Ops is fun, but it didn’t quite have the impact of its predecessors. The multiplayer is solid, but the campaign felt lackluster.');

-- Portal 2
INSERT OR REPLACE INTO game_reviews
    (user_id, media_id, rating, summary, text)
VALUES 
    (7, 11, 5, 'An innovative puzzle game', 'Portal 2 takes everything that made the first game great and expands it with a longer, more polished experience. The puzzles are fun, and the humor is fantastic.'),
    (12, 11, 4, 'Clever and fun', 'Portal 2 offers a fresh take on the puzzle platformer genre. The puzzles are creative, and the story is engaging. A great game overall, but it could have been a bit longer.'),
    (16, 11, 5, 'Masterpiece', 'Portal 2 is an excellent game. The puzzles are incredibly clever, and the writing is top-notch. It’s a game that’s both challenging and fun to play.');
`);

console.log("Creation successful")
