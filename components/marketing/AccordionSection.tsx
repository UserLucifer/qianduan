'use client';

import React, { useState } from 'react';
import { useTranslations } from "next-intl";
import './AccordionSection.css';

type EngineCopy = {
  title: string;
  description: string;
};

const engineImages = [
  {
    image: "https://lambda.ai/hubfs/VR200.jpg"
  },
  {
    image: "https://lambda.ai/hubfs/gb300.png"
  },
  {
    image: "https://lambda.ai/hubfs/NVIDIA%20HGX%20B300%20(1).png"
  },
  {
    image: "https://lambda.ai/hubfs/b200.png"
  }
];

const AccordionSection = () => {
  const t = useTranslations("MarketingHome.engines");
  const [activeIndex, setActiveIndex] = useState(0);
  const copy = t.raw("items") as EngineCopy[];
  const engines = engineImages.map((item, index) => ({
    ...item,
    ...copy[index],
  }));

  return (
    <section className="accordion-section">
      <div className="accordion-section__header-container">
        <div className="accordion-section__header">
          <h2 className="accordion-section__title">{t("title")}</h2>
          <p className="accordion-section__description">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="accordion">
        {engines.map((engine, index) => (
          <div
            key={index}
            className={`accordion__item ${activeIndex === index ? 'active' : ''}`}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
          >
            <div className="accordion__image-container">
              <img
                src={engine.image}
                alt={engine.title}
                className="accordion__image"
                loading="lazy"
              />
            </div>
            <div className="accordion__content">
              <h3 className="accordion__item-title">{engine.title}</h3>
              <p className="accordion__item-description">{engine.description}</p>
              <div className="accordion__progress-bar" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AccordionSection;
