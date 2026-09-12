import { fetchAllPaginated } from './api';

async function main() {
  console.log('Starting projects data collection...');
  try {
    const { records, totalRequests } = await fetchAllPaginated('/v1/projects', 'projects');
    console.log('\n--- COLLECTION COMPLETE ---');
    console.log(`Total project records: ${records.length}`);
    console.log(`Total API requests made: ${totalRequests}`);
  } catch (error) {
    console.error('Error fetching projects:', error);
    process.exit(1);
  }
}

main();
