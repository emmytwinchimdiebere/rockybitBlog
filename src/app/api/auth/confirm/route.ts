import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs

  
  
  const requestUrl  =  new URL(request.url);
  const  token_hash =  requestUrl.searchParams.get('token_hash')
  const  origin =  requestUrl.origin;
  const  type  = requestUrl.searchParams.get('type') as EmailOtpType | null



  if(!token_hash || !type) {
    return NextResponse.json({
      msg: "missing_token_or_email",
      status: 400
    }, { status: 400 });
  }
  
  if (token_hash && type) {
    const supabase = await createClient();
  
  
    const  {error} = await supabase.auth.verifyOtp({
      type,
      token_hash,
 
  })


  if (!error) {
    return NextResponse.redirect(`${origin}/admin`);
  }

 
  }


  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/ErrorPage?error=missing_token_or_email`);
}
