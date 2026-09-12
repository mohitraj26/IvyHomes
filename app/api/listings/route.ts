import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getListings } from '@/lib/server-cache';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('ivy_access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  
  // Filters
  const locality = searchParams.get('locality');
  const bedroom = searchParams.get('bedroom');
  const priceMin = searchParams.get('price_min');
  const priceMax = searchParams.get('price_max');
  const furnishing = searchParams.get('furnishing');
  const sort = searchParams.get('sort'); // price_asc, price_desc

  let listings = await getListings(token);

  // Apply filters
  if (locality) {
    listings = listings.filter(l => l.locality?.toLowerCase() === locality.toLowerCase());
  }
  if (bedroom) {
    listings = listings.filter(l => l.bedroom === parseInt(bedroom, 10));
  }
  if (priceMin) {
    listings = listings.filter(l => l.price >= parseInt(priceMin, 10));
  }
  if (priceMax) {
    listings = listings.filter(l => l.price <= parseInt(priceMax, 10));
  }
  if (furnishing) {
    listings = listings.filter(l => l.furnishing?.toLowerCase() === furnishing.toLowerCase());
  }

  // Apply sorting
  if (sort === 'price_asc') {
    listings.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    listings.sort((a, b) => b.price - a.price);
  }

  // Apply pagination
  const total = listings.length;
  const offset = (page - 1) * limit;
  const results = listings.slice(offset, offset + limit);

  return NextResponse.json({
    total,
    page,
    limit,
    results
  });
}
