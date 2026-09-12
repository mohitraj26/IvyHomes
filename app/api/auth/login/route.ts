import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const baseUrl = process.env.API_BASE_URL || 'https://solve.ivy.homes';
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.IVY_API_KEY || ''
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.detail || 'Login failed' }, { status: res.status });
    }

    // data contains: access_token, refresh_token, user, expires_in (900)
    const cookieStore = await cookies();
    cookieStore.set('ivy_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: data.expires_in
    });

    if (data.refresh_token) {
      cookieStore.set('ivy_refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
    }

    if (data.user) {
      cookieStore.set('ivy_user', JSON.stringify(data.user), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
    }

    return NextResponse.json({ user: data.user });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
