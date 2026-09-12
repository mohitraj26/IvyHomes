import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('ivy_access_token')?.value;
  const userStr = cookieStore.get('ivy_user')?.value;
  const refreshToken = cookieStore.get('ivy_refresh_token')?.value;

  // We should try to refresh the token if we only have the refresh token
  if (!token && refreshToken) {
    try {
      const baseUrl = process.env.API_BASE_URL || 'https://solve.ivy.homes';
      const res = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.IVY_API_KEY || ''
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      
      if (res.ok) {
        const data = await res.json();
        cookieStore.set('ivy_access_token', data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: data.expires_in || 900
        });
        
        return NextResponse.json({ 
          authenticated: true, 
          user: userStr ? JSON.parse(userStr) : null 
        });
      }
    } catch (e) {
      console.error('Failed to refresh token', e);
    }
  }

  if (token && userStr) {
    return NextResponse.json({ 
      authenticated: true, 
      user: JSON.parse(userStr) 
    });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
