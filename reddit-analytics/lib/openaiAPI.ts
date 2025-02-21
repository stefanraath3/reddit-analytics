import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { RedditPost } from "./redditAPI";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PostCategorySchema = z.object({
  solutionRequest: z
    .boolean()
    .describe("Post is seeking solutions for problems"),
  painAndAnger: z.boolean().describe("Post expresses pain or anger"),
  adviceRequest: z.boolean().describe("Post is seeking advice"),
  moneyTalk: z.boolean().describe("Post discusses spending money or finances"),
});

export type PostCategories = z.infer<typeof PostCategorySchema>;

export interface CategorizedPost extends RedditPost {
  categories: PostCategories;
}

const SYSTEM_PROMPT = `You are a Reddit post analyzer. Analyze the post and categorize it according to the specified categories.`;

export async function categorizePost(
  post: RedditPost
): Promise<PostCategories> {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Title: ${post.title}\nContent: ${post.content}`,
        },
      ],
      response_format: zodResponseFormat(PostCategorySchema, "post_categories"),
    });

    if (!completion.choices[0].message.parsed) {
      throw new Error("Failed to parse response");
    }

    return completion.choices[0].message.parsed;
  } catch (error) {
    console.error("Error categorizing post:", error);
    return {
      solutionRequest: false,
      painAndAnger: false,
      adviceRequest: false,
      moneyTalk: false,
    };
  }
}
