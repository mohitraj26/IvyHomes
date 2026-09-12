import { fetchAllPaginated } from './api';

async function main() {
  console.log('Starting rentals data collection...');
  try {
    const { records, totalRequests } = await fetchAllPaginated('/v1/rentals', 'rentals');
    console.log('\n--- COLLECTION COMPLETE ---');
    console.log(`Total rental records: ${records.length}`);
    console.log(`Total API requests made: ${totalRequests}`);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    process.exit(1);
  }
}

main();
