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

export const dynamic = "force-dynamic";

type BlogDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function loadPost(id: string): Promise<BlogPostResponse | null> {
  try {
    const response = await getBlogPostBySlug(id);
    return response.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await loadPost(id);

  if (!post) {
    return {
      title: "Blog",
    };
  }

  return {
    title: post.title,
    description: post.summary,
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
      <main className="shell py-12">
        <Link href="/blog" className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]">
          Back to blog
        </Link>

        <article className="mx-auto mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            <span>{formatDate(publishedAt)}</span>
            {post.categoryName ? (
              <Badge variant="outline" className="border-[var(--card-border)] bg-white/[0.02] text-[var(--muted)]">
                {post.categoryName}
              </Badge>
            ) : null}
          </div>

          <h1 className="mt-5 text-4xl font-medium tracking-tight text-[var(--foreground)] md:text-5xl">
            {post.title}
          </h1>
          {post.summary ? <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{post.summary}</p> : null}

          {post.coverImageUrl ? (
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="mt-8 aspect-[16/9] w-full rounded-xl border border-[var(--card-border)] object-cover"
            />
          ) : null}

          {post.contentMarkdown ? (
            <div className="mt-10">
              <MarkdownContent content={post.contentMarkdown} />
            </div>
          ) : null}
        </article>
      </main>
      <Footer />
    </>
  );
}
