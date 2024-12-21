"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Share2, Bookmark, Eye } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import HoverCardComponent from './HoverCard'
import Link from 'next/link'
import { CommentSection } from './CommentSection'



interface postsProps{
  id: string
  title: string
  content: string
  createdAt: string
  imageUrl: string
  slug: string
  summary:string,
  author:{
    id: string
    first_name: string
    image: string
    bio: string

  },

likes: number,
dislikes: number,
shares: number,
bookmarks: number,
commentCount: number

}

interface posts{
  id: number
  title: string
  content: string
  createdAt: string
  imageUrl: string
  slug: string
  author:{
    id: string
    first_name: string
    image: string
    bio: string
  }

  likes: number,
dislikes: number,
shares: number,
bookmarks: number,
commentCount: number


}
interface Post {
 post:posts
otherPostsByAuthor:Array<postsProps>
}

export default function PostPage({postData}:{postData:Post}) {
  const [post, setPost] = useState<Array<Post>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

console.log(post)

  useEffect(() => {
    {postData ? `${setPost([...post, postData])} ${setIsLoading(false)}` : setIsLoading(true)}
 
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-8" />
        <Skeleton className="h-[400px] w-full mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )
  }

  const  calcReadTime = (post:string)=>{

    const  wpm  =  200;
    const  totalWords  = post?.split(/\s+/).length;
    const  readTime  =  Math.ceil(totalWords / wpm);
    return  readTime;
  }
const  content  = post?.map((content)=>content?.post?.content);

  const  readingTime  =  calcReadTime(content[0])
  
  return (
    <article className="w-full lg:w-full mx-auto px-4 py-8 relative">
     {post && post?.map((post:any, index:any)=>(
      <div key={index}  className='lg:w-[80%] lg:mx-auto' >
         {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {post?.post?.title}
        </h1>
        
        {/* Author info and metadata */}
        <div className="flex lg:flex-row  flex-col lg:justify-between mb-8">
          <div className="flex items-center gap-4">
           <HoverCardComponent src={post?.post?.imageUrl} name={post?.post?.author?.first_name} followers={150} bio={"Jane Doe is a seasoned technology writer who focuses on emerging trends. "}  >
           <Avatar className="h-12 w-12">
              <AvatarImage src={post?.post?.imageUrl} alt={post?.post?.title} />
              <AvatarFallback>{post?.post?.author?.first_name}</AvatarFallback>
            </Avatar>
           </HoverCardComponent>
            <div>
              <h2 className="font-semibold">{post?.post?.author?.first_name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <time dateTime={post?.post?.createdAt}>
                  {formatDistanceToNow(new Date(post.post?.createdAt), { addSuffix: true })}
                </time>
                <span>·</span>
                <span>{readingTime} {readingTime > 1 ? "mins" : "min"} read</span>
              </div>
            </div>
          </div>
          
          <div className="flex ml-[50px] lg:ml[2px] gap-3 mt-3">
            <Button variant="outline" size="sm">
              Follow
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
        <Image
          src={post?.post?.imageUrl || 'https://picsum.photos/seed/post/1200/800'}
          alt={post?.post.title}
          quality={100}
          priority
          fill
          className='w-full object-cover lg:object-fill h-full '
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <div className='text-justify' dangerouslySetInnerHTML={{ __html: post?.post?.content }} />
      </div>

      {/* Engagement Footer */}
      <footer className="border-t pt-6">
        <div className="flex items-center ml-[-20px] lg:ml[0px] justify-between">
          <div className="flex items-center sm:pl[-20px] lg:gap-4">
            <Button variant="ghost" className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              <span>{post?.post?.likes}</span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>{post?.post?.commentCount}</span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span>10.2K views</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className='flex gap-2'>
              <Bookmark className="h-5 w-5" />
              <span>{post?.post?.bookmarks}</span>
            </Button>
            <Button variant="ghost" size="icon" className='flex gap-2'>
              <Share2 className="h-5 w-5" />
              <span>{post?.post?.shares}</span>
            </Button>
          </div>
        </div>
        
        {/* Author Bio */}
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <div className="flex flex-col items-start gap-4">
         <div className='flex flex-row  gap-3'>
         <HoverCardComponent src={post?.post?.imageUrl} name={post?.post?.author?.first_name} followers={150} bio={"Jane Doe is a seasoned technology writer who focuses on emerging trends. "}  >
           <Avatar className="h-12 w-12">
              <AvatarImage src={post?.post?.imageUrl} alt={post?.post?.title} />
              <AvatarFallback>{post?.post?.author?.first_name}</AvatarFallback>
            </Avatar>
           </HoverCardComponent>

           <h3 className="font-semibold mb-2">Written by {post?.post?.author?.first_name}</h3>
         </div>
            <div>
              <p className="text-muted-foreground  border-l-4 border-sky-700 pl-2 bg-slate-50 mb-4">{post?.post?.author?.bio || <span>Jane Doe is a seasoned technology writer who focuses on emerging trends, innovations, and digital transformation in the tech world. With a background in software development and a passion for exploring AI, blockchain, and cybersecurity, Jane offers insights into how technology shapes businesses and society. Her blog features practical tips, in-depth analysis, and thought-provoking pieces that cater to both tech enthusiasts and professionals looking to stay ahead of industry shifts.
                </span>}</p>
              <Button>Follow</Button>
            </div>
          </div>
        </div>
      </footer>

    <Separator className='mt-[20px] lg:hidden lg:mt-[2.5rem]' />

    
  
      </div>
     ))}

<Separator className='mt-[20px] hidden lg:flex lg:mt-[2.5rem]' />

            
          
          <div  className='lg:max-w-[80%] mx-auto flex flex-col'>
      
          
          <div className=''>
          <CommentSection postId={postData?.post?.id} />  
            </div>
              
              <div  className='lg-w-[80%]'>
               <h3 className=' font-bold text-[1.2rem] capitalize mt-3'>{`More From  ${post?.map((post)=>post?.post?.author?.first_name)}`}</h3>

               <article className='w-full relative mx-auto mt-5'>
                {post &&  post?.map((article, index)=>{
                
                  return(
                    <span className='w-full' key={index}>
                       
                        <div className='relative w-full flex-col lg:flex-row gap-3 flex'>
                          {article?.otherPostsByAuthor?.slice(0,3).map((post)=>(
                           <div key={post?.id} className=' relative flex w-full flex-col h-[aut0]'>
                             
                             
                             <div className='relative '>
                             <Image className='w-full rounded-lg object-cover' src={post?.imageUrl} width={300} height = {300} alt={post?.title} priority quality={100} />
                             </div>
                             
                             <div className='mt-5 pb-3 flex flex-row  gap-3'>
                             <HoverCardComponent src={post?.imageUrl} name={post?.author?.first_name} followers={150} bio={"Jane Doe is a seasoned technology writer who focuses on emerging trends. "}  >
                             <Avatar className="h-8 w-8">
                             <AvatarImage src={post?.imageUrl} alt={post?.title} />
                             <AvatarFallback>{post?.author?.first_name}</AvatarFallback>
                              </Avatar>
                              </HoverCardComponent>

                              <span className='py-[auto] text-[14px] font-light'>{post?.author?.first_name}</span>
                             </div>
                             <Link className='no-underline hover:text-gray-500 text-black transition' href={`/posts/${post?.slug}`}>  
                            <div className='w-full lg:w-[20rem] '>
                            <span className='text-ellipsis text-balance font-bold py-2'>{post?.title.substring(0,100) + ".."}</span>
                            </div>
                            
                            <div className='text-justify mt-2 font-light text-[14px]'>
                              {post?.summary.substring(0, 100) + "..."}
                            </div>
                             </Link>

                          <div  className='flex flex-row gap-2 justify-start py-3 relative lg:bottom-[-60px] lg:absolute lg:text-black/50 text-gray-500 font-light '>
                            <Button onClick={()=>alert("clicked  message")} variant="secondary" className="flexactive:scale-100 transition gap-2">
                             <Heart className="h-5 w-5" />
                              <span>{post?.likes}</span>
                              </Button>

                              <Button onClick={()=>alert("clicked  message")}  variant="ghost" className="flex  gap-2">
                                <MessageCircle className="h-5 w-5" />
                                 <span>{post?.commentCount}</span>
                              
                                </Button>
                                
                                 <Button variant="ghost" size="icon" className='flex gap-2'>
                                 <Bookmark className="h-5 w-5" />
                                 <span>{post?.bookmarks}</span>
                                 </Button>

                                 <Button variant="ghost" size="icon" className='flex gap-2'>
                                   <Share2 className="h-5 w-5" />
                                   <span>{post?.shares}</span>
                                  </Button>
                            </div>
                           </div>
                          ))}
                        </div>

                        
                    </span>
                  )
                })}
               </article>

              </div>
          </div>
             
    </article>
  )
}