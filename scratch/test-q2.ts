import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const listings = JSON.parse(fs.readFileSync(path.join(dataDir, 'listings_complete.json'), 'utf-8'));

const baseKeys = new Map();
let mismatchDeveloper = 0;
let mismatchFacing = 0;

listings.forEach((l: any) => {
  const baseKey = `${l.apartment_name}|${l.locality}|${l.property_type}|${l.bedroom}|${l.floor}|${l.super_built_up_area}`;
  if (!baseKeys.has(baseKey)) {
    baseKeys.set(baseKey, { developer: l.developer, facing: l.facing });
  } else {
    const existing = baseKeys.get(baseKey);
    if (existing.developer !== l.developer) mismatchDeveloper++;
    if (existing.facing !== l.facing) mismatchFacing++;
  }
});

console.log(`Mismatch Developer: ${mismatchDeveloper}`);
console.log(`Mismatch Facing: ${mismatchFacing}`);
