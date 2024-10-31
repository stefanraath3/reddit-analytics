import snoowrap from "snoowrap";

// Define types for Reddit post data
interface RedditPost {
  title: string;
  content: string;
  score: number;
  numComments: number;
  created: Date;
  url: string;
}

// Initialize the Reddit client
const reddit = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT || "",
  clientId: process.env.REDDIT_CLIENT_ID || "",
  clientSecret: process.env.REDDIT_CLIENT_SECRET || "",
  refreshToken: process.env.REDDIT_REFRESH_TOKEN || "",
});

export async function fetchOllamaPosts(): Promise<RedditPost[]> {
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - 24 * 60 * 60;

  try {
    const posts = await reddit.getSubreddit("ollama").getNew({ limit: 100 }); // Get more posts than needed to filter by time

    const recentPosts = await Promise.all(
      posts
        .filter((post) => post.created_utc > oneDayAgo)
        .map(async (post) => ({
          title: post.title,
          content: post.selftext || "",
          score: post.score,
          numComments: post.num_comments,
          created: new Date(post.created_utc * 1000),
          url: post.url,
        }))
    );

    return recentPosts;
  } catch (error) {
    console.error("Error fetching Reddit posts:", error);
    throw error;
  }
}
