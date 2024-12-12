// Import necessary modules
const Database = require('better-sqlite3');
const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');
const path = require('path');
const stream = require('stream');

// Connect to the database
const db = new Database('database.db');

// Prepare SQL statements
const insertTitleStmt = db.prepare(`
    INSERT OR IGNORE INTO IMDbTitles (tconst, primary_title, original_title)
  VALUES (?, ?, ?)
`);

const insertRatingStmt = db.prepare(`
    INSERT OR IGNORE INTO IMDbRatings (tconst, average_rating, num_votes)
  VALUES (?, ?, ?)
`);

// Function to get all tconsts from ratings file
function getTconstsFromRatings() {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, 'title.ratings.tsv.gz');
        const tconstSet = new Set();

        const fileStream = fs.createReadStream(filePath);
        const gzipStream = zlib.createGunzip();
        const rl = readline.createInterface({
            input: stream.pipeline(fileStream, gzipStream, (err) => {
                if (err) reject(err);
            }),
            crlfDelay: Infinity,
        });

        let isFirstLine = true;

        rl.on('line', (line) => {
            if (isFirstLine) {
                isFirstLine = false;
                return;
            }

            const columns = line.split('\t');
            const tconst = columns[0];
            tconstSet.add(tconst);
        });

        rl.on('close', () => {
            resolve(tconstSet);
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
}

// Function to import titles (only those present in ratings)
function importTitles(tconstSet) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, 'title.basics.tsv.gz');
        const batchSize = 10000; // Adjust batch size as needed
        let batch = [];

        const fileStream = fs.createReadStream(filePath);
        const gzipStream = zlib.createGunzip();
        const rl = readline.createInterface({
            input: stream.pipeline(fileStream, gzipStream, (err) => {
                if (err) reject(err);
            }),
            crlfDelay: Infinity,
        });

        let isFirstLine = true;

        rl.on('line', (line) => {
            if (isFirstLine) {
                isFirstLine = false;
                return;
            }

            const columns = line.split('\t');

            // Extract necessary fields
            const tconst = columns[0];

            // Only import titles that are in the ratings tconst set
            if (tconstSet.has(tconst)) {
                const primaryTitle = columns[2];
                const originalTitle = columns[3];

                batch.push({ tconst, primaryTitle, originalTitle });

                // When batch size is reached, insert records
                if (batch.length >= batchSize) {
                    db.transaction(() => {
                        for (const record of batch) {
                            insertTitleStmt.run(record.tconst, record.primaryTitle, record.originalTitle);
                        }
                    })();
                    batch = [];
                }
            }
        });

        rl.on('close', () => {
            // Insert any remaining records
            if (batch.length > 0) {
                db.transaction(() => {
                    for (const record of batch) {
                        insertTitleStmt.run(record.tconst, record.primaryTitle, record.originalTitle);
                    }
                })();
            }
            console.log('Titles import completed.');
            resolve();
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
}

// Function to import ratings
function importRatings() {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, 'title.ratings.tsv.gz');
        const batchSize = 10000; // Adjust batch size as needed
        let batch = [];

        const fileStream = fs.createReadStream(filePath);
        const gzipStream = zlib.createGunzip();
        const rl = readline.createInterface({
            input: stream.pipeline(fileStream, gzipStream, (err) => {
                if (err) reject(err);
            }),
            crlfDelay: Infinity,
        });

        let isFirstLine = true;

        rl.on('line', (line) => {
            if (isFirstLine) {
                isFirstLine = false;
                return;
            }

            const columns = line.split('\t');

            // Extract necessary fields
            const tconst = columns[0];
            const averageRating = parseFloat(columns[1]);
            const numVotes = parseInt(columns[2], 10);

            batch.push({ tconst, averageRating, numVotes });

            // When batch size is reached, insert records
            if (batch.length >= batchSize) {
                db.transaction(() => {
                    for (const record of batch) {
                        insertRatingStmt.run(record.tconst, record.averageRating, record.numVotes);
                    }
                })();
                batch = [];
            }
        });

        rl.on('close', () => {
            // Insert any remaining records
            if (batch.length > 0) {
                db.transaction(() => {
                    for (const record of batch) {
                        insertRatingStmt.run(record.tconst, record.averageRating, record.numVotes);
                    }
                })();
            }
            console.log('Ratings import completed.');
            resolve();
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
}

// Main function to run imports
async function main() {
    try {
        console.time('Total Time');
        console.log('Starting import...');

        // Step 1: Get tconsts from ratings file
        console.log('Reading tconsts from ratings file...');
        const tconstSet = await getTconstsFromRatings();
        console.log(`Total tconsts in ratings: ${tconstSet.size}`);

        // Step 2: Import titles for tconsts in ratings
        await importTitles(tconstSet);

        // Step 3: Import ratings
        await importRatings();

        console.log('All data imported successfully.');
        console.timeEnd('Total Time');

        db.close();
    } catch (err) {
        console.error('An error occurred:', err);
        db.close();
    }
}

main();
