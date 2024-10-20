'use server'

import { cookies } from 'next/headers'

export async function setAuthVerifiedCookie() {
  cookies().set('auth_verified', 'true', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 1 day
  });
}
