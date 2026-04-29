import Link from "next/link";
import { Eye } from "lucide-react";
import type { BlogPostResponse } from "@/api/blog";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/format";

export function BlogCard({ post }: { post: BlogPostResponse }) {
  const publishedAt = post.publishedAt ?? post.createdAt;

  return (
    <Link
      href={`/blog/${post.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] shadow-[0_24px_56px_-36px_rgba(0,0,0,0.9)] transition duration-200 hover:border-[#7170ff]/45 hover:bg-white/[0.05] hover:shadow-[0_0_0_1px_rgba(113,112,255,0.25),0_24px_70px_-34px_rgba(113,112,255,0.45)]"
    >
      <div className="aspect-[16/9] overflow-hidden bg-white/[0.03]">
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#0f1011] text-xs font-medium uppercase tracking-[0.18em] text-[#62666d]">
            Blog
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
          <span>{formatDate(publishedAt)}</span>
          {post.categoryName ? (
            <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-[#d0d6e0]">
              {post.categoryName}
            </Badge>
          ) : null}
          {Number.isFinite(post.viewCount) ? (
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatNumber(post.viewCount)}
            </span>
          ) : null}
        </div>

        <h2 className="line-clamp-2 text-lg font-medium tracking-tight text-[#f7f8f8] transition group-hover:text-[#9aa2ff]">
          {post.title}
        </h2>

        {post.summary ? <p className="line-clamp-3 text-sm leading-6 text-[#8a8f98]">{post.summary}</p> : null}

        {post.tagNames && post.tagNames.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {post.tagNames.slice(0, 3).map((tagName) => (
              <span key={tagName} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-[#8a8f98]">
                {tagName}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
