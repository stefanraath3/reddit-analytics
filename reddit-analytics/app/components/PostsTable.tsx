import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RedditPost } from "@/lib/redditAPI";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, MessageSquare, ThumbsUp } from "lucide-react";

interface PostsTableProps {
  posts: RedditPost[];
  isLoading?: boolean;
}

export function PostsTable({ posts, isLoading }: PostsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-20" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No posts found in the last 24 hours
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60%]">Post</TableHead>
            <TableHead className="w-[10%] text-right">
              <ThumbsUp className="inline h-4 w-4 mr-1" />
              Score
            </TableHead>
            <TableHead className="w-[10%] text-right">
              <MessageSquare className="inline h-4 w-4 mr-1" />
              Comments
            </TableHead>
            <TableHead className="w-[20%]">Posted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} className="group">
              <TableCell>
                <div className="space-y-1">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline flex items-center gap-2"
                  >
                    {post.title}
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  {post.content && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>
                  )}
                  <div className="text-sm text-muted-foreground">
                    by u/{post.author}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {post.score}
              </TableCell>
              <TableCell className="text-right">{post.numComments}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(post.created)} ago
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
