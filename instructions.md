# Reddit Analytics Platform

A web application to analyze subreddit content and categorize posts using AI.

## Tech Stack

- Next.js 14
- Shadcn UI
- Tailwind CSS
- Lucid Icons
- Snoowrap (Reddit API)
- OpenAI API

## Core Features

### Subreddit Management

- View list of tracked subreddits
- Add new subreddits to track

### Top Posts Analysis

- Fetch and display posts from last 24 hours in sortable table
- Post data includes:
  - Title
  - Score
  - Content
  - URL
  - Creation time
  - Comment count
- Sort posts by score

### Theme Analysis

- AI-powered post categorization using OpenAI
- Default categories:
  - Solution Requests: Posts seeking problem solutions
  - Pain & Anger: Posts expressing negative emotions
  - Advice Requests: Posts asking for guidance
  - Money Talk: Posts discussing finances
- Concurrent processing for faster analysis
- Visual display:
  - Category cards showing title, description and post count
  - Side panel with full post list on card click
  - Add custom categories with automatic reanalysis

## Docs

XXX

## Project Structure

XXXX
