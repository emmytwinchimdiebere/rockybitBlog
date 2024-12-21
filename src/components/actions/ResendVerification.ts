"use server"

import { createClient } from "@/utils/supabase/server"

interface Props {
    email:string
}
export const VerificationMail =async  ({email}:Props)=>{
    const supabase  =  await createClient()
    const  {error,  data} =  await supabase.auth.signInWithOtp({email:email});

    if(!error && data?.user){
        console.log(data?.user)
        return  "successful"
    }
    console.log(error?.message)
    return  error?.message
}