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
  Check,
  Cpu,
  Database,
  Gauge,
  Network,
  Server,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

type GpuComputingPageProps = {
  params: Promise<{ locale: string }>;
};

type FeatureCopy = {
  title: string;
  description: string;
};

type ProductCopy = {
  title: string;
  description: string;
  buttonText?: string;
  features: FeatureCopy[];
};

type QuoteCopy = {
  text: string;
  author: string;
};

const heroVideo =
  "/videos/%E5%9F%BA%E7%A1%80%E6%9E%B6%E6%9E%84/%E7%BB%88%E7%89%88.mp4";
const bottomVideo =
  "/videos/%E5%9F%BA%E7%A1%80%E6%9E%B6%E6%9E%84/%E5%BA%95%E9%83%A8.mp4";

const gb200Icons = [Gauge, Cpu, Network, Sparkles] as const;
const h200Icons = [Gauge, Database, Network, Zap] as const;
const h100Icons = [Gauge, Network, Server] as const;
const l40sIcons = [Gauge, Server, Sparkles] as const;

function VideoBox({
  src,
  className = "",
  ariaLabel,
}: {
  src: string;
  className?: string;
  ariaLabel: string;
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

function DarkFeatureSection({
  product,
  icons,
}: {
  product: ProductCopy;
  icons: readonly LucideIcon[];
}) {
  return (
    <section className="bg-[#050505] px-5 text-white sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1220px] overflow-hidden lg:grid-cols-[0.86fr_1.14fr]">
        <div className="flex items-start justify-center border-white/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
          <div className="w-full max-w-[460px]">
            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
              {product.title}
            </h2>
            <p className="mt-7 max-w-[460px] text-base font-medium leading-7 text-white/90">
              {product.description}
            </p>
            {product.buttonText ? (
              <Button
                asChild
                className="mt-8 h-14 rounded-full bg-[#0b45f5] px-8 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">{product.buttonText}</Link>
              </Button>
            ) : null}
          </div>
        </div>
        <div>
          {product.features.map((feature, index) => {
            const Icon = icons[index] as LucideIcon;

            return (
              <article
                key={feature.title}
                className="flex min-h-[132px] items-start gap-3 border-t border-white/15 px-6 py-8 first:border-t-0 lg:px-8"
              >
                <Icon className="mt-1 h-7 w-7 shrink-0 text-white/70" aria-hidden="true" />
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-[540px] text-base leading-7 text-white/55">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LightFeatureSection({
  product,
  icons,
}: {
  product: ProductCopy;
  icons: readonly LucideIcon[];
}) {
  return (
    <section className="bg-[#f7f8fa] px-5 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1220px] overflow-hidden border-y border-black/15 text-black lg:grid-cols-[0.86fr_1.14fr]">
        <div className="flex items-start justify-center border-black/15 px-6 py-16 lg:border-r lg:px-10 lg:py-20">
          <div className="w-full max-w-[460px]">
            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
              {product.title}
            </h2>
            <p className="mt-7 max-w-[500px] text-base leading-7 text-black/90">
              {product.description}
            </p>
            {product.buttonText ? (
              <Button
                asChild
                className="mt-8 h-14 rounded-full bg-[#0b45f5] px-8 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">{product.buttonText}</Link>
              </Button>
            ) : null}
          </div>
        </div>
        <div>
          {product.features.map((feature, index) => {
            const Icon = icons[index] as LucideIcon;

            return (
              <article
                key={feature.title}
                className="flex min-h-[146px] items-start gap-3 border-t border-black/15 px-6 py-8 first:border-t-0 lg:px-8"
              >
                <Icon className="mt-1 h-7 w-7 shrink-0 text-black/65" aria-hidden="true" />
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-[540px] text-base leading-7 text-black/58">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata({ params }: GpuComputingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "GpuComputing" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function GpuComputingPage({ params }: GpuComputingPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "GpuComputing" });
  const gb200 = t.raw("products.gb200") as ProductCopy;
  const h200 = t.raw("products.h200") as ProductCopy;
  const h100 = t.raw("products.h100") as ProductCopy;
  const l40s = t.raw("products.l40s") as ProductCopy;
  const quote = t.raw("quote") as QuoteCopy;
  const skuParagraphs = t.raw("sku.paragraphs") as string[];
  const acceleratorSkus = t.raw("sku.items") as string[];
  const marketParagraphs = t.raw("market.paragraphs") as string[];
  const fastCards = t.raw("market.cards") as FeatureCopy[];

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="min-h-[680px] bg-[#f7f8fa]">
          <div className="mx-auto grid min-h-[680px] max-w-[1440px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.92fr_1fr] lg:px-16">
            <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#1f2530] sm:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="mt-7 max-w-[560px] text-xl leading-8 text-[#1f2530] sm:text-2xl sm:leading-10">
                {t("hero.description")}
              </p>
            </div>
            <div className="mx-auto aspect-square w-full max-w-[620px] overflow-hidden rounded-[24px] bg-white lg:mx-0">
              <VideoBox src={heroVideo} ariaLabel={t("hero.videoLabel")} />
            </div>
          </div>
        </section>

        <section className="border-y border-black/15 bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1220px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {gb200.title}
            </h2>
            <p className="mx-auto mt-8 max-w-[760px] text-xl leading-8 text-black/82">
              {gb200.description}
            </p>
            {gb200.buttonText ? (
              <Button
                asChild
                className="mt-7 h-16 rounded-full bg-[#0b45f5] px-12 text-lg font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">{gb200.buttonText}</Link>
              </Button>
            ) : null}

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {gb200.features.map((feature, index) => {
                const Icon = gb200Icons[index] as LucideIcon;

                return (
                  <Card
                    key={feature.title}
                    className="min-h-[360px] rounded-[20px] border-[#0b45f5] bg-transparent shadow-none"
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

        <DarkFeatureSection product={h200} icons={h200Icons} />
        <LightFeatureSection product={h100} icons={h100Icons} />
        <DarkFeatureSection product={l40s} icons={l40sIcons} />

        <section className="border-y border-black/15 bg-[#f7f8fa] px-6 py-16 sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[0.9fr_0.8fr]">
            <div className="mx-auto max-w-[620px] lg:mx-0">
              <blockquote className="text-2xl font-semibold leading-snug tracking-[-0.03em] text-black sm:text-3xl">
                {quote.text}
              </blockquote>
              <p className="mt-8 text-lg leading-8 text-black/80">
                {quote.author}
              </p>
            </div>
            <div className="mx-auto aspect-[5/6] w-full max-w-[500px] overflow-hidden rounded-[24px] bg-black">
              <Image
                src="/images/gpu-computing/brannin-mcbee.avif"
                alt="Brannin McBee"
                width={816}
                height={979}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1220px] overflow-hidden border-y border-black/15 lg:grid-cols-2">
            <div className="border-black/15 px-6 py-16 sm:px-10 lg:border-r">
              <div className="mx-auto max-w-[560px]">
                <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                  {t("sku.title")}
                </h2>
                <div className="mt-8 space-y-7 text-lg leading-8 text-black/86">
                  {skuParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-16 sm:px-10">
              <div className="mx-auto max-w-[560px]">
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                  {t("sku.acceleratorsTitle")}
                </h3>
                <ul className="mt-7 list-disc space-y-3 pl-5 text-lg leading-7 text-black/62">
                  {acceleratorSkus.map((sku) => (
                    <li key={sku}>{sku}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1160px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {t("market.title")}
            </h2>
            <div className="mx-auto mt-8 max-w-[900px] space-y-6 text-lg leading-8 text-black/86">
              {marketParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Button
              asChild
              className="mt-7 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
            >
              <Link href="/contact-sales">{t("market.cta")}</Link>
            </Button>

            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {fastCards.map((card) => (
                <Card
                  key={card.title}
                  className="min-h-[320px] rounded-[20px] border-[#0b45f5] bg-transparent shadow-none"
                >
                  <CardContent className="flex h-full flex-col items-center justify-start p-10 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black text-black">
                      <Check className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em]">
                      {card.title}
                    </h3>
                    <p className="mt-7 text-lg leading-8 text-black/65">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fa] px-6 pb-20 sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1180px] items-center gap-16 lg:grid-cols-[0.95fr_1fr] lg:gap-20">
            <div className="aspect-square overflow-hidden rounded-[24px] bg-white">
              <VideoBox src={bottomVideo} ariaLabel={t("bottomCta.videoLabel")} />
            </div>
            <div className="max-w-[520px]">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                {t("bottomCta.title")}
              </h2>
              <p className="mt-7 text-lg leading-8 text-black/88">
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
