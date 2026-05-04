import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpen,
  ChevronRight,
  FileText,
  Newspaper,
} from "lucide-react";
import { DocsTopbar } from "@/components/docs/DocsTopbar";
import {
  DOCS_DEFAULT_LANGUAGE,
  DOCS_SECTION_ITEMS,
  docsSectionHref,
  withDocsLanguage,
} from "@/components/docs/sections";
import { cn } from "@/lib/utils";
import type { DocsArticle, DocsCategory, DocsLanguage, DocsSection } from "@/api/docs";

type DocsFrameProps = {
  categories: DocsCategory[];
  sidebarArticles: DocsArticle[];
  activeSection: DocsSection;
  language: DocsLanguage;
  activeSlug?: string;
  activeCategoryId?: number;
  keyword?: string;
  children: ReactNode;
};

function sortBySortNo<T extends { sortNo?: number; id?: number }>(items: T[]) {
  return [...items].sort((a, b) => {
    const sortDiff = Number(a.sortNo ?? 0) - Number(b.sortNo ?? 0);
    if (sortDiff !== 0) return sortDiff;
    return Number(a.id ?? 0) - Number(b.id ?? 0);
  });
}

function articleHref(article: DocsArticle, language: DocsLanguage = article.language ?? DOCS_DEFAULT_LANGUAGE) {
  return withDocsLanguage(`/docs/${encodeURIComponent(article.slug || String(article.id))}`, language);
}

function articlesForCategory(articles: DocsArticle[], categoryId: number) {
  return sortBySortNo(articles.filter((article) => article.categoryId === categoryId));
}

function renderCategoryBranch({
  category,
  articles,
  sectionHref,
  language,
  activeSlug,
  activeCategoryId,
  depth = 0,
}: {
  category: DocsCategory;
  articles: DocsArticle[];
  sectionHref: string;
  language: DocsLanguage;
  activeSlug?: string;
  activeCategoryId?: number;
  depth?: number;
}) {
  const branchArticles = articlesForCategory(articles, category.id);
  const children = sortBySortNo(category.children ?? []);
  const isActiveCategory = activeCategoryId === category.id;

  return (
    <div key={category.id} className={cn("space-y-1", depth > 0 && "pl-3")}>
      <Link
        href={withDocsLanguage(`${sectionHref}?category_id=${category.id}`, language)}
        aria-current={isActiveCategory ? "page" : undefined}
        className={cn(
          "mt-6 block rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors first:mt-0",
          !isActiveCategory && "hover:bg-muted/60",
        )}
      >
        {category.categoryName}
      </Link>

      {branchArticles.map((article) => {
        const isActive = activeSlug === article.slug;
        return (
          <Link
            key={article.id}
            href={articleHref(article, language)}
            className={cn(
              "flex items-start justify-between gap-2 rounded-lg px-3 py-2 text-sm leading-5 transition-colors",
              isActive
                ? "bg-emerald-50 font-semibold text-emerald-700"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <span className="min-w-0">{article.title}</span>
            {isActive ? null : <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-45" />}
          </Link>
        );
      })}

      {children.map((child) =>
        renderCategoryBranch({
          category: child,
          articles,
          sectionHref,
          language,
          activeSlug,
          activeCategoryId,
          depth: depth + 1,
        }),
      )}
    </div>
  );
}

export function DocsFrame({
  categories,
  sidebarArticles,
  activeSection,
  language,
  activeSlug,
  activeCategoryId,
  keyword,
  children,
}: DocsFrameProps) {
  const sortedCategories = sortBySortNo(categories);
  const sortedArticles = sortBySortNo(sidebarArticles);
  const sectionHref = docsSectionHref(activeSection);
  const topTabs = [
    ...DOCS_SECTION_ITEMS.map((item) => ({
      ...item,
      href: withDocsLanguage(item.href, language),
      active: item.section === activeSection,
    })),
    { label: "支持", href: withDocsLanguage(docsSectionHref("support"), language), active: activeSection === "support" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur">
        <DocsTopbar activeSection={activeSection} language={language} keyword={keyword} />
        <div className="mx-auto flex h-12 w-full max-w-[1240px] items-center gap-6 border-b border-border px-5 md:px-10">
          <nav className="flex min-w-0 items-center gap-6 overflow-x-auto text-sm font-medium text-muted-foreground scrollbar-none">
            {topTabs.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex h-12 shrink-0 items-center gap-1.5 border-b border-transparent transition-colors hover:text-foreground",
                  item.active && "border-emerald-600 text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-8 px-5 py-8 md:px-10 lg:grid-cols-[280px_minmax(0,760px)] lg:gap-14">
        <aside className="lg:sticky lg:top-36 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pr-2">
          <div className="space-y-1 border-b border-border pb-6">
            <Link
              href="/rental"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              定价
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            >
              <Newspaper className="h-4 w-4" />
              博客
            </Link>
          </div>

          <nav aria-label="文档导航" className="pt-6">
            {sortedCategories.length > 0 ? (
              sortedCategories.map((category) =>
                renderCategoryBranch({
                  category,
                  articles: sortedArticles,
                  sectionHref,
                  language,
                  activeSlug,
                  activeCategoryId,
                }),
              )
            ) : (
              <div className="space-y-1">
                <p className="px-3 text-sm font-semibold text-foreground">文档中心</p>
                {sortedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={articleHref(article, language)}
                    className={cn(
                      "flex items-start gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      activeSlug === article.slug && "bg-emerald-50 font-semibold text-emerald-700",
                    )}
                  >
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{article.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </aside>

        <section className="min-w-0 pb-12">{children}</section>
      </div>
    </main>
  );
}

export { articleHref };
