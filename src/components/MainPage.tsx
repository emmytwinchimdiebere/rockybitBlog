"use client"

import { useState, useEffect, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Search } from 'lucide-react'
import NewsCard from '@/components/NewsCard'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { Skeleton } from "@/components/ui/skeleton"
import TrendingPost from './TrendingPosts'


export default function MainPage({categories, trendingPosts}:any) {
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [activeCategory, setActiveCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { ref, inView } = useInView()

  const fetchMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:3000/api/posts?page=${page}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          "Accept":"application/json",
       
  },
     
      
      })
      if (!response.ok) {
        console.log(`HTTP error! status: ${response}`)
      }
      const data = await response.json() // Get the response as text first
      console.log('Raw response:', data) // Log the raw response

      {response?.ok && setIsLoading(false)}

      if (!data || typeof data !== 'object') {
        throw new Error('Unexpected response format from server')
      }

  

      if (data && !Array.isArray(data.posts)) {
        throw new Error('Posts data is not an array')
      }

      setPosts(prevPosts => [...prevPosts, ...data.posts])
      setFilteredPosts(prevFiltered => {
        const newFiltered = activeCategory === "All" 
          ? [...prevFiltered, ...data.posts]
          : [...prevFiltered, ...data.posts.filter((post: any) => post.category.name === activeCategory)]
        return newFiltered
      })
      setHasMore(data.hasMore)
      setPage(prevPage => prevPage + 1)
    } catch (err) {
      console.error('Fetch error:', err)
      setError('An error occurred while fetching posts. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [page, isLoading, hasMore, activeCategory])

  useEffect(() => {
    if (inView && hasMore) {
      fetchMorePosts()
    }
  }, [inView, fetchMorePosts, hasMore])

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    setIsLoading(true)
    setError(null)

    // Reset pagination
    setPage(1)
    setPosts([])
    setHasMore(true)

    // Filter existing posts or fetch new ones if needed
    setTimeout(() => {
      if (category === "All") {
        setFilteredPosts(posts)
      } else {
        setFilteredPosts(posts.filter(post => post.category.name === category))
      }
      setIsLoading(false)
      if (posts.length === 0) {
        fetchMorePosts()
      }
    }, 500)
  }

  return (
    <div className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto">
      <div 
        className="h-[200px] relative bg-cover bg-center rounded-lg mb-6 overflow-hidden"
      >
        <Image
          src="https://picsum.photos/seed/header/1200/400"
          alt="Header image"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 rounded-lg" />
        <div className="relative p-6 flex items-center justify-center h-full">
          <div className="w-full max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search news..."
                className="pl-10 bg-white/95 dark:bg-gray-800/95"
              />
            </div>
          </div>
        </div>
      </div>
      <ScrollArea className="w-full whitespace-nowrap mb-6">
        <div className="flex w-max space-x-4 p-4">
          {categories.map((category:any) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "secondary"}
              className="rounded-full"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Trending Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingPosts.map((post:any) => (
            <TrendingPost key={post.id} title={post.title} views={post.views} />
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <NewsCard 
            key={post.id} 
            title={post.title}
            summary={post?.summary.substring(0, 350) + '...'}
            category={post.category.name}
            timestamp={new Date(post.createdAt).toLocaleString()}
            imageUrl={post.imageUrl || 'https://picsum.photos/seed/default/800/600'}
            slug = {post?.slug}
            views={post.views || 0}
            likes={post.likes || 0}
            shares={post.shares || 0}
            comments={post.comments || 0}
          />
        ))}
        {isLoading && (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-[200px]" />
          ))
        )}
      
        {!isLoading && filteredPosts.length === 0 && !error && (
          <div className="text-center py-10">
            <h3 className="text-2xl font-semibold mb-2">Posts coming soon</h3>
            <p className="text-muted-foreground">We're working on bringing you the latest {activeCategory} news. Check back later!</p>
          </div>
        )}
        {hasMore && <div ref={ref} className="h-10" />}
      </div>
    </div>
  )
}

