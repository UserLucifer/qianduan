import React from 'react';
import { getTranslations } from "next-intl/server";
import { normalizeLocale } from "@/i18n/locales";
import './WorkloadSection.css';

type WorkloadCopy = {
  title: string;
  number: string;
  subtext: string;
  hoverBullets: string[];
};

export default async function WorkloadSection({ locale }: { locale?: string }) {
  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "MarketingHome.workloads" });
  const workloads = t.raw("items") as WorkloadCopy[];

  return (
    <section className="workload-section">
      <div className="workload-container">
        <div className="workload-header">
          <h2 className="workload-title">{t("title")}</h2>
          <p className="workload-subtitle">{t("subtitle")}</p>
        </div>

        <div className="workload-grid">
          {workloads.map((item, index) => (
            <div key={index} className="workload-card">
              <div className="workload-card-front">
                <div className="workload-front-top">
                  <h3>{item.title}</h3>
                </div>
                <div className="workload-divider"></div>
                <div className="workload-front-bottom">
                  <div className="workload-number">{item.number}</div>
                  <div className="workload-subtext">{item.subtext}</div>
                </div>
              </div>

              <div className="workload-card-hover">
                <ul>
                  {item.hoverBullets.map((bullet, bIndex) => (
                    <li key={bIndex}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
