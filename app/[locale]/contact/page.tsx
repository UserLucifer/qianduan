import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Headphones,
  LifeBuoy,
  Mail,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { ContactForm } from "./ContactForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeLocale } from "@/i18n/locales";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

const contactChannelMeta = [
  {
    key: "sales",
    icon: Building2,
    type: "mail",
  },
  {
    key: "support",
    icon: LifeBuoy,
    type: "internal",
    href: "/docs/support",
  },
  {
    key: "compliance",
    icon: ShieldCheck,
    type: "mail",
  },
] as const;

const responseStepMeta = [
  { key: "requirements", icon: MessageSquare },
  { key: "assessment", icon: FileText },
  { key: "launch", icon: Headphones },
] as const;

const responseTargetKeys = ["sales", "incident", "compliance"] as const;

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Contact" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

function getMailHref(subject: string) {
  return `mailto:contact@example.com?subject=${encodeURIComponent(subject)}`;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Contact" });
  const preparationItems = t.raw("preparation.items") as string[];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)]">
        <section className="relative overflow-hidden border-b border-[var(--line)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30 [mask-image:linear-gradient(to_bottom,#000,transparent_72%)]" />
          <div className="relative mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-14 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:py-20 lg:px-8">
            <div className="flex flex-col justify-center">
              <Badge
                variant="outline"
                className="w-fit rounded-full border-[var(--card-border)] bg-[var(--surface)] px-3 py-1 text-[var(--badge-foreground)]"
              >
                {t("hero.badge")}
              </Badge>
              <h1 className="mt-6 max-w-3xl text-4xl font-[510] leading-[1.04] text-[var(--foreground)] md:text-6xl">
                {t("hero.title")}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                {t("hero.description")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="h-10 rounded-lg bg-[var(--accent)] text-white shadow-none hover:bg-[var(--accent-hover)]">
                  <a href="mailto:contact@example.com">
                    contact@example.com
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-10 rounded-lg border-[var(--card-border)] bg-[var(--surface)] shadow-none">
                  <Link href="/docs/faq">
                    {t("hero.faq")}
                    <BookOpen className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <Card className="border-[var(--card-border)] bg-[var(--surface-strong)] shadow-[var(--shadow-soft)]">
              <CardHeader className="border-b border-[var(--line)] p-6">
                <CardTitle className="text-xl font-[590] text-[var(--foreground)]">
                  {t("formPanel.title")}
                </CardTitle>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  {t("formPanel.description")}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-[510] leading-tight text-[var(--foreground)] md:text-3xl">
              {t("channelsTitle")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)] md:text-base">
              {t("channelsDescription")}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {contactChannelMeta.map((channel) => {
              const Icon = channel.icon;
              const title = t(`channels.${channel.key}.title`);
              const description = t(`channels.${channel.key}.description`);
              const action = t(`channels.${channel.key}.action`);
              const href =
                channel.type === "mail"
                  ? getMailHref(t(`channels.${channel.key}.subject`))
                  : channel.href;
              const actionContent = (
                <>
                  {action}
                  <ArrowRight className="h-4 w-4" />
                </>
              );

              return (
                <Card
                  key={channel.key}
                  className="border-[var(--card-border)] bg-[var(--surface)] shadow-none transition-colors hover:bg-[var(--surface-strong)]"
                >
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--surface-strong)] text-[var(--foreground)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-[590] text-[var(--foreground)]">
                      {title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">
                      {description}
                    </p>
                    <Button asChild variant="ghost" className="mt-5 h-9 justify-start px-0 text-[var(--accent)] hover:bg-transparent hover:text-[var(--accent-hover)]">
                      {channel.type === "mail" ? (
                        <a href={href}>{actionContent}</a>
                      ) : (
                        <Link href={href}>{actionContent}</Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-14 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:py-20 lg:px-8">
            <div>
              <Badge
                variant="outline"
                className="rounded-full border-[var(--card-border)] bg-[var(--surface-strong)] px-3 py-1 text-[var(--muted)]"
              >
                {t("response.badge")}
              </Badge>
              <h2 className="mt-5 text-2xl font-[510] leading-tight text-[var(--foreground)] md:text-3xl">
                {t("response.title")}
              </h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)] md:text-base">
                {t("response.description")}
              </p>
            </div>

            <div className="grid gap-3">
              {responseStepMeta.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.key}
                    className="grid grid-cols-[auto_1fr] gap-4 rounded-xl border border-[var(--card-border)] bg-[var(--surface-strong)] p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--badge-background)] text-[var(--badge-foreground)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs text-[var(--muted)]">
                          0{index + 1}
                        </span>
                        <h3 className="text-base font-[590] text-[var(--foreground)]">
                          {t(`response.steps.${step.key}.title`)}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        {t(`response.steps.${step.key}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-14 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-20 lg:px-8">
          <div>
            <h2 className="text-2xl font-[510] leading-tight text-[var(--foreground)] md:text-3xl">
              {t("preparation.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-base">
              {t("preparation.description")}
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {preparationItems.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                  <span className="text-sm leading-6 text-[var(--foreground)]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-[var(--card-border)] bg-[var(--surface-strong)] shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--surface)] text-[var(--foreground)]">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-[590] text-[var(--foreground)]">{t("targets.title")}</h3>
                  <p className="text-sm text-[var(--muted)]">{t("targets.description")}</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {responseTargetKeys.map((key) => (
                  <div key={key} className="flex items-start justify-between gap-4 border-t border-[var(--line)] pt-4">
                    <span className="text-sm text-[var(--muted)]">{t(`targets.items.${key}.label`)}</span>
                    <span className="text-sm font-[590] text-[var(--foreground)]">{t(`targets.items.${key}.value`)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
