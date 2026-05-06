import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight, BookOpen, Eye } from "lucide-react";
import {
  getDocsArticles,
  getDocsCategories,
  getDocsSectionHome,
  searchDocs,
  type DocsArticle,
  type DocsCategory,
  type DocsLanguage,
  type DocsSection,
  type PageResult,
} from "@/api/docs";
import { DocsArticleContent } from "@/components/docs/DocsArticleContent";
import { DocsCopyButton } from "@/components/docs/DocsCopyButton";
import { DocsFrame, articleHref } from "@/components/docs/DocsFrame";
import { docsSectionLabel, normalizeDocsLanguage, withDocsLanguage } from "@/components/docs/sections";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type DocsSectionSearchParams = {
  pageNo?: string;
  pageSize?: string;
  category_id?: string;
  language?: string;
  keyword?: string;
};

const emptyPage: PageResult<DocsArticle> = {
  records: [],
  total: 0,
  pageNo: 1,
  pageSize: 10,
};

function toOptionalNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function flattenCategories(categories: DocsCategory[]): DocsCategory[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children ?? []),
  ]);
}

function buildPageHref({
  baseHref,
  pageNo,
  keyword,
  categoryId,
  language,
}: {
  baseHref: string;
  pageNo: number;
  keyword?: string;
  categoryId?: number;
  language: DocsLanguage;
}) {
  const params = new URLSearchParams();
  if (pageNo > 1) params.set("pageNo", String(pageNo));
  if (categoryId) params.set("category_id", String(categoryId));
  if (keyword) params.set("keyword", keyword);
  const query = params.toString();
  return query ? `${baseHref}?${query}` : baseHref;
}

function getNextArticle(articles: DocsArticle[], currentArticle: DocsArticle | null) {
  if (!currentArticle) return undefined;
  const currentIndex = articles.findIndex((item) => item.id === currentArticle.id);
  return currentIndex >= 0
    ? articles[currentIndex + 1] ?? articles.find((item) => item.id !== currentArticle.id)
    : articles.find((item) => item.id !== currentArticle.id);
}

function formatDocDate(value: string | null | undefined, language: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(language, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function DocsSectionPage({
  section,
  baseHref,
  locale,
  searchParams,
}: {
  section: DocsSection;
  baseHref: string;
  locale?: string;
  searchParams?: Promise<DocsSectionSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const pageNo = toOptionalNumber(resolvedSearchParams?.pageNo) ?? 1;
  const pageSize = toOptionalNumber(resolvedSearchParams?.pageSize) ?? 10;
  const categoryId = toOptionalNumber(resolvedSearchParams?.category_id);
  const language = normalizeDocsLanguage(locale ?? resolvedSearchParams?.language);
  const t = await getTranslations({ locale: language, namespace: "Docs" });
  const keyword = resolvedSearchParams?.keyword?.trim();
  const isFilteredView = Boolean(keyword || categoryId || pageNo > 1);

  const articleRequest = keyword
    ? searchDocs({ language, section, pageNo, pageSize, keyword })
    : getDocsArticles({ language, section, pageNo, pageSize, category_id: categoryId });

  const [categoriesRes, sidebarRes, articlesRes, homeRes] = await Promise.all([
    getDocsCategories({ language, section }).catch(() => ({ data: [] as DocsCategory[] })),
    getDocsArticles({ language, section, pageNo: 1, pageSize: 100 }).catch(() => ({ data: emptyPage })),
    articleRequest.catch(() => ({ data: emptyPage })),
    getDocsSectionHome(section, { language }).catch(() => ({ data: null as DocsArticle | null })),
  ]);

  const categories = categoriesRes.data ?? [];
  const sidebarArticles = sidebarRes.data?.records ?? [];
  const page = articlesRes.data ?? emptyPage;
  const homeArticle = homeRes.data;
  const selectedCategory = categoryId
    ? flattenCategories(categories).find((category) => category.id === categoryId)
    : undefined;
  const sectionLabel = docsSectionLabel(section, language);
  const canPrevious = page.pageNo > 1;
  const pageCount = Math.max(1, Math.ceil(page.total / page.pageSize));
  const canNext = page.pageNo < pageCount;

  if (!isFilteredView && homeArticle) {
    return (
      <DocsFrame
        categories={categories}
        sidebarArticles={sidebarArticles}
        activeSection={section}
        language={language}
        activeSlug={homeArticle.slug}
        activeCategoryId={homeArticle.categoryId}
      >
        <DocsArticleContent article={homeArticle} nextArticle={getNextArticle(sidebarArticles, homeArticle)} />
      </DocsFrame>
    );
  }

  return (
    <DocsFrame
      categories={categories}
      sidebarArticles={sidebarArticles}
      activeSection={section}
      language={language}
      activeCategoryId={categoryId}
      keyword={keyword}
    >
      <div className="pt-6 md:pt-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#4770FF]">
              {keyword ? t("searchResults") : selectedCategory?.categoryName ?? sectionLabel}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {t("docsCenter")}
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-muted-foreground">
              {t("description")}
            </p>
          </div>
          <DocsCopyButton />
        </div>

        <div className="mt-12 space-y-4">
          {page.records.length > 0 ? (
            page.records.map((article) => (
              <Link
                key={article.id}
                href={articleHref(article, language)}
                className="group block border-b border-border py-6 transition-colors hover:border-[#4770FF]/40"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {article.categoryName ? (
                        <Badge variant="outline" className="rounded-full font-normal text-muted-foreground">
                          {article.categoryName}
                        </Badge>
                      ) : null}
                      {article.isSectionHome === 1 ? (
                        <Badge variant="outline" className="rounded-full border-[#4770FF]/20 bg-[#EAEFFF] font-normal text-[#4770FF]">
                          {t("sectionHome")}
                        </Badge>
                      ) : null}
                      <span className="text-xs text-muted-foreground">
                        {formatDocDate(article.publishedAt ?? article.createdAt, language)}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground group-hover:text-[#4770FF]">
                      {article.title}
                    </h2>
                    {article.summary ? (
                      <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        {article.summary}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {t("views", { count: article.viewCount ?? 0 })}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-10 text-center">
              <BookOpen className="h-9 w-9 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-semibold text-foreground">{t("noDocs")}</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {t("noDocsDescription")}
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href={withDocsLanguage(baseHref, language)}>{t("clearFilters")}</Link>
              </Button>
            </div>
          )}
        </div>

        {page.total > page.pageSize ? (
          <div className="mt-10 flex items-center justify-between border-t border-border pt-6 text-sm text-muted-foreground">
            <span>
              {t("pageSummary", { pageNo: page.pageNo, pageCount, total: page.total })}
            </span>
            <div className="flex items-center gap-2">
              {canPrevious ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={buildPageHref({ baseHref, pageNo: page.pageNo - 1, keyword, categoryId, language })}>
                    {t("previousPage")}
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  {t("previousPage")}
                </Button>
              )}
              {canNext ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={buildPageHref({ baseHref, pageNo: page.pageNo + 1, keyword, categoryId, language })}>
                    {t("nextPage")}
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  {t("nextPage")}
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </DocsFrame>
  );
}
