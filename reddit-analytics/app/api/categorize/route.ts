import { categorizePost } from "@/lib/openaiAPI";
import type { RedditPost } from "@/lib/redditAPI";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const posts: RedditPost[] = await request.json();

    // Process posts in batches of 5 to avoid rate limits
    const batchSize = 5;
    const categorizedPosts = [];

    for (let i = 0; i < posts.length; i += batchSize) {
      const batch = posts.slice(i, i + batchSize);
      const categorizations = await Promise.all(
        batch.map(async (post) => {
          const categories = await categorizePost(post);
          return { ...post, categories };
        })
      );
      categorizedPosts.push(...categorizations);
    }

    return NextResponse.json(categorizedPosts);
  } catch (error) {
    console.error("Error in categorization:", error);
    return NextResponse.json(
      { error: "Failed to categorize posts" },
      { status: 500 }
    );
  }
}
