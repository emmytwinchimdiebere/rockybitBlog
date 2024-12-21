
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrendingTopics from "@/components/trending-topics";
import ContentGenerator from "@/components/content-Generator";
import ContentLibrary from "@/components/content-library";

export default function AdminPage() {

  
 
  return (
    <div className="space-y-8 w-full lg:w-[80%] m-auto mt-9">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Manage your content, schedule posts, and monitor analytics.
        </p>
      </section>

      <Tabs  defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full lg:max-w-6xl mx-auto grid-cols-3">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-4">
          <TrendingTopics />
        </TabsContent>
        
        <TabsContent value="generate" className="space-y-4 px-10 w-full lg-w-[80%]">
          <ContentGenerator />
        </TabsContent>
        
        <TabsContent value="library" className="space-y-4">
          <ContentLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
}