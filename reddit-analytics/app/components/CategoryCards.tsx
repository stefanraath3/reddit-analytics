import { CategorizedPost } from "@/lib/openaiAPI";

interface CategoryCardsProps {
  posts: CategorizedPost[];
  onCategoryClick: (category: string) => void;
}

export function CategoryCards({ posts, onCategoryClick }: CategoryCardsProps) {
  const categories = {
    solutionRequest: {
      title: "Solution Requests",
      description: "Posts seeking problem solutions",
    },
    painAndAnger: {
      title: "Pain & Anger",
      description: "Posts expressing negative emotions",
    },
    adviceRequest: {
      title: "Advice Requests",
      description: "Posts asking for guidance",
    },
    moneyTalk: {
      title: "Money Talk",
      description: "Posts discussing finances",
    },
  };

  const getCategoryCount = (category: keyof typeof categories) => {
    return posts.filter((post) => post.categories[category]).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(categories).map(([key, { title, description }]) => (
        <button
          key={key}
          onClick={() => onCategoryClick(key)}
          className="p-4 rounded-lg border hover:border-primary transition-colors"
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="mt-2 text-2xl font-bold">
            {getCategoryCount(key as keyof typeof categories)}
          </p>
        </button>
      ))}
    </div>
  );
}
