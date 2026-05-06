import type { Metadata } from "next";
import { DocsSectionPage, type DocsSectionSearchParams } from "@/components/docs/DocsSectionPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "常见问题 | 算力租赁文档",
  description: "浏览算力租赁平台常见问题和支持说明。",
};

type DocsFaqPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<DocsSectionSearchParams>;
};

export default async function DocsFaqPage({ params, searchParams }: DocsFaqPageProps) {
  const { locale } = await params;

  return (
    <DocsSectionPage
      section="faq"
      baseHref="/docs/faq"
      locale={locale}
      searchParams={searchParams}
    />
  );
}
