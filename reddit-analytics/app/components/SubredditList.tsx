import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface SubredditListProps {
  subreddits: string[];
  onDelete?: (subreddit: string) => void;
}

export function SubredditList({ subreddits, onDelete }: SubredditListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracked Subreddits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {subreddits.map((subreddit) => (
            <Badge
              key={subreddit}
              className="flex items-center gap-2 px-3 py-1.5"
              variant="secondary"
            >
              r/{subreddit}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onDelete(subreddit)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))}
          {subreddits.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No subreddits tracked yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
