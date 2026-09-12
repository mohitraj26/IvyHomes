import { fetchAllPaginated } from './api';

async function main() {
  console.log('Starting listing data collection...');
  try {
    const { records, totalRequests } = await fetchAllPaginated('/v1/listings', 'listings');
    console.log('\n--- COLLECTION COMPLETE ---');
    console.log(`Total listing records: ${records.length}`);
    console.log(`Total API requests made: ${totalRequests}`);
  } catch (error) {
    console.error('Error fetching listings:', error);
    process.exit(1);
  }
}

main();
