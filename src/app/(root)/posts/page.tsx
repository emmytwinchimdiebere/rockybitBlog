import MainPage from "@/components/MainPage"


const trendingPosts = [
    { id: 1, title: "Breaking: Major Political Scandal Unfolds", views: 100000 },
    { id: 2, title: "New Study Reveals Surprising Health Benefits of Coffee", views: 75000 },
    { id: 3, title: "Tech Giant Announces Revolutionary Product Launch", views: 50000 },
    { id: 4, title: "Global Climate Summit Reaches Historic Agreement", views: 40000 },
    { id: 5, title: "Sports Star's Unexpected Retirement Shocks Fans", views: 30000 },
  ]
  
  const categories = [
    "All", "Politics", "Global", "Business", "Entertainment", "Sport", "Technology", "Health", "Science"
  ]

export default function  PostPage(){
    return(
        <MainPage categories  =  {categories}  trendingPosts =  {trendingPosts}/>
    )
}

