import { CategorizedPost } from "@/lib/openaiAPI";
import { X } from "lucide-react";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  posts: CategorizedPost[];
}

export function SidePanel({
  isOpen,
  onClose,
  category,
  posts,
}: SidePanelProps) {
  if (!isOpen) return null;

  const filteredPosts = posts.filter(
    (post) => post.categories[category as keyof typeof post.categories]
  );

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background border-l shadow-lg p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{category}</h2>
        <button onClick={onClose} className="p-2">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.url} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{post.content}</p>
            <div className="mt-2 text-sm">
              <span>Score: {post.score}</span>
              <span className="ml-4">Comments: {post.numComments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
