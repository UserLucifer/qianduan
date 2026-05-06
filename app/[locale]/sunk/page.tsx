import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBlogPosts } from "@/api/blog";
import type { BlogPostResponse, PageResult } from "@/api/blog";
import { BlogCard } from "@/components/shared/BlogCard";
import {
  HeroVideoFrame,
  TestimonialCarousel,
  type SunkTestimonial,
} from "./SunkInteractive";
import {
  ArrowRight,
  CalendarDays,
  Cpu,
  Eye,
  Gauge,
  LifeBuoy,
  Network,
  RadioTower,
  Repeat2,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { normalizeLocale } from "@/i18n/locales";

export const revalidate = 600;

type SunkPageProps = {
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

type TestimonialCopy = {
  quote: string;
  name: string;
  role: string;
  logoAlt?: string;
  logoText?: string;
};

const emptyBlogPage: PageResult<BlogPostResponse> = {
  records: [],
  total: 0,
  pageNo: 1,
  pageSize: 3,
};

const sunkAssets = {
  heroVideo: "/videos/SUNK/SUNK%20Production-Ready%20AI%20Training%20at%20Massive%20Scale.mp4",
  pattern: "/images/SNK/10002.svg",
  semiLogo: "/images/SNK/10001.png",
  cursorLogo: "/images/SNK/10003.svg",
  dylan: "/images/SNK/69f108d99034a7e0f00b8414_quotee_dylan.jpg",
  brian: "/images/SNK/69a759dff04f5c4150fd41db_headshot_brian-belgodere.png",
  sam: "/images/SNK/69a75a02ab70f0ee6c9f063f_headshot_sam-kottler.png",
};

const productionIcons = [Repeat2, LifeBuoy, Gauge, Eye] as const;
const offeringIcons = [RadioTower, Sparkles, ShieldCheck, CalendarDays] as const;
const infrastructureIcons = [Cpu, RadioTower, Network, ShieldCheck] as const;
const testimonialVisuals = [
  { image: sunkAssets.dylan, logo: sunkAssets.semiLogo },
  { image: sunkAssets.brian },
  { image: sunkAssets.sam, logo: sunkAssets.cursorLogo },
] as const;

export async function generateMetadata({ params }: SunkPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Sunk" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function SunkPage({ params }: SunkPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Sunk" });
  const productionParagraphs = t.raw("production.paragraphs") as string[];
  const productionFeatures = (t.raw("production.features") as FeatureCopy[]).map(
    (feature, index) => ({
      ...feature,
      icon: productionIcons[index] ?? Repeat2,
    }),
  );
  const offeringCards = (t.raw("offerings.cards") as FeatureCopy[]).map((card, index) => ({
    ...card,
    icon: offeringIcons[index] ?? RadioTower,
  }));
  const infrastructureCards = (t.raw("infrastructure.cards") as FeatureCopy[]).map(
    (card, index) => ({
      ...card,
      icon: infrastructureIcons[index] ?? Cpu,
    }),
  );
  const faqItems = t.raw("faqs.items") as FaqCopy[];
  const testimonials = (t.raw("testimonials.items") as TestimonialCopy[]).map((item, index) => ({
    ...item,
    ...(testimonialVisuals[index] ?? testimonialVisuals[0]),
  })) as SunkTestimonial[];

  const postsRes = await getBlogPosts({
    pageNo: 1,
    pageSize: 3,
    publish_status: 1,
    language,
  }).catch(() => ({ data: emptyBlogPage }));
  const latestPosts = postsRes.data ?? emptyBlogPage;

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="min-h-[680px] bg-[#f7f8fa]">
          <div className="mx-auto grid min-h-[680px] max-w-[1320px] items-center gap-14 px-6 py-20 sm:px-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-16">
            <div>
              <h1 className="text-5xl font-semibold leading-[1.03] tracking-[-0.05em] text-[#1f2530] sm:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="mt-8 max-w-[620px] text-xl leading-8 text-[#1f2530] sm:text-2xl sm:leading-10">
                {t("hero.description")}
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  className="h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
                >
                  <Link href="/contact-sales">{t("hero.primaryCta")}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-14 rounded-full border-black bg-transparent px-9 text-base font-semibold text-black hover:bg-black hover:text-white"
                >
                  <Link href="/contact-sales">
                    {t("hero.secondaryCta")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <HeroVideoFrame
              src={sunkAssets.heroVideo}
              ariaLabel={t("hero.videoLabel")}
              playLabel={t("hero.videoPlayLabel")}
              pauseLabel={t("hero.videoPauseLabel")}
              className="aspect-[1.78] rounded-[22px] bg-white"
            />
          </div>
        </section>

        <section className="bg-[#e9edf2] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div className="max-w-[620px]">
              <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {t("production.title")}
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-black/82">
                {productionParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {productionFeatures.map((feature) => {
                const Icon = feature.icon as LucideIcon;

                return (
                  <Card key={feature.title} className="rounded-[20px] border-0 bg-white shadow-none">
                    <CardContent className="grid gap-7 p-8 sm:grid-cols-[42px_1fr] sm:p-10">
                      <Icon className="h-9 w-9 text-[#2f7cff]" aria-hidden="true" />
                      <div>
                        <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                          {feature.title}
                        </h3>
                        <p className="mt-5 text-lg leading-8 text-black/58">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1220px] text-center">
            <h2 className="mx-auto max-w-[820px] text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {t("offerings.title")}
            </h2>
            <p className="mx-auto mt-8 max-w-[850px] text-lg leading-8 text-black/78">
              {t("offerings.description")}
            </p>

            <div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
              {offeringCards.map((card) => {
                const Icon = card.icon as LucideIcon;

                return (
                  <Card key={card.title} className="rounded-[20px] border-0 bg-[#eef1f5] text-left shadow-none">
                    <CardContent className="flex min-h-[360px] flex-col p-9">
                      <Icon className="h-9 w-9 text-[#2f7cff]" aria-hidden="true" />
                      <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {card.title}
                      </h3>
                      <p className="mt-7 text-lg leading-8 text-black/62">{card.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#eef1f5] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1120px] text-center">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {t("testimonials.title")}
            </h2>
            <Link
              href="/blog"
              className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-[#0b45f5] underline underline-offset-4"
            >
              {t("testimonials.cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <TestimonialCarousel
              testimonials={testimonials}
              indicatorLabel={t("testimonials.indicatorLabel")}
            />
          </div>
        </section>

        <section className="bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1180px] text-center">
            <h2 className="mx-auto max-w-[820px] text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {t("infrastructure.title")}
            </h2>
            <p className="mx-auto mt-8 max-w-[980px] text-lg leading-8 text-white/86">
              {t("infrastructure.description")}
            </p>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {infrastructureCards.map((card) => {
                const Icon = card.icon as LucideIcon;

                return (
                  <Card key={card.title} className="rounded-[18px] border-0 bg-[#24272b] text-left text-white shadow-none">
                    <CardContent className="min-h-[300px] p-8">
                      <Icon className="h-9 w-9 text-[#62a1ff]" aria-hidden="true" />
                      <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.03em]">
                        {card.title}
                      </h3>
                      <p className="mt-7 text-lg leading-8 text-white/86">{card.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[780px]">
            <h2 className="text-center text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
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

        <section className="bg-[#eef1f5] px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1220px]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                {t("resources.title")}
              </h2>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-lg font-semibold text-[#0b45f5] underline underline-offset-4"
              >
                {t("resources.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-x-8 gap-y-12 lg:grid-cols-3">
              {latestPosts.records.length > 0 ? (
                latestPosts.records.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))
              ) : (
                <div className="col-span-full rounded-[18px] bg-white p-10 text-center text-black/62">
                  {t("resources.empty")}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:px-10 lg:px-16">
          <div className="relative mx-auto grid max-w-[1180px] overflow-hidden rounded-[18px] bg-[#eef3f8] p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
            <div className="relative z-10">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                {t("bottomCta.title")}
              </h2>
              <p className="mt-8 max-w-[560px] text-lg leading-8 text-black/80">
                {t("bottomCta.description")}
              </p>
              <Button
                asChild
                className="mt-10 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
              >
                <Link href="/contact-sales">{t("bottomCta.cta")}</Link>
              </Button>
            </div>
            <div className="relative z-10 mt-10 lg:mt-0">
              <h3 className="text-3xl font-semibold tracking-[-0.04em]">{t("learnMore.title")}</h3>
              <div className="mt-8 space-y-5">
                <Link href="/docs" className="block font-semibold text-[#0b45f5] underline underline-offset-4">
                  {t("learnMore.docs")}
                </Link>
                <Link href="/contact-sales" className="block font-semibold text-[#0b45f5] underline underline-offset-4">
                  {t("learnMore.pricing")}
                </Link>
              </div>
            </div>
            <Image
              src={sunkAssets.pattern}
              alt=""
              fill
              sizes="100vw"
              className="absolute inset-y-0 right-0 object-cover object-right opacity-80"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
