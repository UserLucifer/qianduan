import Link from "next/link";
import { Calendar } from "lucide-react";
import type { BlogPostResponse } from "@/api/blog";
import { formatDate } from "@/lib/format";

export function BlogCard({ post }: { post: BlogPostResponse }) {
  const publishedAt = post.publishedAt ?? post.createdAt;

  return (
    <Link
      href={`/blog/${post.id}`}
      className="group flex flex-col"
    >
      {/* Cover Image */}
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted">
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/50">
            No Image
          </div>
        )}
      </div>

      {/* Meta Information */}
      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span>{formatDate(publishedAt)}</span>
        {post.categoryName && (
          <>
            <span className="text-muted-foreground/30">/</span>
            <span>{post.categoryName}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-4 text-xl font-bold leading-snug text-foreground group-hover:underline underline-offset-4">
        {post.title}
      </h3>

      {/* Optional Summary - explicitly kept minimal as per frameless spec */}
      {post.summary && (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.summary}
        </p>
      )}

    </Link>
  );
}


