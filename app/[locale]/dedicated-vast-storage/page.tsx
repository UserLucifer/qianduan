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
  CheckCircle2,
  ChevronRight,
  Layers3,
  Plus,
  Server,
  SlidersHorizontal,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type DedicatedVastStoragePageProps = {
  params: Promise<{ locale: string }>;
};

type MetricCopy = {
  value: string;
  unit: string;
  label: string;
  description: string;
};

type FeatureCopy = {
  title: string;
  description: string;
};

type FaqCopy = {
  question: string;
  answer: string;
};

const vastImages = {
  hero: "/images/%E4%B8%93%E7%94%A8vast%E5%AD%98%E5%82%A8/10002.avif",
  cta: "/images/%E4%B8%93%E7%94%A8vast%E5%AD%98%E5%82%A8/10001.avif",
};

const capabilityIcons = [Layers3, SlidersHorizontal, Server, Sparkles] as const;

export async function generateMetadata({
  params,
}: DedicatedVastStoragePageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "DedicatedVastStorage" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function DedicatedVastStoragePage({
  params,
}: DedicatedVastStoragePageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "DedicatedVastStorage" });
  const metrics = t.raw("metrics.items") as MetricCopy[];
  const capabilities = (t.raw("capabilities.items") as FeatureCopy[]).map((item, index) => ({
    ...item,
    icon: capabilityIcons[index] ?? Layers3,
  }));
  const comparisonParagraphs = t.raw("comparison.paragraphs") as string[];
  const dedicatedReasons = t.raw("comparison.reasons") as FeatureCopy[];
  const faqs = t.raw("faqs.items") as FaqCopy[];

  return (
    <>
      <Header />
      <main className="bg-white text-black">
        <section className="relative isolate overflow-hidden bg-[#0826b7] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28">
          <Image
            src={vastImages.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            unoptimized
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071a86]/85 via-[#092dc5]/28 to-transparent" />

          <div className="mx-auto max-w-[1220px]">
            <div className="max-w-[620px]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6db4ff] sm:text-base">
                {t("hero.eyebrow")}
              </p>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="mt-8 max-w-[620px] text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-10">
                {t("hero.description")}
              </p>
              <p className="mt-8 max-w-[760px] text-base leading-7 text-white/88 sm:text-lg sm:leading-8">
                {t("hero.body")}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  className="h-14 rounded-full bg-[#2c82ff] px-9 text-base font-semibold text-white hover:bg-[#4f99ff]"
                >
                  <Link href="/contact-sales">{t("hero.primaryCta")}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-14 rounded-full border-white/80 bg-transparent px-9 text-base font-semibold text-white hover:bg-white hover:text-[#0826b7]"
                >
                  <Link href="/docs">
                    {t("hero.secondaryCta")}
                    <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-24 rounded-[18px] bg-[#071f9d]/72 p-8 backdrop-blur-sm sm:p-10 lg:p-14">
              <div className="grid gap-10 md:grid-cols-3">
                {metrics.map((metric) => (
                  <article key={metric.label}>
                    <p className="text-5xl font-semibold leading-none tracking-[-0.05em] sm:text-6xl">
                      {metric.value}
                      {metric.unit ? (
                        <span className="ml-1 text-2xl tracking-[-0.03em] sm:text-3xl">
                          {metric.unit}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#77b7ff]">
                      {metric.label}
                    </p>
                    <p className="mt-9 text-base leading-7 text-white">
                      {metric.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1220px] text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0b45f5]">
              {t("capabilities.eyebrow")}
            </p>
            <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {t("capabilities.title")}
            </h2>
            <p className="mx-auto mt-7 max-w-[760px] text-lg leading-8 text-black/72">
              {t("capabilities.description")}
            </p>

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {capabilities.map((item) => {
                const Icon = item.icon as LucideIcon;

                return (
                  <Card
                    key={item.title}
                    className="min-h-[290px] rounded-[18px] border-0 bg-[#f0f2f5] text-left shadow-none"
                  >
                    <CardContent className="p-9">
                      <Icon className="h-9 w-9 text-[#2d7dff]" aria-hidden="true" />
                      <h3 className="mt-10 text-xl font-semibold tracking-[-0.03em]">
                        {item.title}
                      </h3>
                      <p className="mt-8 text-base leading-7 text-black/62">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#e9edf2] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1220px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div className="max-w-[560px]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0b45f5]">
                {t("comparison.eyebrow")}
              </p>
              <h2 className="mt-7 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                {t("comparison.title")}
              </h2>
              <div className="mt-8 space-y-7 text-lg leading-8 text-black/78">
                {comparisonParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {dedicatedReasons.map((reason) => (
                <Card key={reason.title} className="rounded-[18px] border-0 bg-white shadow-none">
                  <CardContent className="flex gap-6 p-8 sm:p-10">
                    <CheckCircle2
                      className="mt-0.5 h-9 w-9 shrink-0 text-[#5b9dff]"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {reason.title}
                      </h3>
                      <p className="mt-7 text-lg leading-8 text-black/58">
                        {reason.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[880px]">
            <h2 className="text-center text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {t("faqs.title")}
            </h2>
            <div className="mt-14 space-y-8">
              {faqs.map((faq) => (
                <Card key={faq.question} className="rounded-[18px] border-0 bg-[#f4f5f7] shadow-none">
                  <CardContent className="flex gap-6 p-8 sm:p-10">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-semibold leading-tight tracking-[-0.03em]">
                        {faq.question}
                      </h3>
                      <p className="mt-7 text-lg leading-8 text-black/58">
                        {faq.answer}
                      </p>
                    </div>
                    <Plus className="mt-0.5 h-6 w-6 shrink-0 text-[#0b45f5]" aria-hidden="true" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 pb-20 sm:px-10 lg:px-16 lg:pb-24">
          <div className="relative isolate mx-auto grid max-w-[1220px] overflow-hidden rounded-[20px] bg-[#f1f3f7] p-8 sm:p-12 lg:grid-cols-[1.08fr_0.92fr] lg:p-14">
            <Image
              src={vastImages.cta}
              alt=""
              fill
              sizes="100vw"
              unoptimized
              className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f1f3f7] via-[#f1f3f7]/92 to-[#f1f3f7]/22" />
            <div className="max-w-[560px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                {t("bottomCta.title")}
              </h2>
              <p className="mt-10 text-lg leading-8 text-black/72">
                {t("bottomCta.description")}
              </p>
              <Button
                asChild
                className="mt-10 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">{t("bottomCta.cta")}</Link>
              </Button>
            </div>
            <div className="mt-12 max-w-[360px] lg:mt-0 lg:justify-self-center">
              <h3 className="text-3xl font-semibold leading-tight tracking-[-0.04em]">
                {t("learnMore.title")}
              </h3>
              <Link
                href="/docs"
                className="mt-8 inline-flex items-center border-b border-[#0b45f5] text-base font-semibold text-[#0b45f5]"
              >
                {t("learnMore.cta")}
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
