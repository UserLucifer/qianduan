import React from 'react';
import { FiTrendingUp, FiCpu, FiActivity, FiPieChart, FiServer, FiZap } from 'react-icons/fi';
import { getTranslations } from "next-intl/server";
import { normalizeLocale } from "@/i18n/locales";
import './FeatureGrid.css';

type FeatureCopy = {
  title: string;
  description: string;
};

const featureIcons = [
  <FiTrendingUp key="trending" />,
  <FiCpu key="cpu" />,
  <FiActivity key="activity" />,
  <FiPieChart key="pie" />,
  <FiServer key="server" />,
  <FiZap key="zap" />,
];

export default async function FeatureGrid({ locale }: { locale?: string }) {
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "MarketingHome.features" });
  const features = (t.raw("items") as FeatureCopy[]).map((feature, index) => ({
    ...feature,
    icon: featureIcons[index],
  }));

  return (
    <section className="feature-section">
      <div className="feature-container">
        <div className="feature-header">
          <h2 className="feature-title">{t("title")}</h2>
          <p className="feature-subtitle">{t("subtitle")}</p>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
