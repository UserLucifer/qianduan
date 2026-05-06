import type { Metadata } from "next";
import { DocsSectionPage, type DocsSectionSearchParams } from "@/components/docs/DocsSectionPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "集成 | 算力租赁文档",
  description: "浏览算力租赁平台集成指南和 API 接入说明。",
};

type DocsIntegrationsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<DocsSectionSearchParams>;
};

export default async function DocsIntegrationsPage({ params, searchParams }: DocsIntegrationsPageProps) {
  const { locale } = await params;

  return (
    <DocsSectionPage
      section="integration"
      baseHref="/docs/integrations"
      locale={locale}
      searchParams={searchParams}
    />
  );
}
