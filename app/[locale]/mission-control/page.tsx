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
  LifeBuoy,
  LockKeyhole,
  ScanSearch,
  type LucideIcon,
} from "lucide-react";

type MissionControlPageProps = {
  params: Promise<{ locale: string }>;
};

type LayerCardCopy = {
  title: string;
  description: string;
};

type FeatureCopy = {
  title: string;
  description: string;
  cta?: string;
  mediaAlt: string;
};

type FeatureMedia = {
  media: string;
  mediaType: "video" | "image";
  reverse?: boolean;
  id?: string;
};

type FaqCopy = {
  question: string;
  answer: string;
};

const mcBase = "/videos/%E4%BB%BB%E5%8A%A1%E6%8E%A7%E5%88%B6/MC";

const missionAssets = {
  hero: `${mcBase}/1.mp4`,
  security: `${mcBase}/2.mp4`,
  fleet: `${mcBase}/3.mp4`,
  node: `${mcBase}/88.mp4`,
  expert: `${mcBase}/5.mp4`,
  straggler: `${mcBase}/6.mp4`,
  dashboard:
    `${mcBase}/6810f95a9a89796583a40ee0_page-image_observability_more-visibility-fewer-issues-dashboard%402x.avif`,
};

const contentShellClass =
  "mx-auto w-[calc(100%-40px)] max-w-[1200px] max-[720px]:w-[calc(100%-24px)]";

const layerIcons = [LockKeyhole, LifeBuoy, ScanSearch] as const;

const featureMedia: FeatureMedia[] = [
  {
    media: missionAssets.security,
    mediaType: "video",
  },
  {
    id: "fleet-lifecycle-controller",
    media: missionAssets.fleet,
    mediaType: "video",
    reverse: true,
  },
  {
    id: "node-lifecycle-controller",
    media: missionAssets.node,
    mediaType: "video",
  },
  {
    media: missionAssets.expert,
    mediaType: "video",
    reverse: true,
  },
  {
    media: missionAssets.straggler,
    mediaType: "video",
    reverse: true,
  },
  {
    media: missionAssets.dashboard,
    mediaType: "image",
  },
  {
    media: missionAssets.straggler,
    mediaType: "video",
    reverse: true,
  },
];

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

function MissionControlDiagram({
  title,
  cards,
  reliabilityLabel,
  transparencyLabel,
  insightLabel,
  agentLabel,
}: {
  title: string;
  cards: LayerCardCopy[];
  reliabilityLabel: string;
  transparencyLabel: string;
  insightLabel: string;
  agentLabel: string;
}) {
  return (
    <div className="mx-auto mt-14 max-w-[1040px] text-center">
      <div className="text-3xl font-semibold text-black sm:text-4xl">
        {title}
      </div>
      <div className="mt-10 rounded-[30px] border border-black/25 bg-white p-5 shadow-[0_18px_70px_rgba(32,42,70,0.08)] sm:p-8">
        <div className="rounded-[24px] bg-[#1728ee] p-6 text-white sm:p-10">
          <div className="rounded-[20px] border border-dashed border-white/65 bg-[#3f8df6] p-5 sm:p-8">
            <div className="grid gap-5 md:grid-cols-3">
              {cards.map((card, index) => {
                const Icon = layerIcons[index] as LucideIcon;

                return (
                  <article
                    key={card.title}
                    className="rounded-[16px] bg-white px-6 py-7 text-center text-[#080923]"
                  >
                    <Icon className="mx-auto h-9 w-9" aria-hidden="true" />
                    <h3 className="mt-6 text-xl font-semibold">{card.title}</h3>
                    <p className="mt-4 text-base leading-7 text-[#080923]/78">
                      {card.description}
                    </p>
                  </article>
                );
              })}
            </div>
            <p className="mt-8 text-2xl font-semibold">{reliabilityLabel}</p>
          </div>
          <p className="mt-7 text-2xl font-semibold">{transparencyLabel}</p>
          <p className="mt-8 text-2xl font-semibold">{insightLabel}</p>
        </div>
        <p className="mt-7 text-2xl font-semibold">{agentLabel}</p>
      </div>
    </div>
  );
}

function FeatureSection({
  title,
  description,
  cta,
  media,
  mediaType,
  mediaAlt,
  reverse,
  id,
}: FeatureCopy & FeatureMedia) {
  const mediaElement =
    mediaType === "image" ? (
      <Image
        src={media}
        alt={mediaAlt}
        width={1232}
        height={750}
        unoptimized
        className="h-full w-full object-contain"
      />
    ) : (
      <VideoVisual src={media} ariaLabel={mediaAlt} />
    );

  return (
    <section id={id} className="scroll-mt-24 border-t border-black/12 bg-[#f7f8fa] py-16 lg:py-20">
      <div
        className={`${contentShellClass} grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="max-w-[620px]">
          <h2 className="text-3xl font-semibold leading-[1.1] sm:text-4xl">
            {title}
          </h2>
          <p className="mt-7 text-base leading-7 text-black/84 sm:text-lg sm:leading-8">
            {description}
          </p>
          {cta ? (
            <Button
              asChild
              className="mt-9 h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
            >
              <Link href="/contact-sales">{cta}</Link>
            </Button>
          ) : null}
        </div>
        <div className="min-h-[320px] overflow-hidden rounded-[22px] bg-white">
          {mediaElement}
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata({ params }: MissionControlPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "MissionControl" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function MissionControlPage({ params }: MissionControlPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "MissionControl" });
  const layerCards = t.raw("standard.diagram.cards") as LayerCardCopy[];
  const featureCopies = t.raw("features.items") as FeatureCopy[];
  const featureSections = featureCopies.map((feature, index) => ({
    ...feature,
    ...(featureMedia[index] ?? featureMedia[0]),
  }));
  const faqItems = t.raw("faqs.items") as FaqCopy[];

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fa] text-black">
        <section className="bg-[#f7f8fa] py-20 lg:py-28">
          <div className={`${contentShellClass} grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]`}>
            <div className="max-w-[660px]">
              <h1 className="text-4xl font-semibold leading-[1.06] text-[#1f2530] sm:text-5xl lg:text-6xl">
                {t("hero.title")}
              </h1>
              <p className="mt-8 max-w-[620px] text-lg leading-8 text-[#1f2530] sm:text-xl sm:leading-9">
                {t("hero.descriptionPrefix")}
                <strong>{t("hero.descriptionStrong")}</strong>
                {t("hero.descriptionSuffix")}
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
                  className="h-14 rounded-full bg-[#0b45f5] px-9 text-base font-semibold text-white hover:bg-[#2a61ff]"
                >
                  <Link href="#mission-control-standard">{t("hero.secondaryCta")}</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto aspect-[1.58] w-full max-w-[720px] lg:mx-0">
              <VideoVisual src={missionAssets.hero} ariaLabel={t("hero.videoLabel")} />
            </div>
          </div>
        </section>

        <section className="bg-[#050505] py-20 text-center text-white lg:py-24">
          <div className={contentShellClass}>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              {t("intro.title")}
            </h2>
            <p className="mx-auto mt-8 max-w-[920px] text-base leading-7 text-white/86 sm:text-lg sm:leading-8">
              {t("intro.description")}
            </p>
          </div>
        </section>

        <section id="mission-control-standard" className="bg-white py-20 lg:py-24">
          <div className={`${contentShellClass} text-center`}>
            <h2 className="mx-auto max-w-[840px] text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              {t("standard.title")}
            </h2>
            <p className="mx-auto mt-8 max-w-[960px] text-base leading-7 sm:text-lg sm:leading-8">
              {t("standard.descriptionPrefix")}
              <strong>{t("standard.descriptionPrimaryStrong")}</strong>
              {t("standard.descriptionMiddle")}
              <strong>{t("standard.descriptionSecondaryStrong")}</strong>
              {t("standard.descriptionSuffix")}
            </p>
            <MissionControlDiagram
              title={t("standard.diagram.title")}
              cards={layerCards}
              reliabilityLabel={t("standard.diagram.reliability")}
              transparencyLabel={t("standard.diagram.transparency")}
              insightLabel={t("standard.diagram.insight")}
              agentLabel={t("standard.diagram.agent")}
            />
          </div>
        </section>

        {featureSections.slice(0, 4).map((section) => (
          <FeatureSection key={section.title} {...section} />
        ))}

        <section className="border-t border-black/12 bg-[#f7f8fa] py-20 text-center lg:py-24">
          <div className={contentShellClass}>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              {t("visibility.title")}
            </h2>
            <p className="mx-auto mt-8 max-w-[980px] text-base leading-7 sm:text-lg sm:leading-8">
              {t("visibility.description")}
            </p>
          </div>
        </section>

        {featureSections.slice(4).map((section) => (
          <FeatureSection key={section.title} {...section} />
        ))}

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
                        <p className="mt-5 text-base leading-7 text-black/62">{item.answer}</p>
                      </div>
                      <span className="shrink-0 text-2xl font-semibold leading-none text-[#2f45ee]">
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
