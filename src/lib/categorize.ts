import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const PostCategorySchema = z.object({
  solutionRequest: z
    .boolean()
    .describe("Post is seeking solutions for problems"),
  painAndAnger: z.boolean().describe("Post expresses pain or anger"),
  adviceRequest: z.boolean().describe("Post is seeking advice"),
  moneyTalk: z.boolean().describe("Post discusses spending money or finances"),
});

type RedditPost = {
  title: string;
  content: string;
};

export async function categorizePost(
  post: RedditPost,
  openai: OpenAI
): Promise<z.infer<typeof PostCategorySchema>> {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Analyze the Reddit post and categorize it according to the specified categories.",
      },
      {
        role: "user",
        content: `Title: ${post.title}\nContent: ${post.content}`,
      },
    ],
    response_format: zodResponseFormat(PostCategorySchema, "post_categories"),
  });

  return completion.choices[0].message.parsed as z.infer<
    typeof PostCategorySchema
  >;
}
