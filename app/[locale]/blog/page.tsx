import type { Metadata } from "next";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { getBlogCategories, getBlogPosts } from "@/api/blog";
import type { BlogPostQueryRequest, BlogPostResponse, PageResult } from "@/api/blog";
import { BlogCard } from "@/components/shared/BlogCard";
import { Link } from "@/i18n/navigation";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeLocale } from "@/i18n/locales";

export const revalidate = 600; // Cache for 10 minutes

export const metadata: Metadata = {
  title: "技术博客 & 产品动态 | Platform News",
  description: "探索高性能计算、AI 基础设施和去中心化云解决方案的未来。",
};

type BlogPageProps = {
  params: Promise<{ locale: string }>;
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

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const [{ locale }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const language = normalizeLocale(locale);
  const query = buildBlogQuery(resolvedSearchParams);

  const [postsRes, categoriesRes] = await Promise.all([
    getBlogPosts({ ...query, language }).catch(() => ({ data: emptyPage })),
    getBlogCategories({ language }).catch(() => ({ data: [] })),
  ]);

  const posts = postsRes.data || emptyPage;
  const categories = categoriesRes.data || [];
  const activeCategoryId = query.category_id;

  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-background pt-4 md:pt-6">
        {/* Geek Grid Background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,hsl(var(--ui-foreground)/0.08)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--ui-foreground)/0.08)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="shell relative z-[1] pb-16 pt-12 md:pt-16">
          {/* Hero Section */}
          <section className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              News & Insights
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              探索高性能计算、AI 基础设施和去中心化云解决方案的未来。
            </p>
          </section>


          {/* Category Navigation - Kept minimalist but aligned with theme */}
          <nav className="mb-12 flex items-center justify-center border-b border-border/40 overflow-x-auto whitespace-nowrap">
            <div className="flex gap-8">
              <Link
                href="/blog"
                className={cn(
                  "pb-4 text-sm font-medium transition-colors border-b-2",
                  !activeCategoryId
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                全部文章
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category_id=${cat.id}`}
                  className={cn(
                    "pb-4 text-sm font-medium transition-colors border-b-2",
                    activeCategoryId === cat.id
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat.categoryName}
                </Link>
              ))}
            </div>
          </nav>

          {/* Post Grid - Frameless Specification */}
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-2 lg:grid-cols-3">


            {posts.records.length > 0 ? (
              posts.records.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-full flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium text-foreground">未找到相关文章</h3>
                <p className="mt-2 text-muted-foreground">尝试调整过滤条件或稍后再试。</p>
                <Link
                  href="/blog"
                  className="mt-6 text-sm font-medium text-primary hover:underline"
                >
                  清除所有过滤
                </Link>
              </div>
            )}
          </div>

          {/* Pagination */}
          {posts.total > posts.pageSize && (
            <div className="mt-16 flex justify-center">
              {/* Pagination logic if needed */}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}


