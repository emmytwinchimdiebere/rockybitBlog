import { updateSession } from '@/utils/supabase/middleware';
import { createClient } from '@/utils/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';


export async function middleware(request: NextRequest) {
  await updateSession(request)
  // Create a Supabase client
  const supabase = await createClient();

  // Use getSession to retrieve session information
  const { data: session, error } = await supabase.auth.getSession();

  if (error || !session) {
    console.error('Error fetching session: ', error);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

 // If session is valid, continue to the requested route
  return  NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/admin', '/private'
  ],
};
