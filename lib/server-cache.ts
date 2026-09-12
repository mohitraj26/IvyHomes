import fs from 'fs/promises';
import path from 'path';

let listingsCache: any[] | null = null;
let isFetching = false;

// We fetch all pages from the real API to populate the cache because the live API ignores query filters.
async function fetchAllListingsFromAPI(token: string) {
  if (isFetching) return;
  isFetching = true;
  try {
    const all = [];
    let offset = 0;
    while (true) {
      const baseUrl = process.env.API_BASE_URL || 'https://solve.ivy.homes';
      const res = await fetch(`${baseUrl}/v1/listings?offset=${offset}&limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': process.env.IVY_API_KEY || ''
        }
      });
      if (!res.ok) break;
      const data = await res.json();
      const results = data.results || [];
      all.push(...results);
      if (!data.has_more || results.length < 50 || !results.length) break;
      offset += 50;
    }
    listingsCache = all;
  } catch (err) {
    console.error('Failed to fetch cache', err);
  } finally {
    isFetching = false;
  }
}

import allListings from '@/data/listings_complete.json';

export async function getListings(token: string) {
  if (!listingsCache) {
    try {
      listingsCache = allListings;
    } catch {
      await fetchAllListingsFromAPI(token);
    }
  }
  return listingsCache || [];
}

export async function getListingById(id: string, token: string) {
  const listings = await getListings(token);
  return listings.find(l => l.listing_id === id) || null;
}

export async function getProjectById(projectId: string, token?: string) {
  const projects = await getProjects(token || '');
  return projects.find((proj: any) => proj.project_id === projectId) || null;
}

let rentalsCache: any[] | null = null;
let projectsCache: any[] | null = null;

import allRentals from '@/data/rentals_complete.json';

export async function getRentals(token: string) {
  if (!rentalsCache) {
    try {
      rentalsCache = allRentals;
    } catch {
      rentalsCache = []; // Fallback, normally would fetch from API
    }
  }
  return rentalsCache || [];
}

import allProjects from '@/data/projects_complete.json';

export async function getProjects(token: string) {
  if (!projectsCache) {
    try {
      projectsCache = allProjects;
    } catch {
      projectsCache = []; // Fallback, normally would fetch from API
    }
  }
  return projectsCache || [];
}
