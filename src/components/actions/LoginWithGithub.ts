"use server"

import { createClient } from "@/utils/supabase/server"

const LoginWithGithub = async() => {
  const  supabase  =  await  createClient();
  const  {error, data} =  await  supabase.auth.signInWithOAuth({
    provider:"github"
  })


  if(!error){
    console.log(data)
    return data?.url
  }
  console.log(error?.message)
  return  "unsuccessful"
}

export default LoginWithGithub