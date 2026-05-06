import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { normalizeLocale } from "@/i18n/locales";
import "./sustainability.css";

type SustainabilityPageProps = {
  params: Promise<{ locale: string }>;
};

type StatCopy = {
  value: string;
  subtitle: string;
  description: string;
};

type SocialCardCopy = {
  title: string;
  href: string;
  link: string;
};

export async function generateMetadata({ params }: SustainabilityPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Sustainability" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function SustainabilityPage({ params }: SustainabilityPageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Sustainability" });
  const stats = t.raw("stats.items") as StatCopy[];
  const socialCards = t.raw("social.cards") as SocialCardCopy[];

  return (
    <>
      <Header />

      <section className="sustainability-hero">
        <div className="sustainability-hero__bg" />
        <div className="sustainability-hero__overlay" />
        <div className="sustainability-hero__content">
          <h1 className="sustainability-hero__title">{t("hero.title")}</h1>
          <p className="sustainability-hero__text">
            {t("hero.text")}
          </p>
        </div>
      </section>

      <section className="sustainability-stats">
        <div className="shell">
          <h2 className="sustainability-stats__title">{t("stats.title")}</h2>
          <div className="sustainability-stats__grid">
            {stats.map((stat) => (
              <div key={stat.subtitle} className="stat-item">
                <div className="stat-item__value">{stat.value}</div>
                <div className="stat-item__subtitle">{stat.subtitle}</div>
                <div className="stat-item__description">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sustainability-target">
        <div className="shell">
          <div className="sustainability-target__layout">
            <div className="sustainability-target__content">
              <h2 className="sustainability-target__title">{t("target.title")}</h2>
              <p className="sustainability-target__text">
                {t("target.text")}
              </p>
            </div>
            <div className="sustainability-target__image-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/renewable-energy-progress.svg"
                alt={t("target.imageAlt")}
                className="sustainability-target__image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="sustainability-social">
        <div className="shell">
          <h2 className="sustainability-social__title">{t("social.title")}</h2>
          <div className="sustainability-social__grid">
            {socialCards.map((card) => (
              <div key={card.href} className="social-card">
                <h3 className="social-card__title">{card.title}</h3>
                <Link href={card.href} className="social-card__link">{card.link}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sustainability-careers">
        <div className="shell">
          <div className="sustainability-careers__layout">
            <div className="sustainability-careers__content">
              <h2 className="sustainability-careers__title">{t("careers.title")}</h2>
              <p className="sustainability-careers__text">
                {t("careers.text")}
              </p>
            </div>
            <div className="sustainability-careers__image-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/glassdoors-best-places-to-work-2025-logo-regular.svg"
                alt={t("careers.imageAlt")}
                className="sustainability-careers__image"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
