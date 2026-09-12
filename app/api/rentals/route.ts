import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getRentals } from '@/lib/server-cache';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('ivy_access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  
  const locality = searchParams.get('locality');
  const bedroom = searchParams.get('bedroom');
  const furnishing = searchParams.get('furnishing');
  const sort = searchParams.get('sort');

  let rentals = await getRentals(token);

  if (locality) {
    rentals = rentals.filter(r => r.locality?.toLowerCase() === locality.toLowerCase());
  }
  if (bedroom) {
    rentals = rentals.filter(r => r.bedroom === parseInt(bedroom, 10));
  }
  if (furnishing) {
    rentals = rentals.filter(r => r.furnishing?.toLowerCase() === furnishing.toLowerCase());
  }

  if (sort === 'rent_asc') {
    rentals.sort((a, b) => a.monthly_rent - b.monthly_rent);
  } else if (sort === 'rent_desc') {
    rentals.sort((a, b) => b.monthly_rent - a.monthly_rent);
  }

  const total = rentals.length;
  const offset = (page - 1) * limit;
  const results = rentals.slice(offset, offset + limit);

  return NextResponse.json({ total, page, limit, results });
}
