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
  Cable,
  ChevronsRight,
  CloudRain,
  Gauge,
  LockKeyhole,
  Maximize2,
  Server,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import DirectConnectMap from "./DirectConnectMap";

type NetworkingServicesPageProps = {
  params: Promise<{ locale: string }>;
};

type FeatureCopy = {
  title: string;
  description: string;
};

const networkingImages = {
  hero: "/images/%E7%BD%91%E7%BB%9C/6764a9d70efb2906a77beb24_hero_networking.avif",
  cta: "/images/%E7%BD%91%E7%BB%9C/%E7%AC%AC5.avif",
};

const infinibandIcons = [Gauge, Maximize2, Zap, Cable, ChevronsRight] as const;
const vpcIcons = [LockKeyhole, Server, Gauge, CloudRain] as const;
const directConnectIcons = [Zap, Sparkles, CloudRain] as const;

function FeatureRows({
  features,
  icons,
}: {
  features: FeatureCopy[];
  icons: readonly LucideIcon[];
}) {
  return (
    <div>
      {features.map((feature, index) => {
        const Icon = icons[index] as LucideIcon;

        return (
          <article
            key={feature.title}
            className="flex min-h-[118px] items-start gap-6 border-t border-white/15 px-6 py-7 first:border-t-0 lg:px-8"
          >
            <Icon className="mt-1 h-8 w-8 shrink-0 text-white/75" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                {feature.title}
              </h3>
              <p className="mt-3 max-w-[560px] text-base leading-7 text-white/55">
                {feature.description}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export async function generateMetadata({ params }: NetworkingServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "NetworkingServices" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function NetworkingServicesPage({ params }: NetworkingServicesPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "NetworkingServices" });
  const infinibandFeatures = t.raw("infiniband.features") as FeatureCopy[];
  const vpcFeatures = t.raw("vpc.features") as FeatureCopy[];
  const directConnectFeatures = t.raw("directConnect.features") as FeatureCopy[];

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="min-h-[660px] bg-[#f7f8fa]">
          <div className="mx-auto grid min-h-[660px] max-w-[1440px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.92fr_1fr] lg:px-16">
            <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#1f2530] sm:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="mt-7 max-w-[560px] text-xl leading-8 text-[#1f2530] sm:text-2xl sm:leading-10">
                {t("hero.description")}
              </p>
            </div>
            <div className="mx-auto aspect-[1.18] w-full max-w-[620px] lg:mx-0">
              <Image
                src={networkingImages.hero}
                alt={t("hero.imageAlt")}
                width={922}
                height={780}
                priority
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#050505] px-5 text-white sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1220px] overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex items-start justify-center border-white/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
              <div className="w-full max-w-[520px]">
                <h2 className="text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl sm:tracking-[-0.04em]">
                  {t("infiniband.title")}
                </h2>
                <div className="mt-8 space-y-6 text-lg leading-8 text-white/88">
                  <p>{t("infiniband.paragraph1")}</p>
                  <p>{t("infiniband.paragraph2")}</p>
                </div>
              </div>
            </div>

            <FeatureRows features={infinibandFeatures} icons={infinibandIcons} />
          </div>
        </section>

        <section className="border-y border-black/15 bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1160px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {t("vpc.title")}
            </h2>
            <div className="mx-auto mt-8 max-w-[900px] space-y-6 text-lg leading-8 text-black/86">
              <p>{t("vpc.paragraph1")}</p>
              <p>{t("vpc.paragraph2")}</p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {vpcFeatures.map((feature, index) => {
                const Icon = vpcIcons[index] as LucideIcon;

                return (
                  <Card
                    key={feature.title}
                    className="min-h-[320px] rounded-[20px] border-[#0b45f5] bg-transparent shadow-none"
                  >
                    <CardContent className="flex h-full flex-col items-center justify-start p-10 text-center">
                      <Icon className="h-9 w-9 text-black/70" aria-hidden="true" />
                      <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {feature.title}
                      </h3>
                      <p className="mt-8 text-lg leading-8 text-black/62">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#050505] px-5 text-white sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1220px] overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border-white/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
              <div className="mx-auto max-w-[580px]">
                <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
                  {t("directConnect.title")}
                </h2>
                <p className="mt-7 text-lg leading-8 text-white/88">
                  {t("directConnect.description")}
                </p>
                <DirectConnectMap />
              </div>
            </div>

            <div>
              {directConnectFeatures.map((feature, index) => {
                const Icon = directConnectIcons[index] as LucideIcon;

                return (
                  <article
                    key={feature.title}
                    className="flex min-h-[190px] items-start gap-6 border-t border-white/15 px-6 py-10 first:border-t-0 lg:px-8 lg:py-12"
                  >
                    <Icon className="mt-1 h-8 w-8 shrink-0 text-white/75" aria-hidden="true" />
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                        {feature.title}
                      </h3>
                      <p className="mt-5 max-w-[560px] text-base leading-7 text-white/55">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-black/15 bg-[#f7f8fa] px-6 py-20 text-center sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[900px]">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {t("multiCloud.title")}
            </h2>
            <p className="mx-auto mt-8 max-w-[760px] text-lg leading-8 text-black/84">
              {t("multiCloud.description")}
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-8 h-14 rounded-full border-[#0b45f5] bg-transparent px-9 text-base font-semibold text-[#0b45f5] hover:bg-[#0b45f5] hover:text-white"
            >
              <Link href="/docs">{t("multiCloud.cta")}</Link>
            </Button>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#101010] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28">
          <Image
            src={networkingImages.cta}
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-88"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/72 to-black/20" />
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-[680px]">
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
