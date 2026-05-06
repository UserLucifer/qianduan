import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DocsSectionPage, type DocsSectionSearchParams } from "@/components/docs/DocsSectionPage";
import { normalizeLocale } from "@/i18n/locales";

export const revalidate = 300;

type DocsFaqPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<DocsSectionSearchParams>;
};

export async function generateMetadata({ params }: Pick<DocsFaqPageProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "DocsMetadata.faq" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

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
