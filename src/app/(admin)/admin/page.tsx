import AdminPage from "@/components/admin/Admin"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";


const  Admin  =  async (request:Request)=>{
console.log(request.url)
    const  supabase = await createClient();

    const  {error,  data} = await supabase.auth.getUser()

    if(error || !data?.user){
        return redirect("http://localhost:3000/login")
    }
  
    
        return(
            <AdminPage />
        )
}


export default  Admin