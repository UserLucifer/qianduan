import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/api/blog";
import type { BlogPostResponse } from "@/api/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { normalizeLocale } from "@/i18n/locales";
import { getTranslations } from "next-intl/server";

type BlogPreviewPost = {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  image: string;
  href: string;
};

type FallbackPostCopy = {
  title: string;
  summary: string;
  category: string;
};

const fallbackPostMeta = [
  {
    id: "gpu-rental-training",
    date: "2026-05-05",
    image: "/images/home/下载.png",
    href: "/blog",
  },
  {
    id: "inference-readiness",
    date: "2026-04-28",
    image: "/images/home/3.webp",
    href: "/blog",
  },
  {
    id: "gpu-cluster-reliability",
    date: "2026-04-16",
    image: "/images/home/hub-ml.png",
    href: "/blog",
  },
];

const fallbackImages = fallbackPostMeta.map((post) => post.image);

function formatPreviewDate(value: string | undefined, locale: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function createFallbackPosts(copy: FallbackPostCopy[], locale: string): BlogPreviewPost[] {
  return fallbackPostMeta.map((post, index) => ({
    ...post,
    ...copy[index],
    date: formatPreviewDate(post.date, locale),
  }));
}

function toPreviewPost(
  post: BlogPostResponse,
  index: number,
  locale: string,
  fallbackPosts: BlogPreviewPost[],
  defaultSummary: string,
  defaultCategory: string,
): BlogPreviewPost {
  const date = formatPreviewDate(post.publishedAt ?? post.createdAt, locale);

  return {
    id: String(post.id),
    title: post.title,
    summary: post.summary?.trim() || fallbackPosts[index]?.summary || defaultSummary,
    category: post.categoryName || fallbackPosts[index]?.category || defaultCategory,
    date: date === "-" ? fallbackPosts[index]?.date || "" : date,
    image: post.coverImageUrl || fallbackImages[index % fallbackImages.length],
    href: `/blog/${post.id}`,
  };
}

async function loadPreviewPosts(
  locale: string,
  fallbackPosts: BlogPreviewPost[],
  defaultSummary: string,
  defaultCategory: string,
): Promise<BlogPreviewPost[]> {
  const language = normalizeLocale(locale);

  try {
    const response = await getBlogPosts(
      {
        pageNo: 1,
        pageSize: 3,
        publish_status: 1,
        language,
      },
      { timeout: 2500 },
    );
    const records = response.data?.records ?? [];

    if (records.length === 0) {
      return fallbackPosts;
    }

    return records
      .slice(0, 3)
      .map((post, index) => toPreviewPost(post, index, language, fallbackPosts, defaultSummary, defaultCategory));
  } catch {
    return fallbackPosts;
  }
}

export default async function BlogPreviewSection({ locale }: { locale?: string }) {
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "MarketingHome.blogPreview" });
  const fallbackPosts = createFallbackPosts(t.raw("fallbackPosts") as FallbackPostCopy[], language);
  const posts = await loadPreviewPosts(language, fallbackPosts, t("defaultSummary"), t("defaultCategory"));

  return (
    <section className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] border-t border-[var(--line)] bg-[var(--background)] py-20 text-[var(--foreground)] sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-[590] leading-tight tracking-normal md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)] md:text-base">
              {t("subtitle")}
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="w-fit border-[var(--card-border)] bg-[var(--surface)] text-[var(--foreground)] shadow-none hover:bg-[var(--surface-strong)]"
          >
            <Link href="/blog">
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="group overflow-hidden rounded-[8px] border-[var(--card-border)] bg-[var(--surface)] text-[var(--foreground)] shadow-none transition-colors hover:border-[var(--accent)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[var(--surface-strong)]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={post.image.startsWith("http")}
                />
                <Badge
                  variant="secondary"
                  className="absolute left-3 top-3 rounded-[4px] border border-[var(--line)] bg-[var(--surface-strong)] px-2 py-1 text-[10px] font-[590] uppercase tracking-normal text-[var(--foreground)]"
                >
                  {post.category}
                </Badge>
              </div>
              <CardContent className="p-5 sm:p-6">
                <p className="text-sm text-[var(--muted)]">{post.date}</p>
                <h3 className="mt-4 line-clamp-2 text-xl font-[590] leading-snug tracking-normal">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                  {post.summary}
                </p>
                <Button
                  asChild
                  variant="link"
                  className="mt-5 h-auto justify-start p-0 text-xs font-[590] uppercase tracking-normal text-[var(--foreground)] hover:text-[var(--accent)]"
                >
                  <Link href={post.href}>
                    {t("readMore")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
