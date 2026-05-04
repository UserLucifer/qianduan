import type { Metadata } from "next";
import { DocsSectionPage, type DocsSectionSearchParams } from "@/components/docs/DocsSectionPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "常见问题 | 算力租赁文档",
  description: "浏览算力租赁平台常见问题和支持说明。",
};

export default function DocsFaqPage({
  searchParams,
}: {
  searchParams?: Promise<DocsSectionSearchParams>;
}) {
  return <DocsSectionPage section="faq" baseHref="/docs/faq" searchParams={searchParams} />;
}
