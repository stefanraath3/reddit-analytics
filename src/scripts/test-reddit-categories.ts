import dotenv from "dotenv";
import OpenAI from "openai";
import { categorizePost } from "../lib/categorize";
import { fetchOllamaPosts } from "../lib/reddit";

dotenv.config();

async function main() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    console.log("Fetching posts from r/ollama...");
    const posts = await fetchOllamaPosts();

    console.log(`Analyzing ${posts.length} posts...\n`);

    for (const post of posts.slice(0, 5)) {
      // Analyze first 5 posts to save API costs
      console.log("\nPost:", post.title);
      try {
        const categories = await categorizePost(
          { title: post.title, content: post.content },
          openai
        );
        console.log("Categories:", JSON.stringify(categories, null, 2));
      } catch (error) {
        console.error("Error analyzing post:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

main();
