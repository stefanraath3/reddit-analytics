import dotenv from "dotenv";
import snoowrap from "snoowrap";

// Load environment variables
dotenv.config();

const r = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT || "",
  clientId: process.env.REDDIT_CLIENT_ID || "",
  clientSecret: process.env.REDDIT_CLIENT_SECRET || "",
  username: process.env.REDDIT_USERNAME || "",
  password: process.env.REDDIT_PASSWORD || "",
});

export async function fetchOllamaPosts() {
  try {
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - 24 * 60 * 60;

    const posts = await r.getSubreddit("ollama").getNew({ limit: 100 });
    const postsArray = await posts
      .filter((post) => post.created_utc > oneDayAgo)
      .map((post) => ({
        title: post.title,
        content: post.selftext || "",
        score: post.score,
        numComments: post.num_comments,
        created: new Date(post.created_utc * 1000),
        url: post.url,
      }));

    return postsArray;
  } catch (error) {
    console.error("Error details:", error);
    throw error;
  }
}
