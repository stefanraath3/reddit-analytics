"use client";

import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { CategorizedPost } from "@/lib/openaiAPI";
import { fetchAndCategorizePosts } from "@/lib/redditAPI";
import { useEffect, useState } from "react";
import { AddSubredditForm } from "./components/AddSubredditForm";
import { CategoryCards } from "./components/CategoryCards";
import { PostsTable } from "./components/PostsTable";
import { SidePanel } from "./components/SidePanel";
import { SubredditList } from "./components/SubredditList";

export default function Home() {
  const [subreddits, setSubreddits] = useState<string[]>([
    "programming",
    "typescript",
    "reactjs",
  ]);
  const [posts, setPosts] = useState<CategorizedPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      try {
        const allPosts = await Promise.all(
          subreddits.map((subreddit) => fetchAndCategorizePosts(subreddit))
        );
        setPosts(allPosts.flat().sort((a, b) => b.score - a.score));
      } catch (error) {
        toast({
          title: "Error processing posts",
          description: "Failed to fetch or categorize posts",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, [subreddits, toast]);

  const handleDelete = (subreddit: string) => {
    setSubreddits(subreddits.filter((s) => s !== subreddit));
  };

  const handleAdd = (subreddit: string) => {
    setSubreddits([...subreddits, subreddit]);
  };

  return (
    <main className="container mx-auto p-4 space-y-4">
      <AddSubredditForm onAdd={handleAdd} existingSubreddits={subreddits} />
      <SubredditList subreddits={subreddits} onDelete={handleDelete} />
      <CategoryCards
        posts={posts}
        onCategoryClick={(category) => setSelectedCategory(category)}
      />
      <PostsTable posts={posts} isLoading={isLoading} />
      <SidePanel
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        category={selectedCategory || ""}
        posts={posts}
      />
      <Toaster />
    </main>
  );
}
