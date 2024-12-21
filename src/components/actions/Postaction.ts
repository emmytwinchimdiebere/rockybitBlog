"use server"
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import  axios  from  "axios"

interface  PostParams{
    image: FormData,
    slug: string,
    title: string,
    category: string,
    tags: string[];
    content: string
}

const Postaction =async  ({image,  ...PostData}:PostParams) => {
    const  origin = headers().get("origin")
    const  supabase  =  await createClient();
    const  {data:{user}} = await supabase.auth.getUser()
        console.log(user)
    if (!user) {

        throw new Error('User not authenticated');
    }
  
    try {
        const  file  =  image.get("file") as File
        const filePath =  `${file?.name}`
    
        const  {data, error} = await supabase.storage.from("post-images").upload(filePath, file, {upsert: true,metadata:{isPublic:true}});
       
        if (error) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }
        
        const  savePostData = {
            ...PostData, 
            imageUrl:`https://ffsvfvofnguubonfvyan.supabase.co/storage/v1/object/public/post-images/${filePath}`,
            authorId:user?.id
        }
         
        
           const response = await axios.post(`${origin}/api/write`, savePostData, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        if (response.status !== 200) {
            throw new Error('Failed to save post data');
        }

        // Return the response data
        return response.data;
        
        
    } catch (error:any) {
        console.error("Error in PostAction:", error);
        throw new Error(error);
    }
 
   
}

export default Postaction