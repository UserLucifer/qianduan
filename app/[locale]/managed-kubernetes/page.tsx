import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { normalizeLocale } from "@/i18n/locales";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  CircleCheck,
  Clock3,
  Gauge,
  Maximize2,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";

type ManagedKubernetesPageProps = {
  params: Promise<{ locale: string }>;
};

type FeatureCopy = {
  title: string;
  description: string;
};

const cksAssets = {
  hero: "/videos/%E6%89%98%E7%AE%A1KBs/Kubernetes%20Management%20for%20GenAI%20CKS%20CoreWeave.mp4",
  cta: "/videos/%E6%89%98%E7%AE%A1KBs/10001.avif",
};

const performanceIcons = [Gauge, Maximize2, ShieldCheck] as const;
const solutionIcons = [Zap, Clock3, Activity] as const;

function VideoVisual({ src, ariaLabel }: { src: string; ariaLabel: string }) {
  return (
    <video
      aria-label={ariaLabel}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="h-full w-full object-contain"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function CheckBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-current ${className}`}
      aria-hidden="true"
    >
      <CircleCheck className="h-6 w-6" />
    </span>
  );
}

export async function generateMetadata({
  params,
}: ManagedKubernetesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "ManagedKubernetes" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function ManagedKubernetesPage({ params }: ManagedKubernetesPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "ManagedKubernetes" });
  const generativeCards = t.raw("generative.cards") as FeatureCopy[];
  const performanceRows = (t.raw("performance.features") as FeatureCopy[]).map(
    (feature, index) => ({
      ...feature,
      icon: performanceIcons[index] ?? Gauge,
    }),
  );
  const securityParagraphs = t.raw("security.paragraphs") as string[];
  const securityCards = t.raw("security.cards") as FeatureCopy[];
  const solutionCards = (t.raw("solutions.cards") as FeatureCopy[]).map((card, index) => ({
    ...card,
    icon: solutionIcons[index] ?? Zap,
  }));

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="min-h-[720px] bg-[#f7f8fa]">
          <div className="mx-auto grid min-h-[720px] max-w-[1440px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.88fr_1fr] lg:px-16">
            <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
              <h1 className="text-5xl font-semibold leading-[1.03] tracking-[-0.05em] text-[#1f2530] sm:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="mt-8 max-w-[600px] text-xl leading-8 text-[#1f2530] sm:text-2xl sm:leading-10">
                {t("hero.description")}
              </p>
              <Button
                asChild
                className="mt-10 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">{t("hero.cta")}</Link>
              </Button>
            </div>
            <div className="mx-auto aspect-[1.02] w-full max-w-[620px] overflow-hidden rounded-[22px] bg-white lg:mx-0">
              <VideoVisual src={cksAssets.hero} ariaLabel={t("hero.videoLabel")} />
            </div>
          </div>
        </section>

        <section className="bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1240px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {t("generative.title")}
            </h2>
            <p className="mx-auto mt-7 max-w-[960px] text-lg leading-8 text-white/86">
              {t("generative.description")}
            </p>

            <div className="mt-16 grid gap-7 lg:grid-cols-3">
              {generativeCards.map((card) => (
                <Card
                  key={card.title}
                  className="group min-h-[390px] rounded-[22px] border-0 bg-[#1a1a1a] text-white shadow-none transition-colors duration-300 hover:bg-[#2F45EE]"
                >
                  <CardContent className="flex h-full flex-col items-center justify-start px-8 py-12 text-center">
                    <CheckBadge className="text-white/85 transition-colors duration-300 group-hover:text-white" />
                    <h3 className="mt-10 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                      {card.title}
                    </h3>
                    <p className="mt-8 text-lg leading-8 text-white/58 transition-colors duration-300 group-hover:text-white">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#050505] px-5 text-white sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1220px] overflow-hidden border-t border-white/15 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="flex items-start justify-center border-white/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
              <div className="w-full max-w-[560px]">
                <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
                  {t("performance.title")}
                </h2>
                <p className="mt-8 text-lg leading-8 text-white/88">
                  {t("performance.description")}
                </p>
              </div>
            </div>

            <div>
              {performanceRows.map((feature) => {
                const Icon = feature.icon as LucideIcon;

                return (
                  <article
                    key={feature.title}
                    className="flex min-h-[180px] items-start gap-7 border-t border-white/15 px-6 py-9 first:border-t-0 lg:px-10 lg:py-12"
                  >
                    <Icon className="mt-1 h-9 w-9 shrink-0 text-white/75" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                        {feature.title}
                      </h3>
                      <p className="mt-5 max-w-[640px] text-base leading-7 text-white/55">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1240px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {t("security.title")}
            </h2>
            <div className="mx-auto mt-8 max-w-[1040px] space-y-6 text-lg leading-8 text-black/86">
              {securityParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {securityCards.map((card) => (
                <Card
                  key={card.title}
                  className="group min-h-[420px] overflow-hidden rounded-[22px] border-[#0b45f5] bg-transparent text-black shadow-none transition-colors duration-300 hover:border-[#2F45EE] hover:bg-[#2F45EE] hover:text-white"
                >
                  <CardContent className="flex h-full flex-col items-center p-10 text-center">
                    <CheckBadge className="text-black/82 transition-colors duration-300 group-hover:text-white" />
                    <h3 className="mt-9 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                      {card.title}
                    </h3>
                    <p className="mt-8 text-lg leading-8 text-black/62 transition-colors duration-300 group-hover:text-white">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1240px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {t("solutions.title")}
            </h2>
            <p className="mx-auto mt-7 max-w-[880px] text-lg leading-8 text-white/86">
              {t("solutions.description")}
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-[1220px] gap-10 border-t border-white/15 pt-16 lg:grid-cols-3">
            {solutionCards.map((card) => {
              const Icon = card.icon as LucideIcon;

              return (
                <article key={card.title} className="text-center">
                  <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[8px] border border-[#2f45ee] text-white">
                    <Icon className="h-9 w-9" aria-hidden="true" />
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em]">
                    {card.title}
                  </h3>
                  <p className="mx-auto mt-6 max-w-[360px] text-lg leading-8 text-white/58">
                    {card.description}
                  </p>
                  <Link
                    href="/contact-sales"
                    className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-[#1557ff] underline underline-offset-4 hover:text-[#5d84ff]"
                  >
                    {t("solutions.itemCta")}
                    <span aria-hidden="true">-&gt;</span>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <Image
            src={cksAssets.cta}
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-right opacity-85"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f7f8fa] via-[#f7f8fa]/92 to-[#f7f8fa]/20" />
          <div className="mx-auto max-w-[1220px]">
            <div className="max-w-[520px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#1f2530] sm:text-5xl">
                {t("bottomCta.title")}
              </h2>
              <p className="mt-8 text-xl leading-8 text-[#1f2530]/88">
                {t("bottomCta.description")}
              </p>
              <Button
                asChild
                className="mt-10 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
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
