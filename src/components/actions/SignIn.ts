"use server"

import { createClient } from "@/utils/supabase/server"



interface Props{
    password:string,
    email:string,
}
const SignIn = async ({password,  email}:Props) => {

    const  supabase = await createClient();
    const  {error} =  await  supabase.auth.signInWithPassword({
        password:password,
        email:email,

    })

    if (error) {
        console.log(error.message);
        return  error.message
    }
    return  "successful"

}

export default SignIn