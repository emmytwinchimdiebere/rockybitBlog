"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronLeft, ChevronRight } from 'lucide-react'

const topAuthors = [
  { 
    name: "Jane Doe", 
    category: "Politics", 
    avatar: "https://picsum.photos/seed/author1/40/40", 
    latestArticle: "The Impact of Recent Policy Changes"
  },
  { 
    name: "John Smith", 
    category: "Global", 
    avatar: "https://picsum.photos/seed/author2/40/40", 
    latestArticle: "Climate Summit Outcomes and Global Implications"
  },
  { 
    name: "Emily Chen", 
    category: "Business", 
    avatar: "https://picsum.photos/seed/author3/40/40", 
    latestArticle: "Tech Giants' Q4 Earnings Report"
  },
  { 
    name: "Michael Johnson", 
    category: "Technology", 
    avatar: "https://picsum.photos/seed/author4/40/40", 
    latestArticle: "The Rise of AI in Everyday Applications"
  },
  { 
    name: "Sarah Williams", 
    category: "Entertainment", 
    avatar: "https://picsum.photos/seed/author5/40/40", 
    latestArticle: "Exclusive: Behind the Scenes of Summer Blockbuster"
  },
]

const RightSideBar = ({trendingTags}:any) => {
  
  const SidebarContent = () => (
    <ScrollArea className="h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Trending Tags</h2>
        <div className="space-y-4">
          {trendingTags.map((tag:any) => (
            <div key={tag.name} className="flex justify-between items-start">
              <div className="flex flex-col">
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium text-sm hover:no-underline text-balance text-left"
                  onClick={() => console.log(`Clicked on tag: ${tag.name}`)}
                >
                  #{tag.name}
                </Button>
                <span className="text-xs text-muted-foreground">
                  {tag.count} news
                </span>
              </div>
            
            </div>
          ))}
        </div>
        <Separator className="my-6" />
        <h2 className="text-lg font-semibold mb-4">Top Authors</h2>
        <div className="space-y-4">
          {topAuthors.map((author) => (
            <Card key={author.name}>
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar>
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-sm">{author.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{author.category}</p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm">Latest: {author.latestArticle}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  )

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 right-4 z-40 lg:hidden">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[320px] p-0 lg:hidden">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <div className="hidden lg:flex w-[320px] flex-col fixed right-0 inset-y-0 z-30 border-l border-border bg-background">
        <SidebarContent />
      </div>
    </>
  )
}



export default RightSideBar