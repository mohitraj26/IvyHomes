import fs from 'fs';
import path from 'path';

function solve() {
  const dataDir = path.join(process.cwd(), 'data');
  const listings = JSON.parse(fs.readFileSync(path.join(dataDir, 'listings_complete.json'), 'utf-8'));
  const rentals = JSON.parse(fs.readFileSync(path.join(dataDir, 'rentals_complete.json'), 'utf-8'));
  const projects = JSON.parse(fs.readFileSync(path.join(dataDir, 'projects_complete.json'), 'utf-8'));

  // 1. total_listing_records
  const total_listing_records = listings.length;

  // 2. unique_properties
  // Identifying unique properties. Assuming same apartment, locality, type, floor, area etc. might be duplicate,
  // but a simpler check is if there are exact duplicates, or we just count unique combinations of location and size.
  // Actually, wait: do they have duplicate IDs or identical properties?
  // Let's look for identical properties (same apartment_name, locality, floor, area).
  const seenProperties = new Set();
  listings.forEach((l: any) => {
    const key = `${l.apartment_name}|${l.locality}|${l.property_type}|${l.bedroom}|${l.floor}|${l.super_built_up_area}|${l.facing}`;
    seenProperties.add(key);
  });
  const unique_properties = seenProperties.size;

  // 3. active_listings
  const active_listings = listings.filter((l: any) => l.is_live === true).length;

  // 4. corrupt_listing_ids
  // Carpet area > super built up area
  const corrupt_listings = listings.filter((l: any) => l.carpet_area && l.super_built_up_area && l.carpet_area > l.super_built_up_area);
  const corrupt_listing_ids = corrupt_listings.map((l: any) => l.listing_id).sort();

  // 5. total_monthly_rent in Thane West
  const thaneRentals = rentals.filter((r: any) => r.locality.toLowerCase() === 'thane west');
  const total_monthly_rent = thaneRentals.reduce((sum: number, r: any) => sum + r.monthly_rent, 0);

  // 9. fake_listing_ids
  // Prices suspiciously low (e.g. less than 1,00,000 for a property)
  const fake_listings = listings.filter((l: any) => l.price < 100000);
  const fake_listing_ids = fake_listings.map((l: any) => l.listing_id).sort();

  // 6. avg_price_per_sqft_2bhk
  // Mean of price/carpet_area for live 2BHK listings, excluding answers to Q4 and Q9; 2 decimals.
  const valid2bhk = listings.filter((l: any) => 
    l.bedroom === 2 && 
    l.is_live === true && 
    !corrupt_listing_ids.includes(l.listing_id) && 
    !fake_listing_ids.includes(l.listing_id) &&
    l.carpet_area > 0
  );
  let sumPriceSqft = 0;
  valid2bhk.forEach((l: any) => {
    sumPriceSqft += (l.price / l.carpet_area);
  });
  const avg_price_per_sqft_2bhk = valid2bhk.length > 0 ? parseFloat((sumPriceSqft / valid2bhk.length).toFixed(2)) : 0;

  // 7. costliest_project
  let maxPrice = -1;
  let costliestProjectId = '';
  projects.forEach((p: any) => {
    // Note: The fields might be price_max or price_max_inr depending on the actual payload. Let's assume price_max based on ProjectCard
    const pMax = p.price_max || p.price_max_inr || 0; 
    if (pMax > maxPrice) {
      maxPrice = pMax;
      costliestProjectId = p.project_id;
    }
  });
  const costliest_project = {
    project_id: costliestProjectId,
    price_max_inr: Math.round(maxPrice * 10000000)
  };

  // 8. listings_last_7_days
  // [2026-09-03 00:00 IST, 2026-09-10 00:00 IST)
  // Assuming posted_at is ISO string
  const start = new Date('2026-09-02T18:30:00.000Z'); // 00:00 IST on 3rd is 18:30 UTC on 2nd
  const end = new Date('2026-09-09T18:30:00.000Z'); // 00:00 IST on 10th is 18:30 UTC on 9th
  
  const recent_listings = listings.filter((l: any) => {
    const d = new Date(l.posted_at);
    return d >= start && d < end;
  }).length;
  const listings_last_7_days = recent_listings;

  // 10. projects_with_wrong_listing_count
  let project_counts: Record<string, number> = {};
  listings.forEach((l: any) => {
    if (l.project_id) {
      project_counts[l.project_id] = (project_counts[l.project_id] || 0) + 1;
    }
  });
  
  let projects_with_wrong_listing_count = 0;
  projects.forEach((p: any) => {
    const actual = project_counts[p.project_id] || 0;
    if (p.total_listings !== actual) {
      projects_with_wrong_listing_count++;
    }
  });

  const answers = {
    total_listing_records,
    unique_properties,
    active_listings,
    corrupt_listing_ids,
    total_monthly_rent,
    avg_price_per_sqft_2bhk,
    costliest_project,
    listings_last_7_days,
    fake_listing_ids,
    projects_with_wrong_listing_count,
    dataset_audit_ref: "IVY-AUDIT-53ABF605"
  };

  const findings = JSON.parse(fs.readFileSync(path.join(dataDir, 'findings.json'), 'utf-8'));

  const submission = {
    api_key: "IVY26-A196B34278FF",
    candidate: {
      name: "Mohit Raj",
      email: "replace_with_your_mnnit_email@mnnit.ac.in",
      repo_url: "https://github.com/mohitraj26/IvyHomes",
      demo_url: "https://ivy-homes-gules.vercel.app"
    },
    answers,
    findings
  };

  fs.writeFileSync(path.join(process.cwd(), 'submission.json'), JSON.stringify(submission, null, 2));
  console.log('Successfully generated submission.json');
  console.log(JSON.stringify(answers, null, 2));
}

solve();
