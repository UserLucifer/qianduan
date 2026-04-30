import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getBlogPostBySlug } from "@/api/blog";
import type { BlogPostResponse } from "@/api/blog";
import { Badge } from "@/components/ui/badge";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { formatDate } from "@/lib/format";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import { cache } from "react";

// export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour

type BlogDetailPageProps = {
  params: Promise<{ id: string }>;
};

// Use React cache to deduplicate data fetching across generateMetadata and the page component
const loadPost = cache(async (id: string): Promise<BlogPostResponse | null> => {
  try {
    const response = await getBlogPostBySlug(id);
    return response.data ?? null;
  } catch (error) {
    console.error(`Failed to load blog post ${id}:`, error);
    return null;
  }
});

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await loadPost(id);

  if (!post) {
    return {
      title: "Blog | Article Not Found",
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: post.coverImageUrl ? [post.coverImageUrl] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;
  const post = await loadPost(id);

  if (!post) {
    notFound();
  }

  const publishedAt = post.publishedAt ?? post.createdAt;

  return (
    <>
      <Header />
      <main className="shell min-h-screen py-16">
        {/* Navigation / Breadcrumb */}
        <div className="mb-12">
          <Link 
            href="/blog" 
            className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Insights
          </Link>
        </div>

        <article className="mx-auto max-w-3xl">
          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--muted)]">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDate(publishedAt)}</span>
              </div>
              {post.viewCount !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{post.viewCount} views</span>
                </div>
              )}
              {post.categoryName && (
                <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-[#9aa2ff]">
                  {post.categoryName}
                </Badge>
              )}
            </div>

            <h1 className="mb-8 text-4xl font-bold tracking-tight text-[var(--foreground)] md:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            {post.summary && (
              <p className="text-xl leading-relaxed text-[var(--muted)]">
                {post.summary}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {post.coverImageUrl && (
            <div className="mb-16 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose-wrapper">
            {post.contentMarkdown ? (
              <MarkdownContent content={post.contentMarkdown} />
            ) : (
              <div className="py-20 text-center text-[var(--muted)] italic">
                This article has no content.
              </div>
            )}
          </div>

          {/* Article Footer: Tags */}
          {post.tagNames && post.tagNames.length > 0 && (
            <footer className="mt-20 border-t border-white/10 pt-10">
              <div className="flex flex-wrap gap-2">
                {post.tagNames.map((tag) => (
                  <span 
                    key={tag} 
                    className="rounded-full border border-white/5 bg-white/[0.02] px-3 py-1 text-xs text-[var(--muted)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
