import { redirect } from "next/navigation";
import { localizePathname, normalizeLocale } from "@/i18n/locales";

type ContactSalesRedirectPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContactSalesRedirectPage({ params }: ContactSalesRedirectPageProps) {
  const { locale } = await params;

  redirect(localizePathname("/contact", normalizeLocale(locale)));
}
