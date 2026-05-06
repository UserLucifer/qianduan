import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { normalizeLocale } from "@/i18n/locales";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Cpu,
  Gauge,
  Network,
  Zap,
  type LucideIcon,
} from "lucide-react";

type CpuComputingPageProps = {
  params: Promise<{ locale: string }>;
};

type ProcessorFamilyCopy = {
  title: string;
  points: string[];
};

type FeatureCopy = {
  title: string;
  description: string;
};

const cpuVisualVideo =
  "/videos/%E5%9F%BA%E7%A1%80%E6%9E%B6%E6%9E%84/%E5%BA%95%E9%83%A8.mp4";

const clusterFeatureIcons = [Zap, Gauge, Network] as const;

function VideoBox({
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
      className={`h-full w-full object-cover ${className}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

export async function generateMetadata({ params }: CpuComputingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "CpuComputing" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function CpuComputingPage({ params }: CpuComputingPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "CpuComputing" });
  const processorFamilies = t.raw("processors.families") as ProcessorFamilyCopy[];
  const clusterFeatures = t.raw("cluster.features") as FeatureCopy[];
  const genAiParagraphs = t.raw("genAi.paragraphs") as string[];

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="min-h-[650px] bg-[#f7f8fa]">
          <div className="mx-auto grid min-h-[650px] max-w-[1440px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.92fr_1fr] lg:px-16">
            <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#1f2530] sm:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="mt-7 max-w-[560px] text-xl leading-8 text-[#1f2530] sm:text-2xl sm:leading-10">
                {t("hero.description")}
              </p>
            </div>
            <div className="mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[24px] bg-white lg:mx-0">
              <VideoBox src={cpuVisualVideo} ariaLabel={t("hero.videoLabel")} />
            </div>
          </div>
        </section>

        <section className="border-y border-black/15 bg-[#f7f8fa]">
          <div className="px-6 py-18 text-center sm:px-10 lg:px-16 lg:py-20">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {t("processors.title")}
            </h2>
            <p className="mx-auto mt-8 max-w-[760px] text-lg leading-8 text-black/82">
              {t("processors.description")}
            </p>
          </div>

          <div className="grid border-t border-black/15 lg:grid-cols-2">
            {processorFamilies.map((family) => (
              <article
                key={family.title}
                className="border-black/15 px-6 py-14 sm:px-10 lg:px-16 lg:py-18 lg:odd:border-r"
              >
                <div className="mx-auto max-w-[520px]">
                  <div className="flex items-center gap-6">
                    <Cpu className="h-9 w-9 text-[#536dfe]" aria-hidden="true" />
                    <h3 className="text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                      {family.title}
                    </h3>
                  </div>

                  <ul className="mt-14 space-y-10">
                    {family.points.map((point) => (
                      <li key={point} className="flex gap-8 text-lg leading-8">
                        <ChevronRight
                          className="mt-1 h-6 w-6 shrink-0 stroke-[3] text-black"
                          aria-hidden="true"
                        />
                        <span className="text-black/88">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1220px] items-center gap-14 lg:grid-cols-[0.88fr_1fr]">
            <div className="max-w-[520px]">
              <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
                {t("cluster.title")}
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-white/88">
                <p>{t("cluster.paragraph1")}</p>
                <p>{t("cluster.paragraph2")}</p>
              </div>
            </div>

            <div className="rounded-[24px] bg-white/[0.09] px-8 py-9 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:px-10 lg:px-12">
              <div className="space-y-10">
                {clusterFeatures.map((feature, index) => {
                  const Icon = clusterFeatureIcons[index] as LucideIcon;

                  return (
                    <article key={feature.title} className="flex items-start gap-8">
                      <Icon className="h-12 w-12 shrink-0 text-white/80" aria-hidden="true" />
                      <div>
                        <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                          {feature.title}
                        </h3>
                        <p className="mt-5 max-w-[520px] text-lg leading-8 text-white/55">
                          {feature.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1180px] items-center gap-16 lg:grid-cols-[0.95fr_1fr] lg:gap-20">
            <div className="aspect-square overflow-hidden rounded-[24px] bg-white">
              <VideoBox src={cpuVisualVideo} ariaLabel={t("genAi.videoLabel")} />
            </div>
            <div className="max-w-[560px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                {t("genAi.title")}
              </h2>
              <div className="mt-7 space-y-6 text-lg leading-8 text-black/88">
                {genAiParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <Button
                asChild
                className="mt-9 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">{t("genAi.cta")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
