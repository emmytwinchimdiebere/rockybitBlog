"use server"

import { createClient } from "@/utils/supabase/server"



interface  Props{
    name:string,
    password:string,
    email:string
}

async function SignUp({name,  email , password} :Props) {
    const supabase  =  await  createClient();

    const { data: existingUser, error: userCheckError } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', email)
    .single();  // Ensures you only get one user, or null if not found

   
  
  const {error,  data:user} = await supabase.auth.signUp({
      email:email,
      password:password,
      
      options:{

        data:{
          first_name:name
        },

        emailRedirectTo:`http://localhost:3000/api/auth/confirm`

      }
       
    })

if(!error && !existingUser){
  return "ok"

}

return error?.message

  
}

export default SignUp