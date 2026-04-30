import Link from "next/link";
import { Eye, Calendar, Tag } from "lucide-react";
import type { BlogPostResponse } from "@/api/blog";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/format";

export function BlogCard({ post }: { post: BlogPostResponse }) {
  const publishedAt = post.publishedAt ?? post.createdAt;

  return (
    <Link
      href={`/blog/${post.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_24px_56px_-36px_rgba(0,0,0,0.9)] transition-all duration-300 hover:border-[#7170ff]/50 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(113,112,255,0.15)]"
    >
      {/* Glow Effect Background */}
      <div className="absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5e6ad2]/20 via-transparent to-transparent" />
      </div>

      <div className="relative aspect-[16/9] overflow-hidden">
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#0f1011] text-xs font-medium uppercase tracking-[0.18em] text-[#62666d]">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        
        {post.categoryName && (
          <div className="absolute left-4 top-4">
            <Badge className="bg-[#5e6ad2] text-white hover:bg-[#5e6ad2]/90 border-none shadow-lg shadow-[#5e6ad2]/20">
              {post.categoryName}
            </Badge>
          </div>
        )}
      </div>

      <div className="relative flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-4 text-xs font-medium text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(publishedAt)}
          </span>
          {Number.isFinite(post.viewCount) && (
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              {formatNumber(post.viewCount)}
            </span>
          )}
        </div>

        <h3 className="mb-3 line-clamp-2 text-xl font-semibold leading-tight text-[#f7f8f8] transition-colors group-hover:text-[#9aa2ff]">
          {post.title}
        </h3>

        {post.summary && (
          <p className="line-clamp-2 text-sm leading-relaxed text-[#8a8f98]">
            {post.summary}
          </p>
        )}

        {post.tagNames && post.tagNames.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {post.tagNames.slice(0, 3).map((tagName) => (
              <span 
                key={tagName} 
                className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-medium text-[#8a8f98]"
              >
                <Tag className="h-2.5 w-2.5" />
                {tagName}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
