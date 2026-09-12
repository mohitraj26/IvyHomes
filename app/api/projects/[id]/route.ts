import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProjectById, getListings } from '@/lib/server-cache';

export async function GET(request: Request, context: any) {
  const { params } = context;
  const cookieStore = await cookies();
  const token = cookieStore.get('ivy_access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  const project = await getProjectById(id, token);

  if (!project) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  // Calculate accurate listing count as we found a discrepancy previously
  const listings = await getListings(token);
  const activeListingsCount = listings.filter(l => l.project_id === id).length;

  return NextResponse.json({
    ...project,
    calculated_listings_count: activeListingsCount
  });
}
