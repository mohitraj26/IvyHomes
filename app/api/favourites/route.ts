import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
const FAV_COOKIE = 'ivy_favourites';

async function getFavouritesData() {
  const cookieStore = await cookies();
  const favStr = cookieStore.get(FAV_COOKIE)?.value;
  try {
    return favStr ? JSON.parse(favStr) : {};
  } catch {
    return {};
  }
}

async function saveFavouritesData(data: any) {
  const cookieStore = await cookies();
  cookieStore.set(FAV_COOKIE, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const userStr = cookieStore.get('ivy_user')?.value;
  if (!userStr) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = JSON.parse(userStr);
  const data = await getFavouritesData();
  const userFavs = data[user.email] || [];
  
  return NextResponse.json(userFavs);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userStr = cookieStore.get('ivy_user')?.value;
  if (!userStr) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const user = JSON.parse(userStr);
  const data = await getFavouritesData();
  if (!data[user.email]) data[user.email] = [];
  
  if (!data[user.email].includes(id)) {
    data[user.email].push(id);
    await saveFavouritesData(data);
  }
  
  return NextResponse.json({ success: true, favourites: data[user.email] });
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const userStr = cookieStore.get('ivy_user')?.value;
  if (!userStr) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const user = JSON.parse(userStr);
  const data = await getFavouritesData();
  if (data[user.email]) {
    data[user.email] = data[user.email].filter((favId: string) => favId !== id);
    await saveFavouritesData(data);
  }
  
  return NextResponse.json({ success: true, favourites: data[user.email] });
}
