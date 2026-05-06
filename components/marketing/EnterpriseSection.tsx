import React from 'react';
import { getTranslations } from "next-intl/server";
import { normalizeLocale } from "@/i18n/locales";
import './EnterpriseSection.css';

type EnterpriseFeatureCopy = {
  title: string;
  description: string;
};

const enterpriseFeatureImages = [
  {
    image: '/images/home/1.webp',
  },
  {
    image: '/images/home/2.webp',
  },
  {
    image: '/images/home/3.webp',
  }
];

export default async function EnterpriseSection({ locale }: { locale?: string }) {
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "MarketingHome.enterprise" });
  const copy = t.raw("items") as EnterpriseFeatureCopy[];
  const enterpriseFeatures = enterpriseFeatureImages.map((item, index) => ({
    ...item,
    ...copy[index],
  }));

  return (
    <section className="enterprise-section">
      <div className="enterprise-container">
        <span className="enterprise-badge">{t("badge")}</span>
        <h2 className="enterprise-title">{t("title")}</h2>
        <p className="enterprise-description">
          {t("subtitle")}
        </p>

        <div className="enterprise-grid">
          {enterpriseFeatures.map((feature, index) => (
            <div key={index} className="enterprise-card">
              <div className="enterprise-card__image-box">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="enterprise-card__image"
                  loading="lazy"
                />
              </div>
              <h3 className="enterprise-card__title">{feature.title}</h3>
              <p className="enterprise-card__desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
