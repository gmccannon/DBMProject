const fs = require('fs');
const readline = require('readline');
const zlib = require('zlib');
const Database = require('better-sqlite3');

const db = new Database('database.db');

// Function to import IMDb data into the database
async function importIMDbData() {
    try {
        // Prepare statements for database operations
        const insertGenreStmt = db.prepare('INSERT OR IGNORE INTO genres (genre) VALUES (?)');
        const getGenreIdStmt = db.prepare('SELECT id FROM genres WHERE genre = ?');

        const insertMovieStmt = db.prepare(`
            INSERT OR IGNORE INTO movies (title, maker, release_date, genre_id, duration, oscar_winner)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const insertShowStmt = db.prepare(`
            INSERT OR IGNORE INTO shows (title, maker, release_date, genre_id, episodes, emmy_winner)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        // Start a transaction for better performance
        const insertDataTransaction = db.transaction((data) => {
            data.forEach((item) => {
                if (item.type === 'movie') {
                    insertMovieStmt.run(
                        item.title,
                        item.maker,
                        item.releaseDate,
                        item.genreId,
                        item.duration,
                        item.oscarWinner
                    );
                } else if (item.type === 'show') {
                    insertShowStmt.run(
                        item.title,
                        item.maker,
                        item.releaseDate,
                        item.genreId,
                        item.episodes,
                        item.emmyWinner
                    );
                }
            });
        });

        // Read and process the title.basics.tsv.gz file
        const rl = readline.createInterface({
            input: fs.createReadStream('title.basics.tsv.gz').pipe(zlib.createGunzip()),
            crlfDelay: Infinity,
        });

        // We need to build a mapping of tconst to episode counts for shows
        const showEpisodes = await getShowEpisodeCounts();

        let lineNumber = 0;
        const dataBatch = [];
        const batchSize = 10000; // Adjust based on your memory constraints

        for await (const line of rl) {
            lineNumber++;

            // Skip header
            if (lineNumber === 1) continue;

            const columns = line.split('\t');

            const tconst = columns[0];
            const titleType = columns[1];
            const primaryTitle = columns[2];
            const isAdult = columns[4];
            const startYear = columns[5];
            const runtimeMinutes = columns[7];
            const genres = columns[8];

            // Skip adult titles
            if (isAdult === '1') continue;

            // Process only movies and TV series
            if (titleType !== 'movie' && titleType !== 'tvSeries') continue;

            // Skip if essential data is missing
            if (!primaryTitle || startYear === '\\N') continue;

            // Convert startYear to releaseDate
            const releaseDate = `${startYear}-01-01`;

            // Skip if releaseDate is in the future
            if (new Date(releaseDate) > new Date()) continue;

            // Handle genres (taking the first genre)
            let genreId = null;
            if (genres && genres !== '\\N') {
                const genreName = genres.split(',')[0];

                // Insert genre into the genres table if it doesn't exist
                insertGenreStmt.run(genreName);

                // Get the genre_id
                const genreRow = getGenreIdStmt.get(genreName);
                genreId = genreRow ? genreRow.id : null;
            }

            // Handle duration
            let duration = null;
            if (runtimeMinutes && runtimeMinutes !== '\\N') {
                const parsedDuration = parseInt(runtimeMinutes, 10);
                duration = isNaN(parsedDuration) || parsedDuration <= 0 ? null : parsedDuration;
            }

            // Default values for fields not provided
            const maker = 'Unknown';
            const oscarWinner = 0; // Use 0 instead of false
            const emmyWinner = 0;  // Use 0 instead of false

            // Prepare data item
            if (titleType === 'movie') {
                // Ensure duration is not null and complies with CHECK constraint
                if (duration === null) continue; // Skip movies without valid duration

                const dataItem = {
                    type: 'movie',
                    title: primaryTitle,
                    maker,
                    releaseDate,
                    genreId,
                    duration,
                    oscarWinner, // Now an integer
                };

                dataBatch.push(dataItem);
            } else if (titleType === 'tvSeries') {
                // Get episode count from the mapping
                const episodes = showEpisodes[tconst] || null;

                // Ensure episodes is a positive integer
                if (!episodes || episodes <= 0) continue; // Skip shows without valid episode count

                const dataItem = {
                    type: 'show',
                    title: primaryTitle,
                    maker,
                    releaseDate,
                    genreId,
                    episodes,
                    emmyWinner, // Now an integer
                };

                dataBatch.push(dataItem);
            }

            // Insert in batches to optimize performance
            if (dataBatch.length >= batchSize) {
                insertDataTransaction(dataBatch);
                dataBatch.length = 0; // Clear the batch
            }
        }

        // Insert any remaining data
        if (dataBatch.length > 0) {
            insertDataTransaction(dataBatch);
        }

        console.log('IMDb data import completed successfully.');
    } catch (error) {
        console.error('Error importing IMDb data:', error);
    }
}

// Function to get episode counts for TV series
async function getShowEpisodeCounts() {
    return new Promise((resolve, reject) => {
        const showEpisodes = {};

        // Read and process the title.episode.tsv.gz file
        const rl = readline.createInterface({
            input: fs.createReadStream('title.episode.tsv.gz').pipe(zlib.createGunzip()),
            crlfDelay: Infinity,
        });

        let lineNumber = 0;

        rl.on('line', (line) => {
            lineNumber++;

            // Skip header
            if (lineNumber === 1) return;

            const columns = line.split('\t');

            const tconst = columns[0];
            const parentTconst = columns[1];

            if (parentTconst && parentTconst !== '\\N') {
                // Increment episode count for the parent series
                if (!showEpisodes[parentTconst]) {
                    showEpisodes[parentTconst] = 1;
                } else {
                    showEpisodes[parentTconst]++;
                }
            }
        });

        rl.on('close', () => {
            resolve(showEpisodes);
        });

        rl.on('error', (error) => {
            reject(error);
        });
    });
}

// Call the function to start the import process
importIMDbData();