import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { normalizeLocale } from "@/i18n/locales";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Gauge,
  Network,
  RadioTower,
  SearchCheck,
  ServerCog,
  ShieldCheck,
  SquareActivity,
  type LucideIcon,
} from "lucide-react";

type ObservabilityPageProps = {
  params: Promise<{ locale: string }>;
};

type FeatureCopy = {
  title: string;
  description: string;
};

type SpecRowCopy = {
  label: string;
  value: string;
};

const obBase = "/videos/%E4%BB%BB%E5%8A%A1%E6%8E%A7%E5%88%B6/OB";

const obAssets = {
  hero: `${obBase}/23.avif`,
  dashboard:
    `${obBase}/6810f95a9a89796583a40ee0_page-image_observability_more-visibility-fewer-issues-dashboard%402x.avif`,
  debugging: `${obBase}/686ebd62cc389d2e83698bcc_Website_-_Dark-p-1600.webp`,
  testimonial:
    `${obBase}/6810fb771671576a60bcdb39_6ddf69138f3189fe3c3336f101041c05_page-image_observability_responsive-and-collaborative_jay-shin%402x.avif`,
  logos: [
    `${obBase}/10002.avif`,
    `${obBase}/10003.avif`,
    `${obBase}/10004.avif`,
    `${obBase}/10005.avif`,
    `${obBase}/10006.avif`,
    `${obBase}/10007.avif`,
    `${obBase}/10008.avif`,
    `${obBase}/10009.avif`,
    `${obBase}/10010.avif`,
    `${obBase}/10011.avif`,
  ],
};

const shellClass =
  "mx-auto w-[calc(100%-40px)] max-w-[1220px] max-[720px]:w-[calc(100%-24px)]";

const insightIcons = [BarChart3, SquareActivity, ServerCog, Network, SearchCheck] as const;
const transparencyIcons = [Gauge, Activity, ShieldCheck] as const;
const resourceIcons = [BarChart3, Gauge, SearchCheck, RadioTower] as const;

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9aa2ff]">
      {children}
    </p>
  );
}

export async function generateMetadata({ params }: ObservabilityPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Observability" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function ObservabilityPage({ params }: ObservabilityPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Observability" });
  const visibilityParagraphs = t.raw("visibility.paragraphs") as string[];
  const insightItems = (t.raw("insights.items") as FeatureCopy[]).map((item, index) => ({
    ...item,
    icon: insightIcons[index] ?? BarChart3,
  }));
  const transparencyCards = (t.raw("transparency.items") as FeatureCopy[]).map((card, index) => ({
    ...card,
    icon: transparencyIcons[index] ?? Gauge,
  }));
  const resourceCards = (t.raw("resources.cards") as FeatureCopy[]).map((card, index) => ({
    ...card,
    icon: resourceIcons[index] ?? BarChart3,
  }));
  const specRows = t.raw("resources.specRows") as SpecRowCopy[];
  const debuggingParagraphs = t.raw("debugging.paragraphs") as string[];

  return (
    <>
      <Header />
      <main className="bg-[#08090a] text-[#f7f8f8]">
        <section className="relative isolate overflow-hidden">
          <Image
            src={obAssets.hero}
            alt={t("hero.imageAlt")}
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#08090a] via-[#08090a]/88 to-[#08090a]/28" />

          <div className={`${shellClass} flex min-h-[590px] items-center py-20 sm:min-h-[640px] lg:min-h-[680px]`}>
            <div className="max-w-[680px]">
              <SectionLabel>{t("hero.eyebrow")}</SectionLabel>
              <h1 className="mt-6 text-5xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="mt-7 max-w-[620px] text-lg leading-8 text-[#d0d6e0] sm:text-xl sm:leading-9">
                {t("hero.description")}
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-[6px] bg-[#5e6ad2] px-7 text-base font-semibold text-white hover:bg-[#828fff]"
                >
                  <Link href="/contact-sales">{t("hero.primaryCta")}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-[6px] border-white/12 bg-white/[0.03] px-7 text-base font-semibold text-[#f7f8f8] hover:bg-white/[0.06] hover:text-white"
                >
                  <Link href="#resources">
                    {t("hero.secondaryCta")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#101113] py-8">
          <div className={`${shellClass} overflow-hidden`}>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8f98]">
              {t("logos.label")}
            </p>
            <div className="mt-7 flex gap-10 overflow-x-auto pb-2 scrollbar-none">
              {obAssets.logos.map((logo) => (
                <Image
                  key={logo}
                  src={logo}
                  alt=""
                  width={180}
                  height={50}
                  className="h-8 w-auto shrink-0 object-contain opacity-75 grayscale"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] py-20 text-black sm:py-24">
          <div className={`${shellClass} grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16`}>
            <div className="max-w-[600px]">
              <h2 className="text-4xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-5xl">
                {t("visibility.title")}
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-black/76">
                {visibilityParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-[12px] bg-[#15171a] shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
              <Image
                src={obAssets.dashboard}
                alt={t("visibility.imageAlt")}
                width={1232}
                height={750}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#08090a] py-20 sm:py-24">
          <div className={`${shellClass} grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16`}>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionLabel>{t("insights.eyebrow")}</SectionLabel>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
                {t("insights.title")}
              </h2>
              <p className="mt-7 max-w-[480px] text-lg leading-8 text-[#d0d6e0]">
                {t("insights.description")}
              </p>
              <Button
                asChild
                className="mt-9 h-12 rounded-[6px] bg-[#5e6ad2] px-7 text-base font-semibold text-white hover:bg-[#828fff]"
              >
                <Link href="/contact-sales">{t("insights.cta")}</Link>
              </Button>
            </div>

            <div className="border-t border-white/10">
              {insightItems.map((item) => {
                const Icon = item.icon as LucideIcon;

                return (
                  <article
                    key={item.title}
                    className="grid gap-5 border-b border-white/10 py-9 sm:grid-cols-[44px_1fr] sm:py-10"
                  >
                    <Icon className="h-8 w-8 text-[#8a8f98]" aria-hidden="true" />
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                        {item.title}
                      </h3>
                      <p className="mt-5 max-w-[620px] text-base leading-7 text-[#8a8f98] sm:text-lg sm:leading-8">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#010102] py-20 sm:py-24">
          <div className={shellClass}>
            <h2 className="text-center text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
              {t("transparency.title")}
            </h2>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {transparencyCards.map((card) => {
                const Icon = card.icon as LucideIcon;

                return (
                  <Card
                    key={card.title}
                    className="min-h-[310px] rounded-[8px] border-white/8 bg-white/[0.04] text-[#f7f8f8] shadow-none"
                  >
                    <CardContent className="flex h-full flex-col items-center p-8 text-center sm:p-10">
                      <Icon className="h-9 w-9 text-[#d0d6e0]" aria-hidden="true" />
                      <h3 className="mt-9 text-2xl font-semibold tracking-[-0.03em]">
                        {card.title}
                      </h3>
                      <p className="mt-7 text-base leading-7 text-[#a4acb6]">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="resources" className="bg-[#f7f8fa] py-20 text-black sm:py-24">
          <div className={`${shellClass} text-center`}>
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
              {t("resources.title")}
            </h2>
            <p className="mx-auto mt-7 max-w-[760px] text-lg leading-8 text-black/72">
              {t("resources.description")}
            </p>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {resourceCards.map((card) => {
                const Icon = card.icon as LucideIcon;

                return (
                  <Card
                    key={card.title}
                    className="min-h-[320px] rounded-[8px] border-[#5e6ad2] bg-transparent shadow-none"
                  >
                    <CardContent className="flex h-full flex-col items-center p-8 text-center">
                      <Icon className="h-9 w-9 text-black/70" aria-hidden="true" />
                      <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {card.title}
                      </h3>
                      <p className="mt-7 text-base leading-7 text-black/62">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-14 overflow-hidden rounded-[8px] border border-black/10 bg-white text-left">
              {specRows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-3 border-b border-black/10 px-6 py-5 last:border-b-0 sm:grid-cols-[180px_1fr] sm:px-8"
                >
                  <div className="text-sm font-semibold text-black/58">{row.label}</div>
                  <div className="text-base leading-7 text-black/80">{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#08090a] py-20 sm:py-24">
          <div className={`${shellClass} grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16`}>
            <div className="max-w-[610px]">
              <SectionLabel>{t("debugging.eyebrow")}</SectionLabel>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
                {t("debugging.title")}
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-[#d0d6e0]">
                {debuggingParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-[12px] border border-white/8 bg-[#15171a]">
              <Image
                src={obAssets.debugging}
                alt={t("debugging.imageAlt")}
                width={1600}
                height={1000}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#010102] py-20 sm:py-24">
          <div className={`${shellClass} grid items-center gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-16`}>
            <div>
              <h2 className="max-w-[520px] text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
                {t("testimonial.title")}
              </h2>
              <p className="mt-7 text-lg italic leading-8 text-[#d0d6e0]">
                {t("testimonial.quote")}
              </p>
              <p className="mt-5 text-base font-semibold text-[#8a8f98]">
                {t("testimonial.author")}
              </p>
            </div>
            <div className="mx-auto aspect-square w-full max-w-[430px] overflow-hidden rounded-full bg-[#191a1b]">
              <Image
                src={obAssets.testimonial}
                alt={t("testimonial.imageAlt")}
                width={800}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden border-t border-white/8 py-20 sm:py-24">
          <Image
            src={obAssets.debugging}
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#08090a] via-[#08090a]/92 to-[#08090a]/68" />
          <div className={shellClass}>
            <div className="max-w-[560px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                {t("bottomCta.title")}
              </h2>
              <p className="mt-7 text-lg leading-8 text-[#d0d6e0]">
                {t("bottomCta.description")}
              </p>
              <Button
                asChild
                className="mt-9 h-12 rounded-[6px] bg-[#5e6ad2] px-7 text-base font-semibold text-white hover:bg-[#828fff]"
              >
                <Link href="/contact-sales">{t("bottomCta.cta")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
