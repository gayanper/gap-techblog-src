import * as df from 'danfojs-node';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import path from 'path';

const REPORT_FILE = 'report.html';
const AGGREGATION_FACTOR = 100000; // Average every 100,000 records

async function analyzeInsertPerformance(version: 'v4' | 'v7'): Promise<{ labels: number[], data: number[] } | null> {
    const METRICS_FILE = `metrics-uuid${version}.csv`;
    if (!existsSync(METRICS_FILE)) {
        console.warn(`Warning: Insert metrics file ${METRICS_FILE} not found. Skipping.`);
        return null;
    }

    console.log(`Analyzing insert metrics from ${METRICS_FILE}...`);
    const frame = await df.readCSV(METRICS_FILE) as df.DataFrame;

    const group = frame['itemCount'].map((count: number) => Math.floor(count / AGGREGATION_FACTOR));
    frame.addColumn('group', group, { inplace: true });

    const grouped = frame.groupby(['group']);
    const aggregated = grouped.agg({
        insertTimeMs: ['mean']
    });

    aggregated.rename({
        'insertTimeMs_mean': 'avgInsertTimeMs'
    }, { inplace: true });

    const labels = aggregated.index.map((g: string | number) => (Number(g) + 1) * AGGREGATION_FACTOR);
    const data = aggregated['avgInsertTimeMs'].values as number[];

    return { labels, data };
}

function analyzeQueryPerformance(version: 'v4' | 'v7'): { avg: number, p50: number, p95: number, p99: number } | null {
    const METRICS_FILE = `metrics-query-uuid${version}.csv`;
    if (!existsSync(METRICS_FILE)) {
        console.warn(`Warning: Query metrics file ${METRICS_FILE} not found. Skipping.`);
        return null;
    }
    console.log(`Analyzing query metrics from ${METRICS_FILE}...`);
    const fileContent = readFileSync(METRICS_FILE, 'utf-8');
    const queryTimes = fileContent.split('\n').slice(1).map(line => parseFloat(line)).filter(v => !isNaN(v));
    
    if (queryTimes.length === 0) return { avg: 0, p50: 0, p95: 0, p99: 0 };

    queryTimes.sort((a, b) => a - b);

    const calculatePercentile = (data: number[], percentile: number): number => {
        const index = (percentile / 100) * (data.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        if (lower === upper) return data[lower];
        return data[lower] * (upper - index) + data[upper] * (index - lower);
    };

    const calculateAverage = (data: number[]): number => {
        return data.reduce((a, b) => a + b, 0) / data.length;
    }

    return {
        avg: calculateAverage(queryTimes),
        p50: calculatePercentile(queryTimes, 50),
        p95: calculatePercentile(queryTimes, 95),
        p99: calculatePercentile(queryTimes, 99),
    };
}


async function main() {
    console.log('Analyzing metrics for uuidv4 and uuidv7...');

    // Insert Performance Analysis
    const v4InsertResults = await analyzeInsertPerformance('v4');
    const v7InsertResults = await analyzeInsertPerformance('v7');

    const insertDatasets = [];
    let insertLabels: number[] = [];

    if (v4InsertResults) {
        insertLabels = v4InsertResults.labels; // Assume labels are the same
        insertDatasets.push({
            label: 'Average Insert Time (ms) - UUIDv4',
            data: v4InsertResults.data,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.4,
            fill: false,
            pointRadius: 2,
            pointHoverRadius: 5
        });
    }

    if (v7InsertResults) {
        if (insertLabels.length === 0) insertLabels = v7InsertResults.labels;
        insertDatasets.push({
            label: 'Average Insert Time (ms) - UUIDv7',
            data: v7InsertResults.data,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.4,
            fill: false,
            pointRadius: 2,
            pointHoverRadius: 5
        });
    }
    
    // Query Performance Analysis
    const v4QueryStats = analyzeQueryPerformance('v4');
    const v7QueryStats = analyzeQueryPerformance('v7');
    
    const queryDatasets = [];
    if(v4QueryStats) {
        queryDatasets.push({
            label: 'UUIDv4 Query Time (ms)',
            data: [v4QueryStats.avg, v4QueryStats.p50, v4QueryStats.p95, v4QueryStats.p99],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        });
    }
    if(v7QueryStats) {
        queryDatasets.push({
            label: 'UUIDv7 Query Time (ms)',
            data: [v7QueryStats.avg, v7QueryStats.p50, v7QueryStats.p95, v7QueryStats.p99],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        });
    }


    if (insertDatasets.length === 0 && queryDatasets.length === 0) {
        console.error("No metrics files found to analyze. Please run the populate and/or query scripts first.");
        return;
    }

    console.log('Data aggregation complete. Generating HTML report...');

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>UUID v4 vs v7 Performance Analysis</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body { font-family: sans-serif; margin: 0; padding: 20px; background-color: #f4f4f9; }
            .container { max-width: 1200px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;}
            h1, h2 { text-align: center; color: #333; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>UUID v4 vs v7 Insert Time vs. Table Size</h1>
            <canvas id="insertChart"></canvas>
        </div>
        <div class="container">
            <h2>UUID v4 vs v7 Query Performance</h2>
            <canvas id="queryChart"></canvas>
        </div>
        <script>
            // Insert Chart
            const insertCtx = document.getElementById('insertChart').getContext('2d');
            if (insertCtx) {
                new Chart(insertCtx, {
                    type: 'line',
                    data: {
                        labels: ${JSON.stringify(insertLabels)},
                        datasets: ${JSON.stringify(insertDatasets)}
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Number of Items in Table'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Average Insert Time (ms)'
                                },
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            // Query Chart
            const queryCtx = document.getElementById('queryChart').getContext('2d');
            if (queryCtx) {
                new Chart(queryCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Average', 'p50 (Median)', 'p95', 'p99'],
                        datasets: ${JSON.stringify(queryDatasets)}
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: 'Query Time (ms)'
                                },
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        </script>
    </body>
    </html>
    `;

    writeFileSync(REPORT_FILE, htmlContent);
    console.log(`\nAnalysis complete. Interactive report saved to: ${REPORT_FILE}`);
    console.log(`You can now open this file in your web browser.`);
}

main().catch(error => {
    console.error('An error occurred during analysis:', error);
    process.exit(1);
});
