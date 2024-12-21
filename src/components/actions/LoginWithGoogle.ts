"use server"
import { createClient } from "@/utils/supabase/server"



export const  LoginWithGoogle = async ()=>{
    const  supabase = await createClient();
    const  {error, data} = await supabase.auth.signInWithOAuth({
        provider:"google"
    })

    if(error && !data){
        console.log(error?.message)
        return "unsuccessful"
    }
    return data?.url
}