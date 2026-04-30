import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getBlogCategories, getBlogPosts, getBlogTags } from "@/api/blog";
import type { BlogCategoryResponse, BlogPostQueryRequest, BlogPostResponse, BlogTagResponse, PageResult } from "@/api/blog";
import { BlogCard } from "@/components/shared/BlogCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronRight, Filter } from "lucide-react";

// export const dynamic = "force-dynamic";
export const revalidate = 600; // Cache for 10 minutes

export const metadata: Metadata = {
  title: "Blog | Platform News & Insights",
  description: "Stay updated with the latest news, tutorials, and insights from our high-performance computing platform.",
};

type BlogPageProps = {
  searchParams?: Promise<{
    category_id?: string;
    tag_id?: string;
    pageNo?: string;
  }>;
};

const emptyPage: PageResult<BlogPostResponse> = {
  records: [],
  total: 0,
  pageNo: 1,
  pageSize: 9,
};

function toOptionalNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildBlogQuery(params: Awaited<BlogPageProps["searchParams"]>): BlogPostQueryRequest {
  return {
    pageNo: toOptionalNumber(params?.pageNo) ?? 1,
    pageSize: 9,
    category_id: toOptionalNumber(params?.category_id),
    tag_id: toOptionalNumber(params?.tag_id),
    publish_status: 1, // Only show published posts
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = buildBlogQuery(resolvedSearchParams);
  
  const [postsRes, categoriesRes, tagsRes] = await Promise.all([
    getBlogPosts(query).catch(() => ({ data: emptyPage })),
    getBlogCategories().catch(() => ({ data: [] })),
    getBlogTags().catch(() => ({ data: [] })),
  ]);

  const posts = postsRes.data || emptyPage;
  const categories = categoriesRes.data || [];
  const tags = tagsRes.data || [];
  const activeCategoryId = query.category_id;
  const activeTagId = query.tag_id;

  return (
    <>
      <Header />
      <main className="shell min-h-screen py-16">
        <PageHeader
          eyebrow="RESOURCES"
          title="Insights & Updates"
          description="Exploring the future of high-performance computing, AI infrastructure, and decentralized cloud solutions."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_280px]">
          {/* Main Content: Post Grid */}
          <section className="space-y-10">
            {posts.records.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {posts.records.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/[0.01] p-12 text-center">
                <div className="mb-4 rounded-full bg-white/5 p-4">
                  <Filter className="h-8 w-8 text-[var(--muted)]" />
                </div>
                <h3 className="text-xl font-medium text-[var(--foreground)]">No articles found</h3>
                <p className="mt-2 text-[var(--muted)]">Try adjusting your filters or check back later.</p>
                <Link 
                  href="/blog"
                  className="mt-6 text-sm font-medium text-[#9aa2ff] hover:underline"
                >
                  Clear all filters
                </Link>
              </div>
            )}

            {/* Pagination Placeholder (if needed in future) */}
            {posts.total > posts.pageSize && (
              <div className="flex justify-center pt-8">
                <div className="flex items-center gap-2">
                  {/* Pagination logic would go here if needed */}
                </div>
              </div>
            )}
          </section>

          {/* Sidebar: Filters */}
          <aside className="space-y-8">
            <div className="sticky top-24 space-y-8">
              {/* Categories */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  <span className="h-1 w-1 rounded-full bg-[#5e6ad2]" />
                  Categories
                </h4>
                <nav className="flex flex-col gap-1">
                  <Link
                    href="/blog"
                    className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                      !activeCategoryId && !activeTagId
                        ? "bg-[#5e6ad2]/10 text-[#9aa2ff]"
                        : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]"
                    }`}
                  >
                    <span>All Articles</span>
                    <ChevronRight className={`h-3 w-3 transition-transform ${!activeCategoryId && !activeTagId ? "translate-x-0.5 opacity-100" : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"}`} />
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/blog?category_id=${cat.id}`}
                      className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                        activeCategoryId === cat.id
                          ? "bg-[#5e6ad2]/10 text-[#9aa2ff]"
                          : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]"
                      }`}
                    >
                      <span>{cat.categoryName}</span>
                      <ChevronRight className={`h-3 w-3 transition-transform ${activeCategoryId === cat.id ? "translate-x-0.5 opacity-100" : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"}`} />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                    <span className="h-1 w-1 rounded-full bg-[#5e6ad2]" />
                    Popular Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/blog?tag_id=${tag.id}`}
                        className={`rounded-full border px-3 py-1 text-xs transition-all ${
                          activeTagId === tag.id
                            ? "border-[#5e6ad2]/50 bg-[#5e6ad2]/10 text-[#9aa2ff]"
                            : "border-white/10 text-[var(--muted)] hover:border-white/20 hover:text-[var(--foreground)]"
                        }`}
                      >
                        {tag.tagName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
