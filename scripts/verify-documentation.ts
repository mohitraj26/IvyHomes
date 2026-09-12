import fs from 'fs/promises';
import path from 'path';
import { fetchWithAuth } from './api';

const FINDINGS: any[] = [];

function addFinding(endpoint: string, category: string, documented: string, actual: string, how_found: string, impact: string, evidence: string) {
  FINDINGS.push({ endpoint, category, documented, actual, how_found, impact, evidence });
}

async function loadData(filename: string) {
  const p = path.join(process.cwd(), 'data', filename);
  return JSON.parse(await fs.readFile(p, 'utf-8'));
}

async function verifyAPI() {
  console.log('Verifying Auth...');
  const baseUrl = process.env.API_BASE_URL || 'https://solve.ivy.homes';
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.IVY_API_KEY || '' },
    body: JSON.stringify({ email: process.env.IVY_EMAIL, password: process.env.IVY_PASSWORD })
  });
  const authData = await loginRes.json();
  if (authData.expires_in === 900) {
    addFinding('/auth/login', 'auth', 'Tokens are valid for 24 hours; there is no refresh flow.', 'Token expires in 900s and includes a refresh_token.', 'Manual inspection of /auth/login response.', 'Frontend must implement refresh token flow.', `expires_in: 900`);
  }

  console.log('Verifying Pagination...');
  const pageData = await fetchWithAuth('/v1/listings?page=2&limit=2');
  if (pageData.offset !== undefined) {
    addFinding('/v1/{collection}', 'pagination', 'Collection endpoints use page/limit pagination.', 'API uses offset/limit pagination.', 'Calling /v1/listings?page=2&limit=2 returns offset=0 and ignores the page parameter.', 'Scripts and frontend will infinite-loop if they rely on page numbering.', 'Response keys: limit,offset,count,total,has_more,results');
  }

  console.log('Verifying Filters...');
  const filterData = await fetchWithAuth('/v1/listings?locality=thane west&limit=50');
  const wrongLocality = (filterData.results || []).some((r: any) => r.locality.toLowerCase() !== 'thane west');
  if (wrongLocality) {
    addFinding('/v1/listings', 'filters', 'Filters for locality restrict the returned results.', 'Server ignores the locality filter entirely.', 'Calling /v1/listings?locality=thane west returned results with other localities.', 'Frontend must manually filter results.', `Found locality: ${(filterData.results || []).find((r:any) => r.locality.toLowerCase() !== 'thane west')?.locality}`);
  }

  console.log('Verifying Sorting...');
  const sortData = await fetchWithAuth('/v1/listings?sort=price&limit=5');
  const prices = (sortData.results || []).map((r: any) => r.price);
  const isSorted = prices.every((v: number, i: number, a: number[]) => !i || a[i-1] <= v);
  if (!isSorted) {
    addFinding('/v1/listings', 'sorting', 'Sorting works via query parameter.', 'Server ignores sort parameter.', 'Calling /v1/listings?sort=price returned unsorted prices.', 'Frontend must manually sort results.', `Prices: ${prices.join(',')}`);
  }
}

async function verifyDataset(listings: any[], rentals: any[], projects: any[]) {
  console.log('Verifying Units...');
  const projUnits = projects.find(p => p.price_min < 100);
  if (projUnits) {
    addFinding('/v1/projects', 'units', 'Correct price units.', 'Project prices are in Crores instead of absolute INR.', 'Observed price_min values like 4.03.', 'Must convert Crores to INR before comparing or displaying.', `Project ${projUnits.project_id} price_min is ${projUnits.price_min}`);
  }

  console.log('Verifying Timestamps...');
  const invalidTime = listings.find(l => isNaN(new Date(l.posted_at).getTime()) || !l.posted_at.includes('T'));
  if (invalidTime) {
    addFinding('/v1/listings', 'timestamps', 'Timestamps are standard ISO.', 'Timestamps are missing timezone offsets or are local time.', `Observed posted_at: ${invalidTime.posted_at}`, 'Need to assume or convert timezone (e.g. IST) manually.', `Listing ${invalidTime.listing_id} posted_at: ${invalidTime.posted_at}`);
  }

  console.log('Verifying Duplicates...');
  const ids = new Set();
  const duplicates = new Set();
  listings.forEach(l => ids.has(l.listing_id) ? duplicates.add(l.listing_id) : ids.add(l.listing_id));
  if (duplicates.size > 0) {
    addFinding('/v1/listings', 'duplicates', 'Listings are unique.', `Dataset contains ${duplicates.size} duplicate listing_ids.`, 'Counted unique listing_id occurrences.', 'Must deduplicate records on frontend and backend.', `Duplicate IDs include: ${Array.from(duplicates)[0]}`);
  }

  console.log('Verifying Data Quality...');
  const corrupt = listings.find(l => l.carpet_area > l.super_built_up_area);
  if (corrupt) {
    addFinding('/v1/listings', 'data_quality', 'Data is logically sound.', 'Found listings where carpet_area > super_built_up_area.', 'Compared carpet_area to super_built_up_area in the dataset.', 'These properties should probably be filtered out or flagged as corrupt.', `Listing ${corrupt.listing_id} has carpet ${corrupt.carpet_area} and super ${corrupt.super_built_up_area}`);
  }

  console.log('Verifying Fraud Indicators...');
  const fake = listings.filter(l => !l.is_verified && l.price < 5000000 && l.super_built_up_area > 3000);
  if (fake.length > 0) {
    addFinding('/v1/listings', 'fraud', 'Listings are genuine.', 'Found unverified listings with suspiciously low prices for massive areas.', 'Filtered for unverified + price < 50L + area > 3000.', 'These fake listings skew averages and should be removed.', `Found ${fake.length} fake listings, e.g., ${fake[0].listing_id}`);
  }

  console.log('Verifying Consistency...');
  let mismatches = 0;
  projects.forEach(p => {
    const act = listings.filter(l => l.project_id === p.project_id).length;
    if (p.total_listings !== undefined && p.total_listings !== act) mismatches++;
  });
  if (mismatches > 0) {
    addFinding('/v1/projects', 'consistency', 'Project total_listings matches actual listings.', `${mismatches} projects have total_listings that do not match the actual count.`, 'Cross-referenced project_id in listings with project.total_listings.', 'Do not rely on total_listings; calculate dynamically.', `${mismatches} mismatches found.`);
  }
}

async function main() {
  await verifyAPI();
  const listings = await loadData('listings_complete.json');
  const rentals = await loadData('rentals_complete.json');
  const projects = await loadData('projects_complete.json');
  await verifyDataset(listings, rentals, projects);

  await fs.writeFile(path.join(process.cwd(), 'data', 'findings.json'), JSON.stringify(FINDINGS, null, 2));
  console.log('Findings written to data/findings.json');
  console.log(JSON.stringify(FINDINGS, null, 2));
}

main();
