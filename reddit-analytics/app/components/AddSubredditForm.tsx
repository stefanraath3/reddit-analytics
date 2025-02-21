import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AddSubredditFormProps {
  onAdd: (subreddit: string) => void;
  existingSubreddits: string[];
}

export function AddSubredditForm({
  onAdd,
  existingSubreddits,
}: AddSubredditFormProps) {
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedInput = input.toLowerCase().replace(/^r\//, "").trim();

    if (!sanitizedInput) {
      toast({
        title: "Error",
        description: "Please enter a subreddit name",
        variant: "destructive",
      });
      return;
    }

    if (existingSubreddits.includes(sanitizedInput)) {
      toast({
        title: "Error",
        description: "This subreddit is already being tracked",
        variant: "destructive",
      });
      return;
    }

    onAdd(sanitizedInput);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter subreddit name (e.g., 'programming')"
        className="flex-1"
      />
      <Button type="submit">
        <Plus className="h-4 w-4 mr-2" />
        Add
      </Button>
    </form>
  );
}
