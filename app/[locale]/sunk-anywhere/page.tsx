import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import SunkCodeBlock from "@/components/marketing/SunkCodeBlock";
import { normalizeLocale } from "@/i18n/locales";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Cloud,
  Gauge,
  Hexagon,
  Layers3,
  Settings2,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

type SunkAnywherePageProps = {
  params: Promise<{ locale: string }>;
};

type FeatureCopy = {
  title: string;
  description: string;
};

type FaqCopy = {
  question: string;
  answer: string;
};

const sunkAnywhereAssets = {
  ring: "/images/SUNK-Anywhere/10001.avif",
  banner: "/images/SUNK-Anywhere/10002.avif",
  xander: "/images/SUNK-Anywhere/69812b5d4cb6bc10c69942f6_quote-image_xander-dunn%402x.avif",
};

const contentShellClass =
  "mx-auto w-[calc(100%-40px)] max-w-[1200px] max-[720px]:w-[calc(100%-24px)]";

const capabilityIcons = [Hexagon, Settings2, Gauge, Sparkles] as const;
const deliverIcons = [Hexagon, Layers3, Workflow] as const;

function CheckIcon() {
  return (
    <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-[#62a1ff] text-[#2f7cff]">
      <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
    </span>
  );
}

function ArchitectureCard({
  title,
  icon,
  productLabel,
  slurmJobsLabel,
  kubernetesPodsLabel,
}: {
  title: string;
  icon: "coreweave" | "cloud";
  productLabel: string;
  slurmJobsLabel: string;
  kubernetesPodsLabel: string;
}) {
  return (
    <div className="rounded-[18px] border border-dashed border-[#0b45f5] bg-[#f7f8fa] p-5 sm:p-6">
      <div className="mb-6 flex h-14 items-center justify-center text-[#2f7cff]">
        {icon === "cloud" ? (
          <Cloud className="h-14 w-14" strokeWidth={2.4} aria-hidden="true" />
        ) : (
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-9 w-9 rounded-[10px] border-[10px] border-[#2f45ee] border-r-transparent" />
            <span className="h-9 w-3 skew-x-[-28deg] rounded-sm bg-black" />
            <span className="h-9 w-3 skew-x-[-28deg] rounded-sm bg-black" />
          </div>
        )}
      </div>
      <div className="rounded-[16px] bg-[#0d39e7] p-5 text-center text-white sm:p-6">
        <h3 className="text-xl font-semibold leading-tight sm:text-2xl">{title}</h3>
        <div className="mx-auto mt-6 max-w-[280px] rounded-[14px] bg-white px-6 py-5 text-left text-black">
          <p className="mb-4 text-center text-2xl font-semibold text-[#2f7cff]">
            {productLabel}
          </p>
          <p className="mt-3 flex items-center gap-3 text-base font-semibold">
            <Box className="h-5 w-5 text-black/58" aria-hidden="true" />
            {slurmJobsLabel}
          </p>
          <p className="mt-4 flex items-center gap-3 text-base font-semibold">
            <Box className="h-5 w-5 text-black/58" aria-hidden="true" />
            {kubernetesPodsLabel}
          </p>
        </div>
        <div className="mx-auto mt-5 max-w-[280px] rounded-[12px] bg-white px-6 py-4 text-left text-base font-semibold text-black">
          <span className="flex items-center gap-3">
            <Box className="h-5 w-5 text-black/58" aria-hidden="true" />
            {kubernetesPodsLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: SunkAnywherePageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "SunkAnywhere" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function SunkAnywherePage({ params }: SunkAnywherePageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "SunkAnywhere" });
  const whyParagraphs = t.raw("why.paragraphs") as string[];
  const whyCards = t.raw("why.cards") as FeatureCopy[];
  const architectureCards = t.raw("architecture.cards") as Array<{
    title: string;
    icon: "coreweave" | "cloud";
  }>;
  const capabilityCards = (t.raw("capabilities.cards") as FeatureCopy[]).map((card, index) => ({
    ...card,
    icon: capabilityIcons[index] ?? Hexagon,
  }));
  const deliverItems = (t.raw("delivery.items") as FeatureCopy[]).map((item, index) => ({
    ...item,
    icon: deliverIcons[index] ?? Hexagon,
  }));
  const faqItems = t.raw("faqs.items") as FaqCopy[];

  return (
    <>
      <Header />
      <main className="bg-white text-black">
        <section className="relative isolate overflow-hidden bg-[#eef1f5] py-20 lg:py-28">
          <Image
            src={sunkAnywhereAssets.ring}
            alt=""
            fill
            priority
            sizes="100vw"
            unoptimized
            className="absolute inset-y-0 right-0 -z-10 h-full w-full object-cover object-right opacity-85"
          />
          <div className={`${contentShellClass} grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]`}>
            <div className="max-w-[620px]">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0b45f5] sm:text-base">
                {t("hero.eyebrow")}
              </p>
              <h1 className="mt-8 text-4xl font-semibold leading-[1.06] text-[#1f2530] sm:text-5xl lg:text-6xl">
                {t("hero.title")}
              </h1>
              <p className="mt-8 max-w-[600px] text-lg leading-8 text-[#1f2530] sm:text-xl sm:leading-9">
                {t("hero.description")}
              </p>
              <Button
                asChild
                className="mt-10 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">{t("hero.cta")}</Link>
              </Button>
            </div>

            <div className="w-full max-w-[620px] min-w-0 justify-self-center lg:justify-self-end">
              <SunkCodeBlock
                codeString={t("code.codeString")}
                copiedLabel={t("code.copiedLabel")}
                copyLabel={t("code.copyLabel")}
              />
            </div>
          </div>
        </section>

        <section className="bg-[#e9edf2] py-20 lg:py-24">
          <div className={`${contentShellClass} grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20`}>
            <div className="max-w-[640px]">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0b45f5] sm:text-base">
                {t("why.eyebrow")}
              </p>
              <h2 className="mt-7 text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">
                {t("why.title")}
              </h2>
              <div className="mt-8 space-y-8 text-lg leading-8 text-black/82">
                {whyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {whyCards.map((item) => (
                <Card key={item.title} className="rounded-[20px] border-0 bg-white shadow-none">
                  <CardContent className="flex gap-7 p-8 sm:p-10">
                    <CheckIcon />
                    <div>
                      <h3 className="text-xl font-semibold leading-tight sm:text-2xl">{item.title}</h3>
                      <p className="mt-6 text-lg leading-8 text-black/58">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className={`${contentShellClass} relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[22px] bg-[#0826b7] px-6 py-14 text-center text-white`}>
            <Image
              src={sunkAnywhereAssets.banner}
              alt=""
              fill
              sizes="(min-width: 1024px) 1320px, 100vw"
              unoptimized
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#0826b7]/50" />
            <div className="relative mx-auto max-w-[760px]">
              <p className="text-sm font-semibold uppercase tracking-wide sm:text-base">
                {t("banner.eyebrow")}
              </p>
              <h2 className="mt-8 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {t("banner.title")}
              </h2>
            </div>
          </div>
        </section>

        <section className="bg-white pb-20 lg:pb-24">
          <div className={`${contentShellClass} text-center`}>
            <h2 className="mx-auto max-w-[860px] text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">
              {t("architecture.title")}
            </h2>
            <p className="mx-auto mt-8 max-w-[980px] text-lg leading-8">
              {t("architecture.description")}
            </p>

            <div className="mt-14 grid gap-10 lg:grid-cols-2">
              {architectureCards.map((card) => (
                <ArchitectureCard
                  key={card.title}
                  title={card.title}
                  icon={card.icon}
                  productLabel={t("architecture.productLabel")}
                  slurmJobsLabel={t("architecture.slurmJobs")}
                  kubernetesPodsLabel={t("architecture.kubernetesPods")}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#eef1f5] py-20 lg:py-24">
          <div className={`${contentShellClass} text-center`}>
            <h2 className="mx-auto max-w-[820px] text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">
              {t("capabilities.title")}
            </h2>
            <p className="mx-auto mt-8 max-w-[780px] text-lg leading-8">
              {t("capabilities.description")}
            </p>

            <div className="mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
              {capabilityCards.map((card) => {
                const Icon = card.icon as LucideIcon;

                return (
                  <Card key={card.title} className="rounded-[20px] border-0 bg-white text-left shadow-none">
                    <CardContent className="flex min-h-[380px] flex-col p-9">
                      <Icon className="h-10 w-10 text-[#2f7cff]" aria-hidden="true" />
                      <h3 className="mt-8 text-xl font-semibold leading-tight sm:text-2xl">{card.title}</h3>
                      <p className="mt-7 text-lg leading-8 text-black/72">{card.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#eef1f5] py-20 lg:py-24">
          <div className={`${contentShellClass} text-center`}>
            <h2 className="mx-auto max-w-[720px] text-3xl font-semibold leading-tight sm:text-4xl">
              {t("testimonial.title")}
            </h2>
            <Link
              href="/blog"
              className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-[#0b45f5] underline underline-offset-4"
            >
              {t("testimonial.cta")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <article className="mt-14 grid overflow-hidden rounded-[18px] bg-white text-left lg:grid-cols-[1.08fr_0.92fr]">
              <div className="flex min-h-[560px] flex-col p-10 sm:p-14">
                <div className="text-[110px] font-semibold leading-none text-[#d9e8ff]">&ldquo;</div>
                <p className="-mt-8 max-w-[640px] text-xl font-medium leading-8 text-black sm:text-2xl sm:leading-9">
                  {t("testimonial.quote")}
                </p>
                <div className="mt-12">
                  <p className="text-xl font-semibold">{t("testimonial.name")}</p>
                  <p className="mt-2 text-base italic text-black/72">
                    {t("testimonial.role")}
                  </p>
                </div>
                <p className="mt-auto pt-10 text-3xl font-light text-black/76">
                  {t("testimonial.company")}
                </p>
              </div>
              <div className="relative min-h-[480px] bg-[#d6e8ff]">
                <Image
                  src={sunkAnywhereAssets.xander}
                  alt={t("testimonial.imageAlt")}
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  unoptimized
                  className="object-cover"
                />
              </div>
            </article>
          </div>
        </section>

        <section className="bg-[#eef1f5] py-20 lg:py-24">
          <div className={`${contentShellClass} grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20`}>
            <div className="flex items-center">
              <div className="max-w-[560px]">
                <p className="text-base font-semibold uppercase text-[#0b45f5]">
                  {t("delivery.eyebrow")}
                </p>
                <h2 className="mt-7 text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">
                  {t("delivery.title")}
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              {deliverItems.map((item) => {
                const Icon = item.icon as LucideIcon;

                return (
                  <Card key={item.title} className="rounded-[20px] border-0 bg-white shadow-none">
                    <CardContent className="flex gap-7 p-8 sm:p-10">
                      <Icon className="mt-1 h-10 w-10 shrink-0 text-[#2f7cff]" aria-hidden="true" />
                      <div>
                        <h3 className="text-xl font-semibold leading-tight sm:text-2xl">{item.title}</h3>
                        <p className="mt-6 text-lg leading-8 text-black/58">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-24">
          <div className={contentShellClass}>
            <h2 className="text-center text-3xl font-semibold sm:text-4xl">
              {t("faqs.title")}
            </h2>
            <div className="mt-12 space-y-6">
              {faqItems.map((item) => (
                <Card key={item.question} className="rounded-[18px] border-0 bg-[#f1f2f5] shadow-none">
                  <CardContent className="p-8 sm:p-10">
                    <div className="flex items-start justify-between gap-8">
                      <div>
                        <h3 className="text-lg font-semibold">{item.question}</h3>
                        <p className="mt-6 text-lg leading-8 text-black/62">{item.answer}</p>
                      </div>
                      <span className="shrink-0 text-3xl font-semibold leading-none text-[#2f45ee]">
                        +
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
