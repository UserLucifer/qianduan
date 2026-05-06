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
  BadgeCheck,
  CircleCheck,
  CircleX,
  Clock3,
  Database,
  DollarSign,
  LockKeyhole,
  Maximize2,
  Network,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";

type AiObjectStoragePageProps = {
  params: Promise<{ locale: string }>;
};

type FeatureCopy = {
  title: string;
  description: string;
};

type StepCopy = {
  title: string;
  description: string;
};

type MigrationPlanCopy = {
  title: string;
  price: string;
};

const storageAssets = {
  hero: "/videos/Ai%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8/hero%E8%A7%86%E9%A2%91.mp4",
  objectStorage:
    "/videos/Ai%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8/CoreWeave%20AI%20Object%20Storage%E6%A8%A1%E5%9D%97%E8%A7%86%E9%A2%91.mp4",
  distributedFile:
    "/videos/Ai%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8/Distributed%20file%20storage%E7%9A%84%E5%9B%BE%E7%89%87.avif",
  localStorage:
    "/videos/Ai%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8/%E5%BA%95%E9%83%A8%E8%A7%86%E9%A2%91.mp4",
  ctaBackground:
    "/videos/Ai%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8/%E5%BA%95%E9%83%A8%E8%83%8C%E6%99%AF%E5%9B%BE.avif",
};

const aiStorageIcons = [Database, Clock3, ShieldCheck, LockKeyhole] as const;
const objectStorageIcons = [Zap, Maximize2, DollarSign, LockKeyhole] as const;
const distributedIcons = [Network, BadgeCheck, Zap] as const;

function VideoVisual({
  src,
  ariaLabel,
  className = "",
}: {
  src: string;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <video
      aria-label={ariaLabel}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className={`h-full w-full object-contain ${className}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function FeatureRows({
  features,
}: {
  features: Array<FeatureCopy & { icon: LucideIcon }>;
}) {
  return (
    <div>
      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <article
            key={feature.title}
            className="flex min-h-[150px] items-start gap-6 border-t border-white/15 px-6 py-8 first:border-t-0 lg:px-10"
          >
            <Icon className="mt-1 h-8 w-8 shrink-0 text-white/72" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                {feature.title}
              </h3>
              <p className="mt-4 max-w-[620px] text-base leading-7 text-white/55">
                {feature.description}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function MigrationCard({
  plan,
  rows,
  feeLabel,
  variant,
}: {
  plan: MigrationPlanCopy;
  rows: string[];
  feeLabel: string;
  variant: "primary" | "legacy";
}) {
  const isPrimary = variant === "primary";

  return (
    <Card
      className={
        isPrimary
          ? "rounded-[24px] border-0 bg-white text-black shadow-none"
          : "rounded-[24px] border-0 bg-[#777687] text-white shadow-none"
      }
    >
      <CardContent className="p-8 sm:p-9">
        <h3 className="text-3xl font-semibold leading-tight tracking-[-0.04em]">
          {plan.title}
        </h3>
        <p className="mt-7 text-lg leading-none">
          <span className={isPrimary ? "text-3xl text-[#0b45f5]" : "text-3xl text-white"}>
            {plan.price}
          </span>
          <span className={isPrimary ? "ml-2 text-sm text-black" : "ml-2 text-sm text-white"}>
            {feeLabel}
          </span>
        </p>
        <ul className="mt-8 space-y-0">
          {rows.map((row, index) => {
            const enabled = isPrimary || index < 3;
            const Icon = enabled ? CircleCheck : CircleX;

            return (
              <li
                key={row}
                className={
                  isPrimary
                    ? "flex items-start gap-4 border-t border-black/12 py-4 first:border-t-0"
                    : "flex items-start gap-4 border-t border-white/18 py-4 first:border-t-0"
                }
              >
                <Icon
                  className={
                    enabled
                      ? "mt-0.5 h-5 w-5 shrink-0 fill-[#0b45f5] text-white"
                      : "mt-0.5 h-5 w-5 shrink-0 fill-white/45 text-white"
                  }
                  aria-hidden="true"
                />
                <span className={isPrimary ? "text-base leading-6 text-black" : "text-base leading-6 text-white"}>
                  {row}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export async function generateMetadata({ params }: AiObjectStoragePageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "AiObjectStorage" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function AiObjectStoragePage({ params }: AiObjectStoragePageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "AiObjectStorage" });
  const workloadParagraphs = t.raw("workloads.paragraphs") as string[];
  const aiStorageFeatures = (t.raw("workloads.features") as FeatureCopy[]).map((feature, index) => ({
    ...feature,
    icon: aiStorageIcons[index] as LucideIcon,
  }));
  const objectStorageSteps = t.raw("objectStorage.steps") as StepCopy[];
  const objectStorageCards = t.raw("objectStorage.cards") as FeatureCopy[];
  const migrationRows = t.raw("migration.rows") as string[];
  const migrationPlans = t.raw("migration.plans") as MigrationPlanCopy[];
  const distributedCards = t.raw("distributed.cards") as FeatureCopy[];
  const localParagraphs = t.raw("localStorage.paragraphs") as string[];
  const featuredParagraphs = t.raw("featured.paragraphs") as string[];

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="min-h-[650px] bg-[#f7f8fa]">
          <div className="mx-auto grid min-h-[650px] max-w-[1440px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.82fr_1fr] lg:px-16">
            <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#1f2530] sm:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="mt-7 max-w-[620px] text-xl leading-8 text-[#1f2530] sm:text-2xl sm:leading-10">
                {t("hero.description")}
              </p>
            </div>
            <div className="mx-auto aspect-[1.45] w-full max-w-[720px] lg:mx-0">
              <VideoVisual src={storageAssets.hero} ariaLabel={t("hero.videoLabel")} />
            </div>
          </div>
        </section>

        <section className="bg-[#050505] px-5 text-white sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1220px] overflow-hidden lg:grid-cols-[0.82fr_1.18fr]">
            <div className="flex items-start justify-center border-white/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
              <div className="w-full max-w-[520px]">
                <h2 className="text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl sm:tracking-[-0.04em]">
                  {t("workloads.title")}
                </h2>
                <div className="mt-8 space-y-6 text-lg leading-8 text-white/88">
                  {workloadParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
            <FeatureRows features={aiStorageFeatures} />
          </div>
        </section>

        <section className="border-y border-black/15 bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1180px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {t("objectStorage.title")}
            </h2>
            <p className="mx-auto mt-7 max-w-[820px] text-lg leading-8 text-black/82">
              {t("objectStorage.description")}
            </p>
            <Button
              asChild
              className="mt-8 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
            >
              <Link href="/contact-sales">{t("objectStorage.cta")}</Link>
            </Button>

            <div className="mt-24 grid items-center gap-14 text-left lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <div className="aspect-[1.05] overflow-hidden border border-black/30 bg-white">
                <VideoVisual
                  src={storageAssets.objectStorage}
                  ariaLabel={t("objectStorage.videoLabel")}
                />
              </div>

              <div className="space-y-16">
                {objectStorageSteps.map((step) => (
                  <article key={step.title} className="flex items-start gap-8">
                    <div className="flex h-28 w-12 shrink-0 items-center justify-center rounded-full border border-black text-black">
                      <CircleCheck className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {step.title}
                      </h3>
                      <p className="mt-6 max-w-[620px] text-lg leading-8 text-black/62">
                        {step.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {objectStorageCards.map((feature, index) => {
                const Icon = objectStorageIcons[index] as LucideIcon;

                return (
                  <Card
                    key={feature.title}
                    className="min-h-[310px] rounded-[18px] border-[#0b45f5] bg-transparent shadow-none"
                  >
                    <CardContent className="flex h-full flex-col items-center p-9 text-center">
                      <Icon className="h-9 w-9 text-black/70" aria-hidden="true" />
                      <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {feature.title}
                      </h3>
                      <p className="mt-8 text-base leading-7 text-black/64">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#eef0f3] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1160px] items-start gap-12 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="max-w-[520px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                {t("migration.title")}
              </h2>
              <p className="mt-8 text-lg leading-8 text-black/84">
                {t("migration.description")}
              </p>
              <Button
                asChild
                className="mt-9 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">{t("migration.cta")}</Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <MigrationCard
                plan={migrationPlans[0]}
                rows={migrationRows}
                feeLabel={t("migration.feeLabel")}
                variant="primary"
              />
              <MigrationCard
                plan={migrationPlans[1]}
                rows={migrationRows}
                feeLabel={t("migration.feeLabel")}
                variant="legacy"
              />
            </div>
          </div>
        </section>

        <section
          id="distributed-file-storage"
          className="scroll-mt-24 bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1220px]">
            <div className="grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <div>
                <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                  {t("distributed.title")}
                </h2>
                <p className="mt-8 max-w-[620px] text-lg leading-8 text-white/82">
                  {t("distributed.description")}
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Button
                    asChild
                    className="h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
                  >
                    <Link href="/benchmarks">{t("distributed.primaryCta")}</Link>
                  </Button>
                  <Button
                    asChild
                    className="h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
                  >
                    <Link href="/contact-sales">{t("distributed.secondaryCta")}</Link>
                  </Button>
                </div>
              </div>

              <div
                role="img"
                aria-label={t("distributed.imageLabel")}
                className="aspect-[1.06] overflow-hidden rounded-[24px] bg-white bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url("${storageAssets.distributedFile}")` }}
              />
            </div>

            <div className="mt-20 grid gap-7 lg:grid-cols-3">
              {distributedCards.map((feature, index) => {
                const Icon = distributedIcons[index] as LucideIcon;

                return (
                  <Card
                    key={feature.title}
                    className="min-h-[360px] rounded-[18px] border-[#0b45f5] bg-transparent text-white shadow-none"
                  >
                    <CardContent className="flex h-full flex-col items-center justify-start p-10 text-center">
                      <Icon className="h-9 w-9 text-white/62" aria-hidden="true" />
                      <h3 className="mt-10 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {feature.title}
                      </h3>
                      <p className="mt-8 text-lg leading-8 text-white/58">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="local-storage"
          className="scroll-mt-24 bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16"
        >
          <div className="mx-auto grid max-w-[1180px] items-center gap-16 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
            <div className="max-w-[580px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                {t("localStorage.title")}
              </h2>
              <div className="mt-8 space-y-7 text-lg leading-8 text-black/88">
                {localParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="aspect-[1.05] overflow-hidden bg-white">
              <VideoVisual src={storageAssets.localStorage} ariaLabel={t("localStorage.videoLabel")} />
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-6 py-14 sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1220px] gap-8 rounded-[22px] bg-black p-8 text-white lg:grid-cols-[0.98fr_1.02fr] lg:p-12">
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-20 w-20 rotate-45 rounded-[18px] border-[18px] border-white" />
                <p className="mt-12 text-6xl font-semibold tracking-[-0.04em]">WEKA</p>
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-8 text-black sm:p-10 lg:p-12">
              <p className="text-lg font-semibold tracking-[0.08em] text-black/58">
                {t("featured.eyebrow")}
              </p>
              <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.04em]">
                {t("featured.title")}
              </h2>
              <p className="mt-2 text-xl font-semibold leading-7">
                {t("featured.subtitle")}
              </p>
              <div className="mt-10 space-y-8 text-lg leading-8 text-black/86">
                {featuredParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#101010] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28">
          <Image
            src={storageAssets.ctaBackground}
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-88"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/74 to-black/20" />
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-[680px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                {t("bottomCta.title")}
              </h2>
              <p className="mt-7 max-w-[620px] text-lg leading-8 text-white/78">
                {t("bottomCta.description")}
              </p>
              <Button
                asChild
                className="mt-9 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">{t("bottomCta.cta")}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-[#34333a] px-6 py-12 text-center text-white/68 sm:px-10">
          <p className="mx-auto max-w-[860px] text-base leading-7">
            {t("footnote")}
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
