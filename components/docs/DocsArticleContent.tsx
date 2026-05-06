import Link from "next/link";
import { ArrowRight, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocsCopyButton } from "@/components/docs/DocsCopyButton";
import { MarkdownContent } from "@/components/shared/MarkdownContent";
import { formatDate } from "@/lib/format";
import { articleHref } from "@/components/docs/DocsFrame";
import {
  DOCS_DEFAULT_LANGUAGE,
  docsSectionHref,
  docsSectionLabel,
  withDocsLanguage,
} from "@/components/docs/sections";
import type { DocsArticle } from "@/api/docs";

export function DocsArticleContent({
  article,
  nextArticle,
}: {
  article: DocsArticle;
  nextArticle?: DocsArticle;
}) {
  const language = article.language ?? DOCS_DEFAULT_LANGUAGE;

  return (
    <article className="pt-6 md:pt-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#4770FF]">
            {article.categoryName ?? "文档中心"}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {article.title}
          </h1>
          {article.summary ? (
            <p className="mt-3 max-w-2xl text-lg leading-8 text-muted-foreground">
              {article.summary}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(article.publishedAt ?? article.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {article.viewCount ?? 0} 次浏览
            </span>
          </div>
        </div>
        <DocsCopyButton />
      </header>

      <div className="mt-14">
        {article.contentMarkdown ? (
          <MarkdownContent content={article.contentMarkdown} />
        ) : (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            该文档暂无正文内容。
          </div>
        )}
      </div>

      {nextArticle ? (
        <div className="mt-16 border-t border-border pt-10">
          <Button asChild variant="ghost" className="h-auto w-full justify-between whitespace-normal px-0 py-4 text-left hover:bg-transparent">
            <Link href={articleHref(nextArticle, language)}>
              <span>
                <span className="block text-sm font-semibold text-muted-foreground">
                  下一篇
                </span>
                <span className="mt-1 block text-base font-semibold text-foreground">
                  {nextArticle.title}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      ) : null}

      <footer className="mt-10 flex items-center justify-between border-t border-border pt-8 text-sm text-foreground">
        <span className="font-semibold">算力租赁文档</span>
        <Link href={withDocsLanguage(docsSectionHref(article.section), language)} className="font-semibold text-foreground hover:text-foreground">
          返回{docsSectionLabel(article.section)}
        </Link>
      </footer>
    </article>
  );
}
