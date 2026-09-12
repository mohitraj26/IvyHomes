import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

const getFavPath = () => path.join(process.cwd(), 'data', 'favourites.json');

async function getFavouritesData() {
  try {
    const data = await fs.readFile(getFavPath(), 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveFavouritesData(data: any) {
  await fs.writeFile(getFavPath(), JSON.stringify(data, null, 2));
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
