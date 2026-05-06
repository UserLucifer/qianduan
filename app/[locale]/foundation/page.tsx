import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { normalizeLocale } from "@/i18n/locales";
import "./foundation.css";

type FoundationPageProps = {
  params: Promise<{ locale: string }>;
};

type InspireCardCopy = {
  title: string;
  desc: string;
};

const inspireImages = [
  "/images/foundation/1.jpeg",
  "/images/foundation/2.jpeg",
  "/images/foundation/3.jpeg",
  "/images/foundation/4.jpeg",
  "/images/foundation/5.jpeg",
  "/images/foundation/6.jpeg",
  "/images/foundation/7.jpeg",
  "/images/foundation/8.jpeg",
] as const;

export async function generateMetadata({ params }: FoundationPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Foundation" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function FoundationPage({ params }: FoundationPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Foundation" });
  const inspireCards = (t.raw("inspire.cards") as InspireCardCopy[]).map((card, index) => ({
    ...card,
    image: inspireImages[index] ?? inspireImages[0],
  }));

  return (
    <>
      <Header />

      <section className="foundation-hero">
        <div className="foundation-hero__inner">
          <div className="foundation-hero__left">
            <h1 className="foundation-hero__title">{t("hero.title")}</h1>
          </div>
          <div className="foundation-hero__right" />
        </div>
      </section>

      <section className="foundation-intro">
        <div className="shell">
          <h2 className="foundation-intro__title">{t("intro.title")}</h2>
          <p className="foundation-intro__text">{t("intro.text")}</p>
        </div>
      </section>

      <section className="foundation-quote">
        <div className="shell">
          <div className="foundation-quote__inner">
            <p className="foundation-quote__text">
              <span className="foundation-quote__mark foundation-quote__mark--open">&ldquo;</span>
              {t("quote.text")}
              <span className="foundation-quote__mark foundation-quote__mark--close">&rdquo;</span>
            </p>
            <span className="foundation-quote__attribution">
              {t("quote.attribution")}
            </span>
          </div>
        </div>
      </section>

      <section className="foundation-inspire">
        <div className="shell">
          <div className="foundation-inspire__header">
            <h2 className="foundation-inspire__title">{t("inspire.title")}</h2>
            <p className="foundation-inspire__subtitle">
              {t("inspire.subtitle")}
            </p>
          </div>
          <div className="foundation-inspire__grid">
            {inspireCards.map((card) => (
              <div key={card.title} className="inspire-card">
                <div className="inspire-card__image-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="inspire-card__image"
                  />
                </div>
                <h3 className="inspire-card__title">{card.title}</h3>
                <p className="inspire-card__desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
