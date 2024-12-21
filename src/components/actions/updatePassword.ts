"use server"

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"

interface Props{
    password:string
}
export const  updatePassword = async({password}:Props) => {
    console.log(password)
    const  origin =  headers().get("origin")
    
    const supabase =  await createClient()
    const  {error, data:{user}} =  await supabase.auth.updateUser({password:password}, {emailRedirectTo:`${origin}/success`})

    if(!error){
        console.log(user)
        return  "password reset sucessfull"
    }
    console.log(error?.message)
    return  error?.message
}