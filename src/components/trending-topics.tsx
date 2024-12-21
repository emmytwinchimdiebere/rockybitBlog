'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, TrendingUp } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import CreatePostPage from './WritePgae'

type Article = {
  title: string
  url: string
  source: string
}

type TrendingStory = {
  title: string
  entityNames: string[]
  articles: Article[]
  searchInterest: number
  category: string
}

const categories = [
  "All",
  "Business",
  "Entertainment",
  "Health",
  "Science",
  "Sports",
  "Technology",
  "Top Stories"
]

const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  {code: "NG", name:"Nigeria"} ,
]

export default function TrendsPage() {
  const [geo, setGeo] = useState('US')
  const [trendData, setTrendData] = useState<TrendingStory[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"])

  const fetchTrendData = async () => {
    setLoading(true)
    setError(null)
    try {
      const categoryParam = selectedCategories.includes("All") 
        ? "" 
        : `&categories=${encodeURIComponent(selectedCategories.join(','))}`
      const response = await fetch(`/api/trends?geo=${encodeURIComponent(geo)}${categoryParam}`)
      if (!response.ok) {
        throw new Error('Failed to fetch trend data')
      }
      const data = await response.json()
      setTrendData(data.trendingStories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrendData()
  }, [geo, selectedCategories])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (category === "All") {
        return ["All"]
      } else {
        const newCategories = prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev.filter(c => c !== "All"), category]
        return newCategories.length === 0 ? ["All"] : newCategories
      }
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 items-center flex flex-row justify-between">
       <div className='flex  flex-row gap-2'>
       <TrendingUp className="h-8 w-8" />
       <h1>Google Trends  </h1>
       </div>
       <div className=''>
        <CreatePostPage />
       </div>
      </h1>
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Select value={geo} onValueChange={setGeo}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={fetchTrendData} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Trends'}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <Label htmlFor={category}>{category}</Label>
            </div>
          ))}
        </div>
      </div>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
              </Card>
            ))
          : trendData?.map((story, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start gap-2 flex-wrap">
                    <span className="text-lg">{story.title}</span>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="whitespace-nowrap">
                        Interest: {story.searchInterest}
                      </Badge>
                      <Badge variant="outline" className="whitespace-nowrap">
                        {story.category}
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {story.entityNames.join(', ')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="list-disc pl-5 space-y-2">
                    {story.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {article.title}
                        </a>
                        <span className="text-sm text-muted-foreground ml-2">({article.source})</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  )
}