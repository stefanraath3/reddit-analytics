import { NextResponse } from "next/server";
import snoowrap from "snoowrap";

const redditClient = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT!,
  clientId: process.env.REDDIT_CLIENT_ID!,
  clientSecret: process.env.REDDIT_CLIENT_SECRET!,
  username: process.env.REDDIT_USERNAME!,
  password: process.env.REDDIT_PASSWORD!,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subreddit = searchParams.get("subreddit");

  if (!subreddit) {
    return NextResponse.json(
      { error: "Subreddit is required" },
      { status: 400 }
    );
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - 24 * 60 * 60;

    const posts = await redditClient
      .getSubreddit(subreddit)
      .getNew({ limit: 100 });

    const filteredPosts = posts
      .filter((post) => post.created_utc > oneDayAgo)
      .map((post) => ({
        id: post.id,
        title: post.title,
        content: post.selftext || "",
        score: post.score,
        numComments: post.num_comments,
        created: new Date(post.created_utc * 1000),
        url: post.url,
        author: post.author.name,
      }));

    return NextResponse.json(filteredPosts);
  } catch (error) {
    console.error(`Error fetching posts from r/${subreddit}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
