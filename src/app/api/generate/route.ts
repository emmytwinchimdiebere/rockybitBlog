import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createApi } from "unsplash-js";


const openai = new OpenAI({
  apiKey :process.env.OPENAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
});

export async function POST(req: Request) {
  try {
    const { keyword, type, tone, length } = await req.json();
     
    // Generate content with OpenAI
    const completion = await openai.chat.completions.create({
      model: "grok-beta",
      messages: [
        {
          role: "system",
          content: `You are  GROK an expert content writer. Create ${type} content in a ${tone} tone.
            The content should be SEO-optimized and approximately ${length} in length.
            and you have  to  get  a real time trends based  on  ${keyword} ,  you  can  do this  by searching  & analyzing  the  web  to  get a latest  trends  by  ${keyword}
            Include a title, meta description, and structured content with headings also include  backlinks to  the  refrence  pages online make sure  the links  are  real & avoid  hallucinations of links that do not  exists, generate necessary  tags atleast  five tags from  the  post and  also a category  the  post  
            might  belong and  finally the  article slug.
           return  the  content  in  object structure {title:"", tags:[""], content:"",  category:"", slug } and  format  to remove any backticks  `,
        },
        {
          role: "user",
          content: `Create content about: ${keyword}`,
        },
      ],
    });

    const content = completion.choices[0].message.content;


    // Get relevant image from Unsplash
    const images = await unsplash.search.getPhotos({
      query: keyword,
      perPage: 1,
    });

    const imageUrl = images.response?.results[0]?.urls.regular;
  
      console.log(content)
    return  NextResponse.json({
        content:content,
        images:imageUrl
    }, {status:200})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to generate content" ,
        msg:error
      },
      { status: 500, }
    );
  }
}