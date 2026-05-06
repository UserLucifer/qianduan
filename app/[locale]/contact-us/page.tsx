import { redirect } from "next/navigation";
import { localizePathname, normalizeLocale } from "@/i18n/locales";

type ContactUsRedirectPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContactUsRedirectPage({ params }: ContactUsRedirectPageProps) {
  const { locale } = await params;

  redirect(localizePathname("/contact", normalizeLocale(locale)));
}
