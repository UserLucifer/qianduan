import type { Metadata } from "next";
import { DocsSectionPage, type DocsSectionSearchParams } from "@/components/docs/DocsSectionPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "向导 | 算力租赁文档",
  description: "浏览算力租赁平台向导、配置说明和使用文档。",
};

type DocsGuidePageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<DocsSectionSearchParams>;
};

export default async function DocsGuidePage({ params, searchParams }: DocsGuidePageProps) {
  const { locale } = await params;

  return (
    <DocsSectionPage
      section="guide"
      baseHref="/docs"
      locale={locale}
      searchParams={searchParams}
    />
  );
}
