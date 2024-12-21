"use client"
import { bottomNavItems, initialAuthors, mainNavItems } from '@/lib/data'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { Home, Newspaper, TrendingUp, MessageSquare, LayoutGrid, History, Bookmark, FolderClosed, Settings, User, HelpCircle, LogOut, Plus, Menu, ChevronLeft } from 'lucide-react'
import Logout from './Logout'


const SideBar = () => {
  const pathname = usePathname()

  const [authors, setAuthors] = useState(initialAuthors)
  const [isOpen, setIsOpen] = useState(false)


  
 
  const toggleFollow = (id: number) => {
    setAuthors(authors.map(author =>
      author.id === id ? { ...author, followed: !author.followed } : author
    ))
  }

  const NavContent = () => (
    <>
      <div className="px-3 py-2 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 no-underline text-black">
          <span className="text-xl font-bold">rockybit</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {mainNavItems.map((item:any) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "justify-start hover:text-black",
                pathname === item.href && "bg-secondary"
              )}
              asChild
            >
              <Link className=' no-underline text-black' href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
        <Separator className="my-4" />
        <div className="px-4 py-2">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">
            Following
          </h2>
          <div className="space-y-1">
            {authors.filter(author => author.followed).map((author) => (
              <Button
                key={author.id}
                variant="ghost"
                className="w-full justify-start font-normal"
                onClick={() => toggleFollow(author.id)}
              >
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {author.name}
              </Button>
            ))}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="px-4 py-2">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">
            Suggested Authors
          </h2>
          <div className="space-y-1">
            {authors.filter(author => !author.followed).map((author) => (
              <div key={author.id} className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  className="justify-start font-normal"
                  onClick={() => toggleFollow(author.id)}
                >
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {author.name}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={() => toggleFollow(author.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="grid gap-1 p-2">
        {bottomNavItems.map((item:any) => (
          <Button
            key={item.href}
            variant="ghost"
            className="justify-start"
            asChild
          >
            <Link className=' no-underline text-black' href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
        <Button variant="ghost" className="justify-start">
          <HelpCircle className="mr-2 h-4 w-4" />
          Help & Information
        </Button>
      <Logout />
      </div>
      <div className="p-4 text-sm text-muted-foreground">
        © 2024 Yoks News
      </div>
    </>
  )








  return (
    <>
    <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40 lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0 lg:hidden">
          <NavContent />
        </SheetContent>
      </Sheet>
      <div className="w-[240px] flex-col fixed inset-y-0 z-30 border-r border-border bg-background hidden lg:flex">
        <NavContent />
      </div>
    </>
  )
}

export default SideBar