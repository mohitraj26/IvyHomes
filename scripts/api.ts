import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';
config({ path: '.env.local' });

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const BASE_URL = process.env.API_BASE_URL || 'https://solve.ivy.homes';
const API_KEY = process.env.IVY_API_KEY || '';
const EMAIL = process.env.IVY_EMAIL || '';
const PASSWORD = process.env.IVY_PASSWORD || '';

let authToken = '';

export async function login() {
  if (authToken) return authToken;
  
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY && { 'x-api-key': API_KEY })
    },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  // Assuming the token is at data.token or data.access_token
  authToken = data.token || data.access_token;
  return authToken;
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = await login();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(API_KEY && { 'x-api-key': API_KEY }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  
  if (res.status === 429) {
    // Basic retry logic for rate limits
    console.warn('Rate limited. Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return fetchWithAuth(endpoint, options);
  }

  if (!res.ok) {
    throw new Error(`API Error on ${endpoint}: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

/**
 * Paginates an endpoint until all records are retrieved.
 * Saves the raw responses to the data directory.
 */
export async function fetchAllPaginated(
  endpoint: string, 
  dataFolderName: string
) {
  let allRecords: any[] = [];
  let offset = 0;
  const limit = 50; // default assumption, verify with API
  let totalRequests = 0;

  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), 'data');
  await fs.mkdir(dataDir, { recursive: true });

  while (true) {
    const url = `${endpoint}?offset=${offset}&limit=${limit}`;
    console.log(`Fetching ${url}...`);
    const data = await fetchWithAuth(url);
    totalRequests++;

    // Save raw response
    await fs.writeFile(
      path.join(dataDir, `${dataFolderName}_offset_${offset}.json`),
      JSON.stringify(data, null, 2)
    );

    const results = data.results || data.data || [];
    allRecords = [...allRecords, ...results];

    if (!data.has_more || results.length < limit || !results.length) {
      // Reached the end
      break;
    }

    offset += limit;
  }

  // Save complete aggregate
  await fs.writeFile(
    path.join(dataDir, `${dataFolderName}_complete.json`),
    JSON.stringify(allRecords, null, 2)
  );

  return { records: allRecords, totalRequests };
}
