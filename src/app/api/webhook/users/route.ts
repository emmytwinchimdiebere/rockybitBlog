import { NextRequest, NextResponse } from "next/server";



const  delay =  (ms: number) => {
    return new  Promise((resolve, reject)=>setTimeout((resolve), ms))
}

const MAX_RETRIES = 3;

async function upsertUser(body: any, retries: number = 0): Promise<any> {
  try {
    const users = await prisma?.user.upsert({
      where: {
        email: body?.record?.email,
      },
      update: {
        id: body?.record?.id,
        email: body?.record?.email,
        first_name: body?.record?.raw_user_meta_data?.name || body?.record.raw_user_meta_data?.first_name,
      },
      create: {
        id: body?.record?.id,
        email: body?.record?.email,
        first_name: body?.record?.raw_user_meta_data?.name || body?.record.raw_user_meta_data?.first_name,
      },
    });

    return users;
  } catch (e: any) {
   
    if (retries < MAX_RETRIES) {
       await delay(2000 * (retries +1))
      console.log(`Retrying... Attempt ${retries + 1}`);
      return upsertUser(body, retries + 1); // Retry the operation
    } else {
      throw new Error(`Failed after ${MAX_RETRIES} retries: ${e.message}`);
    }
  }
}



export async function POST(request:NextRequest){

try{
        const  body = await request.json()
        console.log(body) 
    

        if((body?.type === "INSERT" || body?.type === "UPDATE") && body?.table === "users"){
          
            const  user =  await  upsertUser(body)

            if(user){
                return  NextResponse.json({
                    user:user,
                    msg:"successfully created a user",
                    status:200
                },{status:200})
            }

            return  NextResponse.json({msg:"No operation  perform  due to interal  error", status:200})
        }

    }
    catch(e:any){
        return  NextResponse.json({
            error:e?.message,
            msg:"failed"
        }, {status:500})   
    }
    
}