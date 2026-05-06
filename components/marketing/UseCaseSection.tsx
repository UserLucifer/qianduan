import React from 'react';
import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import { FiArrowRight } from 'react-icons/fi';
import { getTranslations } from "next-intl/server";
import { normalizeLocale } from "@/i18n/locales";
import './UseCaseSection.css';

type UseCaseCopy = {
  title: string;
  desc: string;
};

const previewUseCaseMeta = [
  {
    image: '/images/use-cases/use_cases_6.png',
    href: '/use-cases/ai-text-generation'
  },
  {
    image: '/images/use-cases/use_cases_5.webp',
    href: '/use-cases/ai-image-video-generation'
  },
  {
    image: '/images/use-cases/use_cases_7.jpeg',
    href: '/use-cases/ai-agents'
  }
];

export default async function UseCaseSection({ locale }: { locale?: string }) {
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "MarketingHome.useCases" });
  const copy = t.raw("items") as UseCaseCopy[];
  const previewUseCases = previewUseCaseMeta.map((item, index) => ({
    ...item,
    ...copy[index],
  }));

  return (
    <section className="uc-section">
      <div className="uc-container">
        <div className="uc-header">
          <div className="uc-header__copy">
            <h2 className="uc-title">{t("title")}</h2>
            <p className="uc-subtitle">{t("subtitle")}</p>
          </div>
          <Link href="/use-cases" className="uc-all-link">
            {t("viewAll")} <FiArrowRight />
          </Link>
        </div>

        <div className="uc-grid">
          {previewUseCases.map((uc, index) => (
            <Link key={index} href={uc.href} className="uc-preview-card">
              <div className="uc-preview-card__media">
                <Image
                  src={uc.image}
                  alt={uc.title}
                  fill
                  sizes="(max-width: 920px) calc(100vw - 40px), 384px"
                  className="uc-preview-card__image"
                />
              </div>
              <h3 className="uc-preview-card__title">{uc.title}</h3>
              <p className="uc-preview-card__desc">{uc.desc}</p>
              <div className="uc-preview-card__footer">
                <span className="uc-preview-card__link">{t("learnMore")}</span>
                <FiArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
