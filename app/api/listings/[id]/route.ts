import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getListingById, getProjectById } from '@/lib/server-cache';

export async function GET(request: Request, context: any) {
  const params = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get('ivy_access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  const listing = await getListingById(id, token);

  if (!listing) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  let project = null;
  if (listing.project_id) {
    project = await getProjectById(listing.project_id);
  }

  return NextResponse.json({
    ...listing,
    project
  });
}
