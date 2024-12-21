"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import useStore from "./store/Store";


interface Content {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt: string;
  status: "published" | "draft";
}

export default function ContentLibrary() {
  const  {bears, incrementPopulation,updateBears, removeBears} =  useStore()

  console.log(bears)
  const { toast } = useToast();
  const [contents, setContents] = useState<Content[]>([
    {
      id: "1",
      title: "10 Tips for Better SEO in 2024",
      type: "article",
      content: "Search Engine Optimization (SEO) continues to evolve in 2024...",
      createdAt: "2024-02-20",
      status: "published",
    },
    {
      id: "2",
      title: "Understanding AI in Content Creation",
      type: "blog",
      content: "Artificial Intelligence is revolutionizing how we create...",
      createdAt: "2024-02-19",
      status: "draft",
    },
  ]);

  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [viewingContent, setViewingContent] = useState<Content | null>(null);

  const handleEdit = (content: Content) => {
    setEditingContent({ ...content });
  };

  const handleView = (content: Content) => {
    setViewingContent(content);
  };

  const handleDelete = async (id: string) => {
    try {
      // In a real app, make an API call to delete the content
      setContents(contents.filter((content) => content.id !== id));
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    }
  };

  const saveChanges = () => {
    if (editingContent) {
      setContents(contents.map(c => 
        c.id === editingContent.id ? editingContent : c
      ));
      setEditingContent(null);
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {contents.map((content) => (
            <div
              key={content.id}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
            
              <div>
                <h3 className="font-medium">{content.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{content.type}</span>
                  <span>•</span>
                  <span>{content.createdAt}</span>
                  <span>•</span>
                  <span className="capitalize">{content.status}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Dialog open={viewingContent?.id === content.id} onOpenChange={(open) => !open && setViewingContent(null)}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault();
                        handleView(content);
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{content.title}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{content.type}</span>
                          <span>•</span>
                          <span>{content.createdAt}</span>
                          <span>•</span>
                          <span className="capitalize">{content.status}</span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          {content.content}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={editingContent?.id === content.id} onOpenChange={(open) => !open && setEditingContent(null)}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault();
                        handleEdit(content);
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Content</DialogTitle>
                      </DialogHeader>
                      {editingContent && (
                        <div className="mt-4 space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                              value={editingContent.title}
                              onChange={(e) => setEditingContent({
                                ...editingContent,
                                title: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Content</label>
                            <Textarea
                              value={editingContent.content}
                              onChange={(e) => setEditingContent({
                                ...editingContent,
                                content: e.target.value
                              })}
                              rows={10}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setEditingContent(null)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={saveChanges}>
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleDelete(content.id);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}