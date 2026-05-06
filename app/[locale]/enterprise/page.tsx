import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/marketing/Header";
import Aurora from "@/components/marketing/Aurora";
import Footer from "@/components/marketing/Footer";
import { Link } from "@/i18n/navigation";
import { normalizeLocale } from "@/i18n/locales";
import {
  FiAward,
  FiBarChart2,
  FiCheck,
  FiClock,
  FiCpu,
  FiDatabase,
  FiDollarSign,
  FiGlobe,
  FiHeadphones,
  FiLayers,
  FiLock,
  FiMessageSquare,
  FiServer,
  FiSettings,
  FiShield,
  FiTerminal,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import "./enterprise.css";

type EnterprisePageProps = {
  params: Promise<{ locale: string }>;
};

type CardCopy = {
  title: string;
  desc: string;
};

type StatCopy = {
  value: string;
  label: string;
};

type SectionCopy = {
  eyebrow: string;
  title: string;
  desc: string;
  features: CardCopy[];
};

type CaseStudiesCopy = {
  eyebrow: string;
  title: string;
  stats: StatCopy[];
  quote: string;
  author: string;
};

const navMeta: Array<{
  icon: IconType;
  href: string;
}> = [
  { icon: FiBarChart2, href: "#case-studies" },
  { icon: FiDollarSign, href: "#bulk-pricing" },
  { icon: FiShield, href: "#compliance" },
  { icon: FiLock, href: "#private-networking" },
  { icon: FiHeadphones, href: "#white-glove" },
  { icon: FiSettings, href: "#custom-software" },
];

const sectionIcons = {
  support: [FiLayers, FiUsers, FiClock, FiMessageSquare],
  compliance: [FiServer, FiGlobe, FiShield, FiTerminal],
  pricing: [FiDollarSign, FiCpu, FiBarChart2, FiZap],
  networking: [FiLock, FiGlobe, FiDatabase, FiZap],
} as const;

function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
}: {
  icon: IconType;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="ent-feature">
      <div className={`ent-feature__icon ent-feature__icon--${color}`}>
        <Icon />
      </div>
      <h3 className="ent-feature__title">{title}</h3>
      <p className="ent-feature__text">{desc}</p>
    </div>
  );
}

function FeatureGrid({
  features,
  icons,
  color,
}: {
  features: CardCopy[];
  icons: readonly IconType[];
  color: string;
}) {
  return (
    <div className="ent-features">
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          icon={icons[index] as IconType}
          title={feature.title}
          desc={feature.desc}
          color={color}
        />
      ))}
    </div>
  );
}

export async function generateMetadata({ params }: EnterprisePageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Enterprise" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function EnterprisePage({ params }: EnterprisePageProps) {
  const { locale } = await params;
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "Enterprise" });
  const navCards = t.raw("nav.cards") as CardCopy[];
  const caseStudies = t.raw("caseStudies") as CaseStudiesCopy;
  const support = t.raw("support") as SectionCopy;
  const compliance = t.raw("compliance") as SectionCopy;
  const pricing = t.raw("pricing") as SectionCopy;
  const networking = t.raw("networking") as SectionCopy;
  const customSoftware = t.raw("customSoftware") as Omit<SectionCopy, "features"> & {
    items: string[];
  };

  return (
    <>
      <Header />

      <section className="ent-hero">
        <div className="ent-hero__bg">
          <Aurora
            colorStops={["#5e6ad2", "#a78bfa", "#38bdf8"]}
            blend={0.45}
            amplitude={1.2}
            speed={0.7}
          />
        </div>
        <div className="ent-hero__content">
          <span className="ent-hero__badge">{t("hero.badge")}</span>
          <h1 className="ent-hero__title">
            {t("hero.titleBefore")}
            <em>{t("hero.titleHighlight")}</em>
            {t("hero.titleAfter")}
          </h1>
          <p className="ent-hero__desc">{t("hero.description")}</p>
          <div className="ent-hero__actions">
            <Link href="/contact-sales" className="ent-btn ent-btn--primary">
              {t("hero.primaryCta")}
            </Link>
            <Link href="#custom-software" className="ent-btn ent-btn--ghost">
              {t("hero.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      <nav className="ent-nav" aria-label={t("nav.ariaLabel")}>
        <div className="ent-nav__grid">
          {navCards.map((card, index) => {
            const Icon = navMeta[index].icon;

            return (
              <a key={card.title} href={navMeta[index].href} className="ent-nav__card">
                <h3 className="ent-nav__card-title">
                  <Icon style={{ marginRight: 8, verticalAlign: "-2px" }} />
                  {card.title}
                </h3>
                <p className="ent-nav__card-desc">{card.desc}</p>
              </a>
            );
          })}
        </div>
      </nav>

      <section id="case-studies" className="ent-section">
        <div className="ent-section__inner ent-section__inner--split">
          <div className="ent-section__left">
            <div className="ent-section__header">
              <span className="ent-section__eyebrow ent-section__eyebrow--green">
                {caseStudies.eyebrow}
              </span>
              <h2 className="ent-section__title">{caseStudies.title}</h2>
            </div>

            <div className="ent-stats">
              {caseStudies.stats.map((stat) => (
                <div key={stat.value} className="ent-stat">
                  <div className="ent-stat__value">{stat.value}</div>
                  <p className="ent-stat__label">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="ent-testimonial">
              <blockquote className="ent-testimonial__quote">
                {caseStudies.quote}
              </blockquote>
              <p className="ent-testimonial__author">{caseStudies.author}</p>
            </div>
          </div>

          <div className="ent-section__right">
            <div className="ent-video-wrapper">
              <video
                src="/videos/nv-brochure-2023-08-slide07.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="ent-side-video"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="white-glove" className="ent-section ent-section--alt">
        <div className="ent-section__inner ent-section__inner--split ent-section__inner--reverse">
          <div className="ent-section__left">
            <div className="ent-video-wrapper">
              <video
                src="/videos/nv-brochure-2023-08-slide08.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="ent-side-video"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="ent-section__right">
            <div className="ent-section__header">
              <span className="ent-section__eyebrow ent-section__eyebrow--red">
                {support.eyebrow}
              </span>
              <h2 className="ent-section__title">{support.title}</h2>
              <p className="ent-section__desc">{support.desc}</p>
            </div>

            <FeatureGrid
              features={support.features}
              icons={sectionIcons.support}
              color="red"
            />
          </div>
        </div>
      </section>

      <section id="compliance" className="ent-section">
        <div className="ent-section__inner ent-section__inner--split">
          <div className="ent-section__left">
            <div className="ent-section__header">
              <span className="ent-section__eyebrow ent-section__eyebrow--blue">
                {compliance.eyebrow}
              </span>
              <h2 className="ent-section__title">{compliance.title}</h2>
              <p className="ent-section__desc">{compliance.desc}</p>
            </div>

            <FeatureGrid
              features={compliance.features}
              icons={sectionIcons.compliance}
              color="blue"
            />
          </div>

          <div className="ent-section__right">
            <div className="ent-video-wrapper">
              <video
                src="/videos/nv-brochure-2023-08-slide04.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="ent-side-video"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="bulk-pricing" className="ent-section ent-section--alt">
        <div className="ent-section__inner ent-section__inner--split ent-section__inner--reverse">
          <div className="ent-section__left">
            <div className="ent-video-wrapper">
              <video
                src="/videos/the-engine-of-ai.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="ent-side-video"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="ent-section__right">
            <div className="ent-section__header">
              <span className="ent-section__eyebrow ent-section__eyebrow--amber">
                {pricing.eyebrow}
              </span>
              <h2 className="ent-section__title">{pricing.title}</h2>
              <p className="ent-section__desc">{pricing.desc}</p>
            </div>

            <FeatureGrid
              features={pricing.features}
              icons={sectionIcons.pricing}
              color="amber"
            />
          </div>
        </div>
      </section>

      <section id="private-networking" className="ent-section">
        <div className="ent-section__inner">
          <div className="ent-section__header">
            <span className="ent-section__eyebrow ent-section__eyebrow--violet">
              {networking.eyebrow}
            </span>
            <h2 className="ent-section__title">{networking.title}</h2>
            <p className="ent-section__desc">{networking.desc}</p>
          </div>

          <FeatureGrid
            features={networking.features}
            icons={sectionIcons.networking}
            color="violet"
          />
        </div>
      </section>

      <section id="custom-software" className="ent-section ent-section--alt">
        <div className="ent-section__inner ent-section__inner--split">
          <div className="ent-section__left">
            <div className="ent-section__header">
              <span className="ent-section__eyebrow ent-section__eyebrow--cyan">
                {customSoftware.eyebrow}
              </span>
              <h2 className="ent-section__title">{customSoftware.title}</h2>
              <p className="ent-section__desc">{customSoftware.desc}</p>
            </div>

            <div className="ent-checklist">
              {customSoftware.items.map((item) => (
                <div key={item} className="ent-checklist__item">
                  <span className="ent-checklist__icon">
                    <FiCheck />
                  </span>
                  <span className="ent-checklist__text">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ent-section__right">
            <div className="ent-video-wrapper">
              <video
                src="/videos/nv-brochure-2023-08-slide06.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="ent-side-video"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="ent-cta">
        <div className="ent-cta__inner">
          <FiAward
            style={{ fontSize: 32, color: "var(--accent)", marginBottom: 20 }}
          />
          <h2 className="ent-cta__title">
            {t("bottomCta.titleBefore")}
            <span>{t("bottomCta.titleHighlight")}</span>
          </h2>
          <p className="ent-cta__desc">{t("bottomCta.description")}</p>
          <div className="ent-cta__actions">
            <Link href="#custom-software" className="ent-btn ent-btn--primary">
              {t("bottomCta.primaryCta")}
            </Link>
            <Link href="/contact-sales" className="ent-btn ent-btn--ghost">
              {t("bottomCta.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
