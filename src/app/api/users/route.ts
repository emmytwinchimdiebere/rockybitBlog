import { NextRequest, NextResponse } from "next/server";
import prisma from  "@/lib/PrimaClient"


export   async  function GET(req:NextRequest){

    try {
        const  users =  await prisma.post.findMany();
        if(users){
            return NextResponse.json({
                user:users,
                message:"ok"
            },{status:200})
        }
    } catch (error) {
        return  NextResponse.json({
            error:error,
            msg:"failed"
        },{status:500})
    }finally{
        await  prisma?.$disconnect()
    }

}