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

    INSERT OR REPLACE INTO genres
        (genre)
    VALUES 
        ('Fantasy'),
        ('Science Fiction'),
        ('Drama'),
        ('Adventure'),
        ('Fiction'),
        ('Comedy');

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
        ('The Chronicles of Narnia', 'C.S. Lewis', '1950-10-16', 1, 167593, true);

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
        ('Field of Dreams', 'Phil Robinson', '1989-04-21', 5, 107, true);

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
        ('The Sopranos', 'David Chase', '1999-01-10', 3, 86, true);

    INSERT OR REPLACE INTO games
        (title, maker, release_date, genre_id, platform, multiplayer)
    VALUES 
        ('Dark Souls 3', 'FromSoftware', '2016-03-24', 1, 'PC', true);

    INSERT OR REPLACE INTO users
        (id, username, password, bio, fav_movie_id)
    VALUES 
        (1, 'Harambe', '123', 'Tech enthusiast, movie lover.', 2),
        (2, 'Guru99', '123', 'Game developer, avid reader.', 2),
        (3, 'BookishBri', '123', 'Bookworm with a passion for films.', 3),
        (4, 'PixelPioneer', '123', 'Gamer by day, movie buff by night.', 4),
        (5, 'ShowSeeker', '123', 'Always exploring new shows and games.', 5),
        (6, 'CaptianPicard', '123', 'Music lover, passionate about sci-fi books.', 6),
        (7, 'FilmBuff', '123', 'Hobbyist photographer, show fanatic.', 7),
        (8, 'NickBosa', '123', 'Game addict, movie critic.', 8);

    INSERT OR REPLACE INTO book_reviews
        (user_id, media_id, rating, summary, text)
    VALUES 
        (1, 2, 4.5, 'Good', 'This was a good book');

INSERT OR REPLACE INTO movie_reviews
    (user_id, media_id, rating, summary, text)
VALUES
    (1, 1, 5, 'Epic conclusion to the trilogy', 'The Return of the King is a masterpiece. The visuals, the storytelling, and the emotional depth make it one of the best movies ever made.'),
    (2, 1, 4, 'A grand finale', 'A bit long but an absolutely amazing finish to a great trilogy. Peter Jackson outdid himself.'),
    (5, 1, 5, 'Perfect in every way', 'I was moved to tears by the beauty of this film. It perfectly wraps up the trilogy with heart and action.'),
    (2, 2, 4, 'Intense and thrilling', 'The Departed keeps you on the edge of your seat. The performances by the cast are phenomenal, especially DiCaprio and Nicholson.'),
    (3, 2, 3, 'Good but a bit overhyped', 'Great performances but the plot was hard to follow at times. Still a solid thriller.'),
    (5, 2, 5, 'Scorsese at his best', 'This movie is a masterpiece. The tension, the action, and the performances all make it one of Scorsese’s finest.'),
    (4, 2, 4, 'Gripping crime drama', 'The Departed delivers on all fronts: great acting, an intriguing plot, and nonstop intensity. However, it was a bit long.'),
    (1, 2, 5, 'Flawless storytelling', 'Every scene in The Departed serves a purpose. The way the story unfolds is masterful, and the ending left me stunned.'),
    (6, 2, 4, 'Great acting, but convoluted', 'I loved the performances by everyone, but the story was a bit hard to follow. Still a fantastic movie overall.'),
    (7, 2, 5, 'A modern crime classic', 'The Departed is a brilliantly executed crime drama with incredible performances by DiCaprio and Damon.'),
    (8, 2, 4, 'Suspenseful and gritty', 'The Departed is gritty, intense, and full of suspense. While it gets a bit complicated, the payoff is well worth it.'),
    (5, 2, 5, 'Incredible performances and direction', 'Scorsese’s direction in The Departed is incredible. It’s thrilling from start to finish and one of his best films.'),
    (3, 2, 4, 'Strong but a bit long', 'A great movie with strong performances, but it couldve been trimmed down. Still, a must-watch for crime drama fans.'),
    (3, 3, 5, 'A magical beginning', 'The Fellowship of the Ring sets the stage for an incredible journey. The world-building is spectacular and Peter Jackson brings Middle-earth to life.'),
    (4, 3, 4, 'Great start to a legendary trilogy', 'The movie does a fantastic job setting up the world of Middle-earth, though it felt a bit slow at times.'),
    (7, 3, 5, 'Absolutely stunning', 'The cinematography, the cast, the story – everything is just incredible! It’s the start of something legendary.'),
    (4, 4, 4, 'An epic middle chapter', 'The Two Towers is darker and more action-packed than the first. It excels in character development and visual effects.'),
    (6, 4, 5, 'Even better than the first', 'This one has a better balance of action and drama. The battle scenes are incredible!'),
    (5, 5, 5, 'Chilling and gripping', 'No Country for Old Men is a brilliantly crafted film with outstanding performances. The tension never lets up.'),
    (1, 5, 5, 'A modern masterpiece', 'Everything about this film is perfection. The Coen brothers know how to create atmosphere and tension.'),
    (3, 5, 4, 'Dark and compelling', 'The movie is a bit slow in parts but the performances and dialogue make up for it. Chigurh is one of the best villains ever.'),
    (8, 5, 4, 'Not for everyone but brilliant', 'This movie is a bit slow and brooding, but if you’re in the mood for something dark and tense, this is perfect.'),
    (6, 6, 5, 'A timeless classic', 'The Shawshank Redemption is an inspirational story about hope and friendship. Tim Robbins and Morgan Freeman are extraordinary.'),
    (4, 6, 5, 'Perfect film', 'This movie has it all – heart, emotion, and great storytelling. I never get tired of watching it.'),
    (7, 7, 4, 'An unforgettable western', 'The Good, the Bad and the Ugly is a classic for a reason. The cinematography and score are legendary.'),
    (8, 8, 4, 'Heartwarming and thoughtful', 'Rain Man tells a touching story with incredible performances by Dustin Hoffman and Tom Cruise.'),
    (1, 8, 5, 'Great performances, great story', 'Dustin Hoffman and Tom Cruise play off each other so well. A touching story that resonates.'),
    (5, 8, 4, 'Touching and insightful', 'Rain Man is not only a heartwarming film but also a great look at the challenges of autism.'),
    (1, 9, 3, 'Fun but a bit long', 'Catch Me If You Can is entertaining but could have been shorter. DiCaprio and Hanks are great, though.'),
    (3, 9, 4, 'Entertaining and fun', 'A fun ride with great performances by DiCaprio and Hanks. The story keeps you engaged throughout.'),
    (2, 10, 5, 'Mind-bending thriller', 'Inception is one of the most unique films I’ve seen. The concept is brilliant, and the execution is near perfect.'),
    (4, 10, 4, 'Visually stunning and complex', 'The visuals are amazing, and the plot keeps you thinking. However, it’s a bit confusing at times.'),
    (6, 10, 5, 'A cinematic masterpiece', 'Nolan created a mind-blowing experience with Inception. It’s the perfect blend of story and spectacle.'),
    (3, 11, 4, 'Inspirational sports drama', 'Field of Dreams is a feel-good movie with heart. It taps into the magic of baseball and the importance of dreams.');


    INSERT OR REPLACE INTO game_reviews
        (user_id, media_id, rating, summary, text)
    VALUES 
        (1, 1, 5, 'Good', 'This was a good game');

    INSERT OR REPLACE INTO show_reviews
        (user_id, media_id, rating, summary, text)
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
