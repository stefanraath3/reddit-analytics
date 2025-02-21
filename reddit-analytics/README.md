# Reddit Analytics Platform

A web application that analyzes subreddit content and categorizes posts using AI to provide thematic insights.

## Overview

This platform helps track and analyze content across multiple subreddits by:

- Fetching recent posts from specified subreddits
- Using AI to categorize posts into predefined themes
- Presenting data through an interactive dashboard

## Core Features

- **Multi-Subreddit Monitoring**

  - Track multiple subreddits simultaneously
  - Real-time fetching of posts from last 24 hours

- **AI Post Categorization**

  - Solution Requests
  - Pain & Anger Expression
  - Advice Requests
  - Money/Finance Discussions

- **Interactive Dashboard**
  - Filter posts by category
  - Sort by engagement metrics
  - Real-time updates

## Setup

1. Configure environment variables:

```env
REDDIT_USER_AGENT=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_USERNAME=
REDDIT_PASSWORD=
OPENAI_API_KEY=
```

2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Frontend**: Next.js 14
- **UI**: Shadcn UI + Tailwind CSS
- **APIs**:
  - Reddit (Snoowrap)
  - OpenAI
- **Language**: TypeScript

## Development

The project follows Next.js 14 app directory structure:

```
reddit-analytics/
├── app/
│   ├── api/         # API endpoints
│   ├── components/  # UI components
│   └── page.tsx     # Main page
├── lib/            # API integrations
└── hooks/          # React hooks
```

## License

MIT
