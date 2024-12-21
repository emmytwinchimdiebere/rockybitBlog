"use server"

import { createClient } from "@/utils/supabase/server"


export const  SignOut = async ()=>{

    const  supabase = await createClient();
    const  {error} =  await  supabase.auth.signOut();

    if(!error){
        return "ok"
    }
    console.log(error?.message)
    return  error?.message

}