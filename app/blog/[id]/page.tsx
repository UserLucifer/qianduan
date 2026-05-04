import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { getBlogPostBySlug } from "@/api/blog";
import type { BlogPostResponse } from "@/api/blog";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { ReadingProgressBar } from "@/components/shared/ReadingProgressBar";
import { formatDate } from "@/lib/format";
import { ArrowLeft, Calendar, Eye, User } from "lucide-react";
import { cache } from "react";

export const revalidate = 3600; // Cache for 1 hour

type BlogDetailPageProps = {
  params: Promise<{ id: string }>;
};

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
      <ReadingProgressBar />
      <Header />
      <main className="shell min-h-screen pb-16 pt-32 md:pt-40">
        {/* Navigation */}
        <div className="mx-auto max-w-[700px] mb-12">
          <Link 
            href="/blog" 
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            返回列表
          </Link>
        </div>

        <article className="mx-auto max-w-[700px]">
          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:leading-[1.1]">
              {post.title}
            </h1>
            
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>官方团队</span>
              </div>
              {post.viewCount !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span>{post.viewCount} 次阅读</span>
                </div>
              )}
              {post.categoryName && (
                <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-medium text-foreground">
                  {post.categoryName}
                </span>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {post.coverImageUrl && (
            <div className="mb-12 overflow-hidden rounded-2xl">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="aspect-[21/9] w-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none mt-10">
            {post.contentMarkdown ? (
              <MarkdownContent content={post.contentMarkdown} />
            ) : (
              <div className="py-20 text-center text-muted-foreground italic">
                暂无正文内容。
              </div>
            )}
          </div>

          {/* Article Footer: Tags */}
          {post.tagNames && post.tagNames.length > 0 && (
            <footer className="mt-16 border-t border-border pt-8">
              <div className="flex flex-wrap gap-2">
                {post.tagNames.map((tag) => (
                  <span 
                    key={tag} 
                    className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
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


