import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { normalizeLocale } from "@/i18n/locales";
import { Button } from "@/components/ui/button";
import { Cpu, Search, ShieldCheck, Zap, type LucideIcon } from "lucide-react";

type BareMetalServersPageProps = {
  params: Promise<{ locale: string }>;
};

type FeatureCopy = {
  title: string;
  description: string;
};

const bareMetalImages = {
  hero: "/images/%E8%A3%B8%E9%87%91%E5%B1%9E/%E7%AC%AC1.avif",
  stack: "/images/%E8%A3%B8%E9%87%91%E5%B1%9E/%E7%AC%AC2.avif",
  observability: "/images/%E8%A3%B8%E9%87%91%E5%B1%9E/%E7%AC%AC4.avif",
  cta: "/images/%E8%A3%B8%E9%87%91%E5%B1%9E/%E7%AC%AC5.avif",
};

const hypervisorIcons = [Zap, ShieldCheck, Cpu, Search] as const;

export async function generateMetadata({ params }: BareMetalServersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "BareMetalServers" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function BareMetalServersPage({ params }: BareMetalServersPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "BareMetalServers" });
  const performanceParagraphs = t.raw("performance.paragraphs") as string[];
  const hypervisorParagraphs = t.raw("hypervisor.paragraphs") as string[];
  const hypervisorFeatures = (t.raw("hypervisor.features") as FeatureCopy[]).map(
    (feature, index) => ({
      ...feature,
      icon: hypervisorIcons[index] ?? Zap,
    }),
  );
  const observabilityParagraphs = t.raw("observability.paragraphs") as string[];

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="relative isolate flex min-h-[360px] items-center justify-center overflow-hidden bg-[#050505] px-6 py-20 text-center text-white sm:px-10 lg:px-16">
          <Image
            src={bareMetalImages.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 -z-10 bg-black/35" />
          <div className="mx-auto max-w-[860px]">
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto mt-7 max-w-[600px] text-xl leading-8 text-white/86 sm:text-2xl">
              {t("hero.description")}
            </p>
          </div>
        </section>

        <section className="bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
            <div className="max-w-[520px] lg:justify-self-end">
              <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {t("performance.title")}
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-white/88">
                {performanceParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <Button
                asChild
                className="mt-9 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">{t("performance.cta")}</Link>
              </Button>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-[22px] bg-[#111] lg:min-h-[540px]">
              <Image
                src={bareMetalImages.stack}
                alt={t("performance.imageAlt")}
                fill
                sizes="(min-width: 1024px) 760px, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1220px] overflow-hidden border-y border-black/15 text-black lg:grid-cols-[0.86fr_1.14fr]">
            <div className="flex items-start justify-center border-black/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
              <div className="w-full max-w-[520px]">
                <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
                  {t("hypervisor.title")}
                </h2>
                <div className="mt-8 space-y-7 text-lg leading-8 text-black/86">
                  {hypervisorParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {hypervisorFeatures.map((feature) => {
                const Icon = feature.icon as LucideIcon;

                return (
                  <article
                    key={feature.title}
                    className="flex min-h-[150px] items-start gap-6 border-t border-black/15 px-6 py-8 first:border-t-0 lg:px-8"
                  >
                    <Icon className="mt-1 h-8 w-8 shrink-0 text-black/70" aria-hidden="true" />
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                        {feature.title}
                      </h3>
                      <p className="mt-4 max-w-[560px] text-base leading-7 text-black/58">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
            <div className="max-w-[560px]">
              <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
                {t("observability.title")}
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-white/88">
                {observabilityParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="relative aspect-[1.78] overflow-hidden rounded-[24px] bg-[#101113] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
              <Image
                src={bareMetalImages.observability}
                alt={t("observability.imageAlt")}
                fill
                sizes="(min-width: 1024px) 620px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#101010] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28">
          <Image
            src={bareMetalImages.cta}
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-88"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/72 to-black/20" />
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-[520px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                {t("bottomCta.title")}
              </h2>
              <p className="mt-7 text-lg leading-8 text-white/78">
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
      </main>
      <Footer />
    </>
  );
}
