import mysql from 'mysql2/promise';
import { writeFile } from 'fs/promises';

// --- Configuration ---
const NUM_QUERIES = 10000; // Number of random queries to perform

const args = process.argv.slice(2);
const versionArg = args.find(arg => arg.startsWith('--version='));
const uuidVersion = versionArg ? versionArg.split('=')[1] : 'v4';

if (uuidVersion !== 'v4' && uuidVersion !== 'v7') {
    console.error("Invalid UUID version specified. Please use --version=v4 or --version=v7");
    process.exit(1);
}

const METRICS_FILE = `metrics-query-uuid${uuidVersion}.csv`;

const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'rootpassword',
    database: 'testdb',
};

/**
 * Shuffles an array in-place using the Fisher-Yates algorithm.
 * @param array The array to shuffle.
 */
function shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function runQueries() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Database connected successfully.');

        console.log('Fetching all item IDs. This may take a while for large datasets...');
        const [rows] = await connection.execute('SELECT id FROM items');
        const ids = (rows as { id: string }[]).map(row => row.id);
        
        if (ids.length === 0) {
            console.error('No items found in the database. Please populate the table first.');
            return;
        }
        console.log(`Successfully fetched ${ids.length} item IDs.`);

        console.log('Shuffling IDs for random selection...');
        shuffleArray(ids);
        console.log('IDs shuffled.');

        const queryTimes: number[] = [];
        console.log(`Performing ${NUM_QUERIES} random queries for uuid${uuidVersion}...`);

        for (let i = 0; i < NUM_QUERIES; i++) {
            const idToQuery = ids[i % ids.length]; 
            
            const startTime = process.hrtime.bigint();
            await connection.execute('SELECT * FROM items WHERE id = ?', [idToQuery]);
            const endTime = process.hrtime.bigint();
            
            const durationMs = Number(endTime - startTime) / 1e6;
            queryTimes.push(durationMs);

            if ((i + 1) % 500 === 0) {
                console.log(`Executed ${i + 1}/${NUM_QUERIES} queries...`);
            }
        }

        console.log('Finished executing queries.');

        const csvContent = 'query_time_ms\n' + queryTimes.join('\n');
        await writeFile(METRICS_FILE, csvContent);

        console.log(`Query performance metrics saved to ${METRICS_FILE}`);

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
}

runQueries().catch(err => {
    console.error(`Failed to run queries for uuid${uuidVersion}:`, err);
    process.exit(1);
});
