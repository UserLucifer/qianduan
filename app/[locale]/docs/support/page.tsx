import type { Metadata } from "next";
import { DocsSectionPage, type DocsSectionSearchParams } from "@/components/docs/DocsSectionPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "支持 | 算力租赁文档",
  description: "浏览算力租赁平台服务支持说明和联系指引。",
};

type DocsSupportPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<DocsSectionSearchParams>;
};

export default async function DocsSupportPage({ params, searchParams }: DocsSupportPageProps) {
  const { locale } = await params;

  return (
    <DocsSectionPage
      section="support"
      baseHref="/docs/support"
      locale={locale}
      searchParams={searchParams}
    />
  );
}
