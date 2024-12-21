import { Home, Newspaper, TrendingUp, MessageSquare, LayoutGrid, History, Bookmark, FolderClosed, Settings, User, HelpCircle, LogOut, Plus, Menu, ChevronLeft } from 'lucide-react'
  
 export const initialAuthors = [
    { id: 1, name: "Jane Doe", avatar: "https://picsum.photos/seed/author1/32/32", followed: true },
    { id: 2, name: "John Smith", avatar: "https://picsum.photos/seed/author2/32/32", followed: true },
    { id: 3, name: "Emily Chen", avatar: "https://picsum.photos/seed/author3/32/32", followed: false },
    { id: 4, name: "Michael Johnson", avatar: "https://picsum.photos/seed/author4/32/32", followed: false },
    { id: 5, name: "Sarah Williams", avatar: "https://picsum.photos/seed/author5/32/32", followed: true },
  ]


  export const mainNavItems = [
    { title: "Home", icon: Home, href: "/" },
    { title: "Breaking News", icon: Newspaper, href: "/breaking" },
    { title: "Trending News", icon: TrendingUp, href: "/trending" },
    { title: "Forum", icon: MessageSquare, href: "/forum" },
    { title: "Categories", icon: LayoutGrid, href: "/categories" },
    { title: "History", icon: History, href: "/history" },
    { title: "Saved", icon: Bookmark, href: "/saved" },
    { title: "Collections", icon: FolderClosed, href: "/collections" },
  ]

  export const bottomNavItems = [
    { title: "Settings", icon: Settings, href: "/settings" },
    { title: "Your Account", icon: User, href: "/account" },
  ] 