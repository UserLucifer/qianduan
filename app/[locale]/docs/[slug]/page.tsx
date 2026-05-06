import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  getDocsArticleBySlug,
  getDocsArticles,
  getDocsCategories,
  type DocsArticle,
  type DocsCategory,
  type DocsLanguage,
  type PageResult,
} from "@/api/docs";
import { DocsArticleContent } from "@/components/docs/DocsArticleContent";
import { DocsFrame } from "@/components/docs/DocsFrame";
import { normalizeDocsLanguage } from "@/components/docs/sections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "文档详情 | 算力租赁",
  description: "阅读平台使用指南、API 说明和支持文档。",
};

type DocsDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ language?: string }>;
};

const emptyPage: PageResult<DocsArticle> = {
  records: [],
  total: 0,
  pageNo: 1,
  pageSize: 100,
};

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

const loadArticle = cache(async (slug: string, language: DocsLanguage): Promise<DocsArticle | null> => {
  try {
    const response = await getDocsArticleBySlug(decodeSlug(slug), { language });
    return response.data ?? null;
  } catch (error) {
    console.error(`Failed to load docs article ${slug}:`, error);
    return null;
  }
});

export default async function DocsDetailPage({ params, searchParams }: DocsDetailPageProps) {
  const [{ locale, slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const language = normalizeDocsLanguage(locale ?? resolvedSearchParams?.language);
  const article = await loadArticle(slug, language);

  if (!article) {
    notFound();
  }

  const articleLanguage = article.language ?? language;
  const section = article.section ?? "guide";
  const [categoriesRes, sidebarRes] = await Promise.all([
    getDocsCategories({ language: articleLanguage, section }).catch(() => ({ data: [] as DocsCategory[] })),
    getDocsArticles({ language: articleLanguage, section, pageNo: 1, pageSize: 100 }).catch(() => ({ data: emptyPage })),
  ]);

  const categories = categoriesRes.data ?? [];
  const sidebarArticles = sidebarRes.data?.records ?? [];
  const currentIndex = sidebarArticles.findIndex((item) => item.id === article.id);
  const nextArticle =
    currentIndex >= 0
      ? sidebarArticles[currentIndex + 1] ?? sidebarArticles.find((item) => item.id !== article.id)
      : sidebarArticles.find((item) => item.id !== article.id);

  return (
    <DocsFrame
      categories={categories}
      sidebarArticles={sidebarArticles}
      activeSection={section}
      language={articleLanguage}
      activeSlug={article.slug}
      activeCategoryId={article.categoryId}
    >
      <DocsArticleContent article={article} nextArticle={nextArticle} />
    </DocsFrame>
  );
}
