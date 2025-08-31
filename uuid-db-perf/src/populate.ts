import mysql from 'mysql2/promise';
import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';
import { faker } from '@faker-js/faker';
import { createWriteStream } from 'fs';
import { performance } from 'perf_hooks';

// --- Configuration ---
const TOTAL_ITEMS = 10_000_000; // 10 million.
const BATCH_SIZE = 500;
const LOG_INTERVAL = 10_000;

const args = process.argv.slice(2);
const versionArg = args.find(arg => arg.startsWith('--version='));
const uuidVersion = versionArg ? versionArg.split('=')[1] : 'v4';

if (uuidVersion !== 'v4' && uuidVersion !== 'v7') {
    console.error("Invalid UUID version specified. Please use --version=v4 or --version=v7");
    process.exit(1);
}

const METRICS_FILE = `metrics-uuid${uuidVersion}.csv`;
const uuid = {
    v4: uuidv4,
    v7: uuidv7,
}[uuidVersion as 'v4' | 'v7'];


const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'rootpassword',
    database: 'testdb',
};

async function main() {
    console.log(`Starting database population process for uuid${uuidVersion}...`);
    const connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established.');

    // Clear the table before populating
    console.log('Clearing existing items from the table...');
    await connection.execute('TRUNCATE TABLE items');


    const writeStream = createWriteStream(METRICS_FILE);
    writeStream.write('itemCount,insertTimeMs\n');

    let totalItemsInserted = 0;
    const totalStartTime = performance.now();

    console.log(`Preparing to insert ${TOTAL_ITEMS} items in batches of ${BATCH_SIZE}...`);

    while (totalItemsInserted < TOTAL_ITEMS) {
        const itemsToInsert = Math.min(BATCH_SIZE, TOTAL_ITEMS - totalItemsInserted);
        const values: any[] = [];
        let sql = 'INSERT INTO items (id, name, price) VALUES ';

        for (let i = 0; i < itemsToInsert; i++) {
            const id = uuid().replace(/-/g, '');
            const name = faker.commerce.productName();
            const price = parseFloat(faker.commerce.price({ min: 100, max: 5000, dec: 0 }));
            values.push(id, name, price);
            sql += '(?, ?, ?),';
        }

        sql = sql.slice(0, -1); // Remove trailing comma

        const insertStartTime = performance.now();
        await connection.execute(sql, values);
        const insertEndTime = performance.now();

        const duration = insertEndTime - insertStartTime;
        
        const avgDuration = duration / itemsToInsert;
        for (let i = 0; i < itemsToInsert; i++) {
            totalItemsInserted++;
            writeStream.write(`${totalItemsInserted},${avgDuration.toFixed(4)}\n`);
            if (totalItemsInserted % LOG_INTERVAL === 0) {
                console.log(`[uuid${uuidVersion}] Inserted ${totalItemsInserted} / ${TOTAL_ITEMS} items...`);
            }
        }
    }

    const totalEndTime = performance.now();
    const totalDurationSeconds = (totalEndTime - totalStartTime) / 1000;

    console.log('\n------------------------------------');
    console.log(`[uuid${uuidVersion}] Population script finished.`);
    console.log(`Total items inserted: ${totalItemsInserted}`);
    console.log(`Total execution time: ${totalDurationSeconds.toFixed(2)} seconds.`);
    console.log(`Metrics data saved to: ${METRICS_FILE}`);
    console.log('------------------------------------\n');

    writeStream.end();
    await connection.end();
}

main().catch(error => {
    console.error(`An error occurred during uuid${uuidVersion} population:`, error);
    process.exit(1);
});