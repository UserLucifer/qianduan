import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { normalizeLocale } from "@/i18n/locales";
import {
  FiType,
  FiImage,
  FiUsers,
  FiDatabase,
  FiMic,
  FiSliders,
  FiMonitor,
  FiCode,
  FiFilm,
  FiZap,
  FiBox,
  FiDollarSign,
  FiLayers,
} from 'react-icons/fi';
import MagicRings from '@/components/marketing/MagicRings';
import './use-cases.css';

import type { Metadata } from 'next';

type UseCasesPageProps = {
  params: Promise<{ locale: string }>;
};

type UseCaseCopy = {
  title: string;
  desc: string;
};

type HighlightCopy = {
  title: string;
  desc: string;
};

const useCaseMeta = [
  {
    slug: 'ai-text-generation',
    icon: FiType,
    video: '/videos/use/vid-useCase-textGeneration.mp4',
  },
  {
    slug: 'ai-image-video-generation',
    icon: FiImage,
    video: '/videos/use/vid-useCase-imageVideoGeneration.mp4',
  },
  {
    slug: 'ai-agents',
    icon: FiUsers,
    video: '/videos/use/vid-useCase-aiAgent.mp4',
  },
  {
    slug: 'batch-data-processing',
    icon: FiDatabase,
    video: '/videos/use/vid-useCase-batchDataProcessing.mp4',
  },
  {
    slug: 'audio-to-text-transcription',
    icon: FiMic,
    video: '/videos/use/vid-useCase-audio2text.mp4',
  },
  {
    slug: 'ai-fine-tuning',
    icon: FiSliders,
    video: '/videos/use/vid-useCase-fineTuning.mp4',
  },
  {
    slug: 'virtual-computing',
    icon: FiMonitor,
    video: '/videos/use/vid-useCase-virtualComputing.mp4',
  },
  {
    slug: 'gpu-programming',
    icon: FiCode,
    video: '/videos/use/vid-useCase-gpuProgramming.mp4',
  },
  {
    slug: '3d-rendering',
    icon: FiFilm,
    video: '/videos/use/vid-useCase-graphicsRendering.mp4',
  },
];

const highlightMeta = [
  {
    icon: FiBox,
  },
  {
    icon: FiZap,
  },
  {
    icon: FiLayers,
  },
  {
    icon: FiDollarSign,
  },
];

export async function generateMetadata({ params }: UseCasesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "UseCases" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function UseCasesPage({ params }: UseCasesPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "UseCases" });
  const useCaseCopy = t.raw("items") as UseCaseCopy[];
  const highlightCopy = t.raw("highlights.items") as HighlightCopy[];
  const useCases = useCaseMeta.map((item, index) => ({ ...item, ...useCaseCopy[index] }));
  const highlights = highlightMeta.map((item, index) => ({ ...item, ...highlightCopy[index] }));

  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section className="uc-hero">
        <div className="uc-hero__inner">
          <span className="uc-hero__badge">{t("hero.badge")}</span>
          <h1 className="uc-hero__title">
            {t("hero.titleLine1")}
            <br />
            <em>{t("hero.titleEm")}</em>
          </h1>
          <p className="uc-hero__desc">
            {t("hero.description")}
          </p>
          <div className="uc-hero__actions">
            <Link href="/rental" className="uc-btn uc-btn--primary">
              {t("hero.primaryCta")}
            </Link>
            <Link href="/pricing" className="uc-btn uc-btn--ghost">
              {t("hero.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Use Case Grid ── */}
      <section className="uc-grid-section">
        <div className="uc-grid-section__inner">
          <div className="uc-grid">
            {useCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <Link key={uc.title} href={`/use-cases/${uc.slug}`} className="uc-card">
                  <div className="uc-card__video-wrap">
                    <video
                      src={uc.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="uc-card__video"
                    />
                    <div className="uc-card__video-overlay" />
                  </div>
                  <div className="uc-card__body">
                    <div className="uc-card__icon">
                      <Icon />
                    </div>
                    <h3 className="uc-card__title">{uc.title}</h3>
                    <p className="uc-card__desc">{uc.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="uc-highlights">
        <div className="uc-highlights__inner">
          <div className="uc-highlights__header">
            <h2 className="uc-highlights__title">
              {t("highlights.title")}
            </h2>
            <p className="uc-highlights__subtitle">
              {t("highlights.subtitle")}
            </p>
          </div>

          <div className="uc-highlights__grid">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.title} className="uc-highlight">
                  <div className="uc-highlight__icon">
                    <Icon />
                  </div>
                  <h3 className="uc-highlight__title">{h.title}</h3>
                  <p className="uc-highlight__desc">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="uc-cta">
        <div className="uc-cta__background">
          <MagicRings
            color="#A855F7"
            colorTwo="#6366F1"
            ringCount={12}
            speed={0.5}
            attenuation={3}
            lineThickness={2}
            baseRadius={0.6}
            radiusStep={0.4}
            scaleRate={0.2}
            opacity={0.35}
            noiseAmount={0.03}
            followMouse={true}
            mouseInfluence={0.1}
            hoverScale={1.1}
          />
        </div>
        <div className="uc-cta__inner">
          <h2 className="uc-cta__title">
            {t("cta.titleLine1")}
            <br />
            {t("cta.titleLine2")}
          </h2>
          <div className="uc-cta__actions">
            <Link href="/rental" className="uc-btn uc-btn--primary">
              {t("cta.primaryCta")}
            </Link>
            <Link href="/contact-sales" className="uc-btn uc-btn--ghost">
              {t("cta.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
