import { redirect } from "next/navigation";
import { localizePathname, normalizeLocale } from "@/i18n/locales";

type AdminsIndexPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminsIndexPage({ params }: AdminsIndexPageProps) {
  const { locale } = await params;

  redirect(localizePathname("/admins/dashboard", normalizeLocale(locale)));
}
