import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { getListings, getProjects } from '@/lib/server-cache';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('ivy_access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const listings = await getListings(token);
    const projects = await getProjects(token);

    // Read Findings
    const findingsPath = path.join(process.cwd(), 'data', 'findings.json');
    const findingsData = await fs.readFile(findingsPath, 'utf-8');
    const findings = JSON.parse(findingsData);

    // Calculate Application Statistics
    const totalListings = listings.length;
    
    // Valid Listings (Filtering out corrupt area/price data)
    const validListings = listings.filter(l => 
      l.price > 0 && l.super_built_up_area > 0 && l.super_built_up_area > (l.carpet_area || 0)
    );

    // Medians calculation
    const getMedian = (arr: number[]) => {
      if (arr.length === 0) return 0;
      arr.sort((a, b) => a - b);
      const half = Math.floor(arr.length / 2);
      if (arr.length % 2) return arr[half];
      return (arr[half - 1] + arr[half]) / 2.0;
    };

    const prices = validListings.map(l => l.price);
    const medianPrice = getMedian(prices);

    const pricePerSqft = validListings.map(l => l.price / l.super_built_up_area);
    const medianPricePerSqft = getMedian(pricePerSqft);

    // By Locality
    const localityCounts = listings.reduce((acc: any, l: any) => {
      acc[l.locality] = (acc[l.locality] || 0) + 1;
      return acc;
    }, {});
    const topLocalities = Object.entries(localityCounts)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // By BHK
    const bhkCounts = listings.reduce((acc: any, l: any) => {
      acc[l.bedroom] = (acc[l.bedroom] || 0) + 1;
      return acc;
    }, {});
    const bhkStats = Object.entries(bhkCounts)
      .sort((a: any, b: any) => a[0] - b[0])
      .map(([bhk, count]) => ({ name: `${bhk} BHK`, count }));

    // Quality Issues / Corrupt Counts
    const corruptAreaCount = listings.filter(l => l.carpet_area && l.super_built_up_area && l.carpet_area >= l.super_built_up_area).length;
    const extremePriceCount = listings.filter(l => l.price < 100000).length; // Suspiciously low for property
    
    // Project Listing Count Inconsistencies
    let projectInconsistencyCount = 0;
    const projectListingCounts = listings.reduce((acc: any, l: any) => {
      if (l.project_id) acc[l.project_id] = (acc[l.project_id] || 0) + 1;
      return acc;
    }, {});

    projects.forEach(p => {
      const actual = projectListingCounts[p.project_id] || 0;
      if (p.total_listings !== actual) {
        projectInconsistencyCount++;
      }
    });

    return NextResponse.json({
      calculated_stats: {
        total_listings: totalListings,
        median_price: medianPrice,
        median_price_per_sqft: medianPricePerSqft,
        top_localities: topLocalities,
        bhk_stats: bhkStats,
      },
      data_quality: {
        corrupt_area_listings: corruptAreaCount,
        suspicious_price_listings: extremePriceCount,
        project_count_inconsistencies: projectInconsistencyCount
      },
      investigation_findings: findings
    });

  } catch (err) {
    console.error('Insights fetch failed', err);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}
