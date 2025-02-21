# Product Requirements Document (PRD)

## Reddit Analytics Platform

### Overview

The Reddit Analytics Platform is a web application designed to analyze subreddit content and categorize posts using AI. The platform fetches posts from specified subreddits, analyzes them using OpenAI's API to categorize based on predefined themes, and presents the data in an interactive and user-friendly interface.

---

## Table of Contents

1. [Objectives](#objectives)
2. [Tech Stack](#tech-stack)
3. [Core Features](#core-features)
   - [1. Subreddit Management](#1-subreddit-management)
   - [2. Top Posts Analysis](#2-top-posts-analysis)
   - [3. Theme Analysis](#3-theme-analysis)
4. [Project Structure](#project-structure)
5. [Documentation](#documentation)
   - [Using Snoowrap to Fetch Reddit Data](#using-snoowrap-to-fetch-reddit-data)
   - [Categorizing Posts with OpenAI](#categorizing-posts-with-openai)
   - [Example Output](#example-output)
6. [Environment Variables](#environment-variables)
7. [Development Notes](#development-notes)

---

## Objectives

- **Fetch and display Reddit posts** from specified subreddits within the last 24 hours.
- **Categorize posts** using AI to provide insights into subreddit content.
- **Allow users to manage subreddits** being tracked.
- **Provide an intuitive UI** for sorting and analyzing posts.

---

## Tech Stack

- **Frontend**: Next.js 14, Shadcn UI, Tailwind CSS
- **Icons**: Lucide Icons
- **Backend**:
  - **Reddit API**: Snoowrap
  - **AI Processing**: OpenAI API
- **Styling**: Tailwind CSS
- **Language**: TypeScript

---

## Core Features

### 1. Subreddit Management

1. **View Tracked Subreddits**: Display a list of subreddits currently being monitored.
2. **Add Subreddits**: Allow users to add new subreddits to the tracking list.

### 2. Top Posts Analysis

1. **Fetch Posts**: Retrieve posts from the last 24 hours from each tracked subreddit.
2. **Display Posts**: Show posts in a sortable table with the following data:
   - Title
   - Score
   - Content
   - URL
   - Creation Time
   - Comment Count
3. **Sorting**: Users can sort posts by score and other metrics.

### 3. Theme Analysis

1. **AI-Powered Categorization**: Use OpenAI to categorize posts into themes.
2. **Default Categories**:
   - Solution Requests: Posts seeking problem solutions.
   - Pain & Anger: Posts expressing negative emotions.
   - Advice Requests: Posts asking for guidance.
   - Money Talk: Posts discussing finances.
3. **Concurrent Processing**: Analyze multiple posts simultaneously for efficiency.
4. **Visual Display**:
   - **Category Cards**: Show category title, description, and post count.
   - **Side Panel**: Display full post list when a category card is clicked.
5. **Custom Categories**: Users can add custom categories, triggering automatic reanalysis.

---

## Project Structure

```
reddit-analytics/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env
├── public/
│   ├── favicon.ico
│   └── icons/
│       ├── file.svg
│       ├── globe.svg
│       ├── next.svg
│       ├── vercel.svg
│       └── window.svg
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── components/
│       ├── ui/
│       ├── SubredditList.tsx
│       ├── AddSubredditForm.tsx
│       ├── PostsTable.tsx
│       ├── CategoryCards.tsx
│       ├── SidePanel.tsx
│       └── ...
├── hooks/
│   ├── useMobile.tsx
│   └── useToast.ts
├── lib/
│   ├── utils.ts
│   ├── redditAPI.ts
│   └── openaiAPI.ts
├── instructions/
│   └── instructions.md
├── next-env.d.ts
├── postcss.config.js
├── tailwind.config.js
└── public/
    └── assets/
```

---

## Documentation

### Using Snoowrap to Fetch Reddit Data

To interact with the Reddit API, we use the **Snoowrap** library. Below is an example of how to fetch posts from a subreddit within the last 24 hours.

#### Code Example

```typescript
import dotenv from "dotenv";
import snoowrap from "snoowrap";

// Load environment variables
dotenv.config();

const redditClient = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT || "",
  clientId: process.env.REDDIT_CLIENT_ID || "",
  clientSecret: process.env.REDDIT_CLIENT_SECRET || "",
  username: process.env.REDDIT_USERNAME || "",
  password: process.env.REDDIT_PASSWORD || "",
});

export async function fetchRecentPosts(subredditName: string) {
  try {
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - 24 * 60 * 60;

    const posts = await redditClient
      .getSubreddit(subredditName)
      .getNew({ limit: 100 });
    const postsArray = posts
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
```

#### Notes

- Ensure environment variables are correctly set in the `.env` file.
- Replace `"ollama"` with any subreddit name when calling `fetchRecentPosts`.
- The function filters posts from the last 24 hours and maps the data into a usable format.

### Categorizing Posts with OpenAI

We utilize the OpenAI API to categorize Reddit posts based on predefined themes.

#### Code Example

```typescript
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
```

#### Notes

- **PostCategorySchema** defines the categories for classification.
- The `categorizePost` function sends the post data to OpenAI and expects a response matching the schema.
- **OpenAI Model**: Use `gpt-4o-mini` or the appropriate model available.

### Example Output

```
Fetching posts from r/ollama...
Analyzing 4 posts...

Post: Is this possible?
Categories: {
  "solutionRequest": true,
  "painAndAnger": false,
  "adviceRequest": true,
  "moneyTalk": false
}
```

---

## Environment Variables

Ensure the following variables are set in your `.env` file:

- **Reddit API Credentials**:
  - `REDDIT_USER_AGENT`
  - `REDDIT_CLIENT_ID`
  - `REDDIT_CLIENT_SECRET`
  - `REDDIT_USERNAME`
  - `REDDIT_PASSWORD`
- **OpenAI API Key**:
  - `OPENAI_API_KEY`

---

## Development Notes

- **Concurrency**: Implement concurrent processing (e.g., using `Promise.all`) when fetching and analyzing posts to improve performance.
- **Error Handling**: Include comprehensive error handling for API calls and data processing.
- **UI Components**: Utilize Shadcn UI components and Tailwind CSS for styling.
- **Icons**: Use Lucide Icons stored in `public/icons/`.
- **State Management**: Use React Hooks (`useState`, `useEffect`) for managing component state.
- **TypeScript**: Follow strict typing to prevent runtime errors.
- **File Structure**: Keep components modular within the `app/components/` directory.
- **Custom Categories**: When users add custom categories, re-analyze existing posts to include the new category.

---

By adhering to this PRD, developers will have a clear understanding of the project's requirements, structure, and implementation details. The included code examples and documentation provide necessary context for integrating Reddit and OpenAI APIs.

---
