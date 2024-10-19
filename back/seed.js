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
        image_url VARCHAR,
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
        image_url VARCHAR, -- Added image_url column
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
        image_url VARCHAR, -- Added image_url column
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
        image_url VARCHAR, -- Added image_url column
        platform VARCHAR NOT NULL CHECK (platform IN ('PC', 'Console', 'Mobile')), -- Limit platforms to specific values
        multiplayer BOOLEAN DEFAULT FALSE, -- Default to false if not specified
        FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL -- Set to NULL if genre is deleted
    );

    CREATE TABLE game_reviews (
        user_id INTEGER NOT NULL,
        game_id INTEGER NOT NULL,
        rating REAL NOT NULL CHECK (rating BETWEEN 0.5 AND 5), -- Rating must be between 0.5 and 5
        summary VARCHAR,
        text VARCHAR NOT NULL,
        PRIMARY KEY (user_id, game_id), -- Composite primary key to ensure a user can only review a game once
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete reviews if user is deleted
        FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE -- Delete reviews if game is deleted
    );

    CREATE TABLE movie_reviews (
        user_id INTEGER NOT NULL,
        movie_id INTEGER NOT NULL,
        rating REAL NOT NULL CHECK (rating BETWEEN 0.5 AND 5), -- Rating must be between 0.5 and 5
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
        rating REAL NOT NULL CHECK (rating BETWEEN 0.5 AND 5), -- Rating must be between 0.5 and 5
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
        (title, author, publication_date, genre_id, image_url, word_count, best_seller) -- Added image_url
    VALUES 
        ('Don Quixote', 'Miguel de Cervantes', '1605-01-16', 4, 'https://images.unsplash.com/photo-1584697964380-ec1962d71358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxkb24lMjFxdGljaG98ZW58MHx8fHwxNjk2MjU3MzI5&ixlib=rb-4.0.3&q=80&w=400', 383748, true),
        ('For Whom the Bell Tolls', 'Ernest Hemingway', '1940-10-21', 5, 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxmb3IlMjB3aG9tJTIwdGhlJTIwYmVsbCUyMHRvbGxzfGVufDB8fHx8MTY5NjI1NzQ0OA&ixlib=rb-4.0.3&q=80&w=400', 174106, true),
        ('The Lord of the Rings', 'J.R.R. Tolkien', '1954-07-29', 1, 'https://images.unsplash.com/photo-1616535037871-4f4cde309a2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHx0aGUlMjBsb3JkJTIwb2YlMjB0aGUlMjByaW5nc3xlbnwwfHx8fDE2OTYyNTc0NjI&ixlib=rb-4.0.3&q=80&w=400', 455125, true),
        ('Nineteen Eighty-Four', 'George Orwell', '1949-06-08', 5, 'https://images.unsplash.com/photo-1544933740-d92da0e7e147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxuaW5ldGVlbiUyMGVpZ2h0eSZ8MHx8fHwxNjk2MjU3NDY2&ixlib=rb-4.0.3&q=80&w=400', 88442, true),
        ('Animal Farm', 'George Orwell', '1945-08-17', 5, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBmYXJtfGVufDB8fHx8MTY5NjI1NzQ4OQ&ixlib=rb-4.0.3&q=80&w=400', 29966, true),
        ('The Hobbit', 'J.R.R. Tolkien', '1937-09-21', 1, 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHx0aGUlMjBob2JiaXR8ZW58MHx8fHwxNjk2MjU3NDk0&ixlib=rb-4.0.3&q=80&w=400', 95022, true),
        ('The Old Man and the Sea', 'Ernest Hemingway', '1952-09-01', 5, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHx0aGUlMjBvbGQlMjBtYW4lMjBhbmQlMjB0aGUlMjBTZWF8ZW58MHx8fHwxNjk2MjU3NTA0&ixlib=rb-4.0.3&q=80&w=400', 26925, true),
        ('Fahrenheit 451', 'Ray Bradbury', '1953-10-19', 5, 'https://images.unsplash.com/photo-1549924231-f129b911e442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxGYXJoZW5oaXRzJTIwNDUxfGVufDB8fHx8MTY5NjI1NzU0NQ&ixlib=rb-4.0.3&q=80&w=400', 46411, true),
        ('Brave New World', 'Aldous Huxley', '1932-08-30', 5, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxCcmF2ZSUyME5ldyUyMFdvcmxkfGVufDB8fHx8MTY5NjI1NzU1MQ&ixlib=rb-4.0.3&q=80&w=400', 63210, true),
        ('One Hundred Years of Solitude', 'Gabriel García Márquez', '1967-05-30', 4, 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxPbmUlMjBIdW5kcmVkJTIwWWVhcmRzJTIwT2YlMjBTb2xpdHVkaXRlfGVufDB8fHx8MTY5NjI1NzU1NQ&ixlib=rb-4.0.3&q=80&w=400', 41781, true),
        ('Slaughterhouse-Five', 'Kurt Vonnegut', '1969-03-31', 5, 'https://images.unsplash.com/photo-1544717305-2782549b5136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxTbGF1Z2h0ZXJob3VzZSUyRjV8ZW58MHx8fHwxNjk2MjU3NTUy&ixlib=rb-4.0.3&q=80&w=400', 27528, true),
        ('The Bell Jar', 'Sylvia Plath', '1963-01-14', 5, 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxUaGUlMjBCZWxsJTIwSmFyfGVufDB8fHx8MTY5NjI1NzU1Ng&ixlib=rb-4.0.3&q=80&w=400', 74300, true),
        ('The Chronicles of Narnia', 'C.S. Lewis', '1950-10-16', 1, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxUaGUlMjBDaHJvbm9saWNlfGVufDB8fHx8MTY5NjI1NzU3MQ&ixlib=rb-4.0.3&q=80&w=400', 167593, true);

    INSERT OR REPLACE INTO movies
        (title, director, release_date, genre_id, image_url, duration, oscar_winner)
    VALUES 
        ('The Lord of the Rings: The Return of the King', 'Peter Jackson', '2003-12-17', 1, 'https://images.unsplash.com/photo-1599499231823-0038a63c8b1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHx0aGUlMjBsb3JkJTIwb2YlMjB0aGUlMjByaW5nc3xlbnwwfHx8fDE2OTYyNTc1MzU&ixlib=rb-4.0.3&q=80&w=400', 201, true),
        ('The Departed', 'Martin Scorsese', '2006-10-06', 3, 'https://images.unsplash.com/photo-1526318472351-bc0a15c8ed6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHx0aGUlMjBEZXBhcnRlZHxlbnwwfHx8fDE2OTYyNTc1NDU&ixlib=rb-4.0.3&q=80&w=400', 151, true),
        ('The Lord of the Rings: The Fellowship of the Ring', 'Peter Jackson', '2001-12-19', 1, 'https://images.unsplash.com/photo-1515899111553-bade8d4c1be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHx0aGUlMjBsb3JkJTIwb2YlMjB0aGUlMjByaW5nc3xlbnwwfHx8fDE2OTYyNTc1NTM&ixlib=rb-4.0.3&q=80&w=400', 178, true),
        ('The Lord of the Rings: The Two Towers', 'Peter Jackson', '2002-12-18', 1, 'https://images.unsplash.com/photo-1545259742-8ecb23c7b4c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHx0aGUlMjBsb3JkJTIwb2YlMjB0aGUlMjBSaW5nc3xlbnwwfHx8fDE2OTYyNTc1NTY&ixlib=rb-4.0.3&q=80&w=400', 179, true),
        ('No Country for Old Men', 'Ethan Coen', '2007-11-21', 3, 'https://images.unsplash.com/photo-1502720705749-3c71d39d2de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxObyUyMENvdW50cnklMjBmb3IlMjBPbGQlMjBNZW58ZW58MHx8fHwxNjk2MjU3NTU0&ixlib=rb-4.0.3&q=80&w=400', 122, true),
        ('The Shawshank Redemption', 'Frank Darabont', '1994-09-23', 4, 'https://images.unsplash.com/photo-1589137814173-6db304adf78c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxUaGUlMjBTaGF3c2hhbmt8ZW58MHx8fHwxNjk2MjU3NTU1&ixlib=rb-4.0.3&q=80&w=400', 142, true),
        ('Pulp Fiction', 'Quentin Tarantino', '1994-10-14', 3, 'https://images.unsplash.com/photo-1544717305-2782549b5136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxQdWxwJTIwRmljdGlvbnxlbnwwfHx8fDE2OTYyNTc1NTc&ixlib=rb-4.0.3&q=80&w=400', 154, true),
        ('The Godfather', 'Francis Ford Coppola', '1972-03-24', 4, 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxUaGUlMjBHaW9kZmF0aGVyfGVufDB8fHx8MTY5NjI1NzU2OA&ixlib=rb-4.0.3&q=80&w=400', 175, true),
        ('Fight Club', 'David Fincher', '1999-10-15', 3, 'https://images.unsplash.com/photo-1505954375965-4e0ef5a8b70d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxGaWdodCUyMENsdWJ8ZW58MHx8fHwxNjk2MjU3NTYy&ixlib=rb-4.0.3&q=80&w=400', 139, false),
        ('Schindler''s List', 'Steven Spielberg', '1993-12-15', 4, 'https://images.unsplash.com/photo-1609778066034-c8b3c11c7e1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxTY2hpbmRsZXJzfGVufDB8fHx8MTY5NjI1NzU2Nw&ixlib=rb-4.0.3&q=80&w=400', 195, true),
        ('Inception', 'Christopher Nolan', '2010-07-16', 1, 'https://images.unsplash.com/photo-1580718737314-8a6d2e755117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxJbmNlcHRpb259ZW58MHx8fHwxNjk2MjU3NTc4&ixlib=rb-4.0.3&q=80&w=400', 148, false);

    INSERT OR REPLACE INTO shows
        (title, writer, release_date, genre_id, image_url, episodes, emmy_winner) -- Added image_url
    VALUES 
        ('Breaking Bad', 'Vince Gilligan', '2008-01-20', 3, 'https://images.unsplash.com/photo-1587574299337-082c0e45f17d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxCcmVha2luZyUyMEJhZHxlbnwwfHx8fDE2OTYyNTc1OTg&ixlib=rb-4.0.3&q=80&w=400', 62, true),
        ('Better Call Saul', 'Vince Gilligan', '2015-02-08', 3, 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxCZXR0ZXIlMjBDYWxsJTIwU2F1bHx8MHx8fHwxNjk2MjU3NjEw&ixlib=rb-4.0.3&q=80&w=400', 63, false),
        ('Star Trek: The Next Generation', 'Gene Roddenberry', '1987-09-28', 2, 'https://images.unsplash.com/photo-1587210944359-d9b81c1af94d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxTdGFyJTIwVHJlayUyMFRoZSUyME5leHQlMjBHZW5lcmF0aW9ufGVufDB8fHx8MTY5NjI1NzYxMA&ixlib=rb-4.0.3&q=80&w=400', 178, true),
        ('The West Wing', 'Aaron Sorkin', '1999-09-22', 3, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxUaGUlMjBXZXN0JTIwV2luZ3xlbnwwfHx8fDE2OTYyNTc2MjE&ixlib=rb-4.0.3&q=80&w=400', 154, true),
        ('The Wire', 'David Simon', '2002-06-02', 3, 'https://images.unsplash.com/photo-1517686469429-1b3ef6ee597b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxUaGUlMjBXaXJlfGVufDB8fHx8MTY5NjI1NzYyMQ&ixlib=rb-4.0.3&q=80&w=400', 60, false),
        ('House', 'David Shore', '2004-11-16', 3, 'https://images.unsplash.com/photo-1529665253569-6d01c0eaf5b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxIb3VzZXxlbnwwfHx8fDE2OTYyNTc2Mjc&ixlib=rb-4.0.3&q=80&w=400', 177, true),
        ('Game of Thrones', 'David Benioff and D.B. Weiss', '2011-04-17', 2, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxHYW1lJTIwT2YlMjBUaHJvbmVzfGVufDB8fHx8MTY5NjI1NzYyOA&ixlib=rb-4.0.3&q=80&w=400', 73, true),
        ('The Sopranos', 'David Chase', '1999-01-10', 2, 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxUaGUlMjBTb3ByYW5vfGVufDB8fHx8MTY5NjI1NzYzMQ&ixlib=rb-4.0.3&q=80&w=400', 86, true);

    INSERT OR REPLACE INTO games
        (title, studio, release_date, genre_id, image_url, platform, multiplayer) -- Added image_url
    VALUES 
        ('Dark Souls 3', 'FromSoftware', '2016-03-24', 1, 'https://images.unsplash.com/photo-1580746216268-a87a4cfb9670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxEYXJrJTIwU291bHN8ZW58MHx8fHwxNjk2MjU3NjU3&ixlib=rb-4.0.3&q=80&w=400'),
        ('The Witcher 3: Wild Hunt', 'CD Projekt Red', '2015-05-19', 1, 'https://images.unsplash.com/photo-1600289019530-6b9a5b489096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxUaGUlMjBXaXRjaGVyJTIwMyUyMFdpbGR8ZW58MHx8fHwxNjk2MjU3NjYy&ixlib=rb-4.0.3&q=80&w=400'),
        ('God of War', 'Santa Monica Studio', '2018-04-20', 3, 'https://images.unsplash.com/photo-1512427691650-bf4accc2bcca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxHb2QlMjBvZiUyMFdhcnxlbnwwfHx8fDE2OTYyNTc2NjA&ixlib=rb-4.0.3&q=80&w=400'),
        ('Minecraft', 'Mojang Studios', '2011-11-18', 2, 'https://images.unsplash.com/photo-1534790566855-57c71a39d52e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxNaW5lY3JhZnR8ZW58MHx8fHwxNjk2MjU3NjY5&ixlib=rb-4.0.3&q=80&w=400'),
        ('Fortnite', 'Epic Games', '2017-07-25', 2, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc2ODN8MHwxfHNlYXJjaHwxfHxGb3J0bml0ZXxlbnwwfHx8fDE2OTYyNTc3MTE&ixlib=rb-4.0.3&q=80&w=400');

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
        (2, 2, 4.5, 'Very Good', 'Like the other guy I liked this movie');

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
