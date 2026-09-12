import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProjects } from '@/lib/server-cache';

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
  const sort = searchParams.get('sort');

  let projects = await getProjects(token);

  if (locality) {
    projects = projects.filter(p => p.locality?.toLowerCase() === locality.toLowerCase());
  }

  if (sort === 'price_asc') {
    projects.sort((a, b) => a.price_min - b.price_min);
  } else if (sort === 'price_desc') {
    projects.sort((a, b) => b.price_min - a.price_min);
  } else if (sort === 'date_desc') {
    projects.sort((a, b) => new Date(b.launch_date).getTime() - new Date(a.launch_date).getTime());
  }

  const total = projects.length;
  const offset = (page - 1) * limit;
  const results = projects.slice(offset, offset + limit);

  return NextResponse.json({ total, page, limit, results });
}
