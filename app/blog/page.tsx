import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getBlogCategories, getBlogPosts, getBlogTags } from "@/api/blog";
import type { BlogCategoryResponse, BlogPostQueryRequest, BlogPostResponse, BlogTagResponse, PageResult } from "@/api/blog";
import { BlogCard } from "@/components/shared/BlogCard";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = "force-dynamic";

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
  };
}

function BlogFilters({
  categories,
  tags,
  activeCategoryId,
  activeTagId,
}: {
  categories: BlogCategoryResponse[];
  tags: BlogTagResponse[];
  activeCategoryId?: number;
  activeTagId?: number;
}) {
  return (
    <aside className="space-y-5 rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-4">
      <div>
        <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Categories</div>
        <div className="flex flex-wrap gap-2 lg:flex-col">
          <Link
            href="/blog"
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              activeCategoryId || activeTagId
                ? "border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                : "border-[#5e6ad2]/60 bg-[#5e6ad2]/15 text-[#9aa2ff]"
            }`}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog?category_id=${category.id}`}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                activeCategoryId === category.id
                  ? "border-[#5e6ad2]/60 bg-[#5e6ad2]/15 text-[#9aa2ff]"
                  : "border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {category.categoryName}
            </Link>
          ))}
        </div>
      </div>

      {tags.length > 0 ? (
        <div>
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Tags</div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag_id=${tag.id}`}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  activeTagId === tag.id
                    ? "border-[#5e6ad2]/60 bg-[#5e6ad2]/15 text-[#9aa2ff]"
                    : "border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {tag.tagName}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = buildBlogQuery(resolvedSearchParams);
  const [postsResult, categoriesResult, tagsResult] = await Promise.allSettled([
    getBlogPosts(query),
    getBlogCategories(),
    getBlogTags(),
  ]);

  const posts = postsResult.status === "fulfilled" ? postsResult.value.data : emptyPage;
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value.data : [];
  const tags = tagsResult.status === "fulfilled" ? tagsResult.value.data : [];
  const activeCategoryId = query.category_id;
  const activeTagId = query.tag_id;

  return (
    <>
      <Header />
      <main className="shell py-12">
        <PageHeader
          eyebrow="BLOG"
          title="News & Insights"
          description="Follow platform updates, compute operations notes, and technical articles from the public blog feed."
        />

        {(postsResult.status === "rejected" || categoriesResult.status === "rejected" || tagsResult.status === "rejected") ? (
          <div className="mt-8 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
            Blog data is temporarily unavailable.
          </div>
        ) : null}

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <section>
            {posts.records.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {posts.records.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-8 text-sm text-[var(--muted)]">
                No blog posts found.
              </div>
            )}
          </section>

          <BlogFilters categories={categories} tags={tags} activeCategoryId={activeCategoryId} activeTagId={activeTagId} />
        </div>
      </main>
      <Footer />
    </>
  );
}
