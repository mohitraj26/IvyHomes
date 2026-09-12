import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('ivy_access_token');
  cookieStore.delete('ivy_refresh_token');
  cookieStore.delete('ivy_user');
  
  return NextResponse.json({ success: true });
}
