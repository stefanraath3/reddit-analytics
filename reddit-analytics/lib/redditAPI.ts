import type { CategorizedPost } from "./openaiAPI";

export interface RedditPost {
  id: string;
  title: string;
  content: string;
  score: number;
  numComments: number;
  created: Date;
  url: string;
  author: string;
}

export async function fetchRecentPosts(
  subredditName: string
): Promise<RedditPost[]> {
  try {
    const response = await fetch(`/api/reddit?subreddit=${subredditName}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();
    return posts.map((post: any) => ({
      ...post,
      created: new Date(post.created),
    }));
  } catch (error) {
    console.error(`Error fetching posts from r/${subredditName}:`, error);
    throw error;
  }
}

export async function fetchAndCategorizePosts(
  subredditName: string
): Promise<CategorizedPost[]> {
  try {
    // First fetch the posts
    const posts = await fetchRecentPosts(subredditName);

    // Then categorize them
    const response = await fetch("/api/categorize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(posts),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error processing posts from r/${subredditName}:`, error);
    throw error;
  }
}
