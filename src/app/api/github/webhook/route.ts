import { NextResponse } from "next/server";


export default  async function GET(request:Request){
const body   = await  request.json();

return  NextResponse.json({
    body:body
})
} 