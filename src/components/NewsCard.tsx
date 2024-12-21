import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Eye, ThumbsUp, Share2, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface NewsCardProps {
  title: string;
  summary: string;
  slug:string,
  category: string;
  timestamp: string;
  imageUrl: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
}

export default function NewsCard({
  title,
  summary,
  category,
  timestamp,
  imageUrl,
  views,
  likes,
  shares,
  comments,
  slug
}: NewsCardProps) {
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 relative ">
          <div className="flex-1 relative">
        <Link className=" no-underline text-black hover:cursor-pointer " href={`/posts/${slug}`}>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <div dangerouslySetInnerHTML={{__html:summary}} className="text-sm text-muted-foreground text-justify mb-3"  />
        </Link>
           <Badge className=' w-auto' variant="secondary">{category}</Badge>
             
          
            <div className="flex w-full space-x-4 text-sm text-muted-foreground  lg:absolute lg:bottom-2 justify-between">
             
             <div className='flex flex-row gap-4 relative mt-3 lg:mt-0 '>
                 <span className="flex items-center"><Eye className="w-4 h-4 mr-1" /> {views}</span>
              <span className="flex items-center"><ThumbsUp className="w-4 h-4 mr-1" /> {likes}</span>
              <span className="flex items-center"><Share2 className="w-4 h-4 mr-1" /> {shares}</span>
              <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-1" /> {comments}</span>
             </div>

              <div className='flex justify-end items-end relative right-0'>
                <span className="text-xs text-muted-foreground">{timestamp}</span>
              </div>
            </div>
          </div>
          <div className="relative w-full md:w-64 h-48">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
