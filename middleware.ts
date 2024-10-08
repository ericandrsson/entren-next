import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If there's no session and the user is trying to access a protected route,
  // redirect them to the login page
  if (!session && req.nextUrl.pathname.startsWith('/private')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}