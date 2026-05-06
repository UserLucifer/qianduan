import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { normalizeLocale } from "@/i18n/locales";
import "./diversity.css";

type DiversityPageProps = {
  params: Promise<{ locale: string }>;
};

type PillarCopy = {
  title: string;
  description: string;
  quote: string;
  attribution: string;
};

type SupportItemCopy = {
  title: string;
  text: string;
};

type OpportunityCopy = {
  title: string;
  text: string;
  list?: string[];
  quote?: string;
  attribution?: string;
};

const pillarImages = [
  "/images/Inclusivity/2.jpg",
  "/images/Inclusivity/3.jpg",
  "/images/Inclusivity/4.jpg",
] as const;

function OpportunityIcon({ variant }: { variant: "people" | "globe" }) {
  if (variant === "people") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export async function generateMetadata({ params }: DiversityPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "DiversityInclusion" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function DiversityPage({ params }: DiversityPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "DiversityInclusion" });
  const pillars = (t.raw("pillars.items") as PillarCopy[]).map((pillar, index) => ({
    ...pillar,
    image: pillarImages[index] ?? pillarImages[0],
  }));
  const supportItems = t.raw("support.items") as SupportItemCopy[];
  const opportunities = t.raw("opportunities.items") as OpportunityCopy[];

  return (
    <>
      <Header />

      <section className="diversity-hero">
        <div className="diversity-hero__bg" />
        <div className="diversity-hero__overlay" />
        <div className="diversity-hero__content">
          <h1 className="diversity-hero__title">
            {t("hero.title")}
          </h1>
        </div>
      </section>

      <section className="diversity-intro">
        <div className="shell">
          <h2 className="diversity-intro__title">{t("intro.title")}</h2>
          <p className="diversity-intro__text">{t("intro.text")}</p>
        </div>
      </section>

      <section className="diversity-pillars">
        <div className="shell">
          <h2 className="diversity-pillars__title">{t("pillars.title")}</h2>
          <div className="diversity-pillars__grid">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="pillar-card">
                <div className="pillar-card__image-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="pillar-card__image"
                  />
                </div>
                <h3 className="pillar-card__subtitle">{pillar.title}</h3>
                <p className="pillar-card__description">
                  {pillar.description}
                </p>
                <div className="pillar-card__quote-box">
                  <p className="pillar-card__quote">{pillar.quote}</p>
                  <span className="pillar-card__attribution">{pillar.attribution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="diversity-featured">
        <div className="diversity-featured__content">
          <div className="featured-quote">
            <p className="featured-quote__text">
              {t("featured.quote")}
            </p>
            <span className="featured-quote__attribution">{t("featured.attribution")}</span>
          </div>
        </div>
      </section>

      <section className="diversity-support">
        <div className="shell">
          <h2 className="diversity-support__title">{t("support.title")}</h2>
          <div className="diversity-support__grid">
            <div className="diversity-support__left">
              {supportItems.map((item) => (
                <div key={item.title} className="support-item">
                  <h3 className="support-item__title">{item.title}</h3>
                  <p className="support-item__text">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="diversity-support__right">
              <div className="support-quote">
                <p className="support-quote__text">
                  {t("support.quote")}
                </p>
                <span className="support-quote__attribution">{t("support.attribution")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="diversity-opportunities">
        <div className="shell">
          <h2 className="diversity-opportunities__title">{t("opportunities.title")}</h2>
          <div className="diversity-opportunities__grid">
            {opportunities.map((opportunity, index) => (
              <div key={opportunity.title} className="opp-card">
                <div className="opp-card__icon">
                  <OpportunityIcon variant={index === 0 ? "people" : "globe"} />
                </div>
                <h3 className="opp-card__title">{opportunity.title}</h3>
                <p className="opp-card__text">{opportunity.text}</p>
                {opportunity.list ? (
                  <ul className="opp-card__list">
                    {opportunity.list.map((item) => (
                      <li key={item} className="opp-card__list-item">{item}</li>
                    ))}
                  </ul>
                ) : null}
                {opportunity.quote ? (
                  <div className="opp-card__quote">
                    <p className="opp-card__quote-text">
                      {opportunity.quote}
                    </p>
                    <span className="opp-card__attribution">{opportunity.attribution}</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="diversity-commitment">
        <div className="shell">
          <h2 className="diversity-commitment__title">{t("commitment.title")}</h2>
          <p className="diversity-commitment__text">
            {t("commitment.text")}
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
