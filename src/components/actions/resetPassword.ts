"use server"

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers";

interface  props{
    email:string,
   
}

const ResetPassword = async  ({email}:props) => {
 const origin =  headers().get("origin")
    const  supabase  =  await createClient();
    const  {error, data} =  await  supabase.auth.resetPasswordForEmail(
        email,
        {
            redirectTo:`${origin}/resetpassword`
        }

    )

    if(!error && data){
        return  "success"
    }
    return error?.message 
}

export default ResetPassword