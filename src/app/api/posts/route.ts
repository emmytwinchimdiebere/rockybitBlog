import { NextRequest, NextResponse } from "next/server";
import prisma from  "@/lib/PrimaClient"





export async function GET(request:NextRequest,  response:NextResponse){

    
   
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1'); // Default to page 1 if no page is provided
    const limit = 6; // We fetch 6 posts per request
    const offset = (page - 1) * limit;
  
  
    try {
        const  post  =  await prisma?.post.findMany({
    skip: offset,
     take: limit,
      orderBy: { createdAt: 'desc' }, // Order by createdAt
          
      include:{
                tags:{
                    
                },
                category:{

                },

                author:{
                  
                }
            }
        });
         // Check if there are more posts for pagination
   const totalPosts = await prisma.post.count()
   const hasMore = offset + post.length < totalPosts
        if(post){
            return  NextResponse.json({
                msg:"ok",
                status:200,
                posts:post,
                hasMore:hasMore
            }, {status:200})
        }
    } catch (error:any) {
        console.log(error);
        return  NextResponse.json({
            msg:"failed to fetch  post",
            status:500,
            error:error?.message
        },  {status:500})
    }
    finally{
        await  prisma?.$disconnect()
    }
}  