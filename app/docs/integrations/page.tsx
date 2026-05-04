import type { Metadata } from "next";
import { DocsSectionPage, type DocsSectionSearchParams } from "@/components/docs/DocsSectionPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "集成 | 算力租赁文档",
  description: "浏览算力租赁平台集成指南和 API 接入说明。",
};

export default function DocsIntegrationsPage({
  searchParams,
}: {
  searchParams?: Promise<DocsSectionSearchParams>;
}) {
  return <DocsSectionPage section="integration" baseHref="/docs/integrations" searchParams={searchParams} />;
}
