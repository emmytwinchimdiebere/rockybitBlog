import PostPage from "@/components/SinglePostPage";



const  fetchSinglePost = async (slug:string)=>{
    const  response  = await fetch(`http:localhost:3000/api/posts/${slug}/post`, {
       cache:"no-cache" 
    });

    const  data = await response.json();

    if(response?.ok) return  data;
}
export default async function SinglePostPage({params}:{params:{slug:string}}){
    const {slug} = params;
    const response = await fetchSinglePost(slug)
    console.log(slug)
        console.log(response)
    return(
        <div>
           <PostPage postData={response!} />
        </div>
    )
}