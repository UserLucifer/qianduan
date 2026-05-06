import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DocsSectionPage, type DocsSectionSearchParams } from "@/components/docs/DocsSectionPage";
import { normalizeLocale } from "@/i18n/locales";

export const revalidate = 300;

type DocsIntegrationsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<DocsSectionSearchParams>;
};

export async function generateMetadata({ params }: Pick<DocsIntegrationsPageProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "DocsMetadata.integrations" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

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
