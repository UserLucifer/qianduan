import React from 'react';
import { getTranslations } from "next-intl/server";
import { normalizeLocale } from "@/i18n/locales";
import './HubSection.css';

type HubCardCopy = {
  title: string;
  description: string;
  alt: string;
};

const hubCardImages = [
  {
    image: '/images/home/hub-ml.png',
  },
  {
    image: '/images/home/hub-collaborate.png',
  },
  {
    image: '/images/home/hub-play.png',
  },
  {
    image: '/images/home/hub-portfolio.png',
  }
];

export default async function HubSection({ locale }: { locale?: string }) {
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "MarketingHome.hub" });
  const copy = t.raw("items") as HubCardCopy[];
  const hubCards = hubCardImages.map((item, index) => ({
    ...item,
    ...copy[index],
  }));

  return (
    <section className="hub-section">
      <div className="hub-container">
        <div className="hub-header">
          <div className="hub-title-wrapper">
            <h2 className="hub-title">{t("title")}</h2>
            <span className="hub-badge">{t("badge")}</span>
          </div>
          <p className="hub-subtitle">
            {t("subtitle")}
          </p>
        </div>

        <div className="hub-grid">
          {hubCards.map((card, index) => (
            <div key={index} className="hub-card">
              <div className="hub-card__content">
                <h3 className="hub-card__title">{card.title}</h3>
                <p className="hub-card__description">{card.description}</p>
              </div>
              <div className="hub-card__image-container">
                <img 
                  src={card.image} 
                  alt={card.alt} 
                  className="hub-card__image"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
