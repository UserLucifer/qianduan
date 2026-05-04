'use client';

import React, { useState } from 'react';
import './AccordionSection.css';

const engines = [
  {
    title: "NVIDIA VR200 NVL72",
    description: "Rack-scale systems optimized for agentic AI.",
    image: "https://lambda.ai/hubfs/VR200.jpg"
  },
  {
    title: "NVIDIA GB300 NVL72",
    description: "Rack-scale systems optimized for AI inference.",
    image: "https://lambda.ai/hubfs/gb300.png"
  },
  {
    title: "NVIDIA HGX B300",
    description: "Peak performance per watt for maximum training uptime.",
    image: "https://lambda.ai/hubfs/NVIDIA%20HGX%20B300%20(1).png"
  },
  {
    title: "NVIDIA HGX B200",
    description: "Versatile fine-tuning and inference.",
    image: "https://lambda.ai/hubfs/b200.png"
  }
];

const AccordionSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="accordion-section">
      <div className="accordion-section__header-container">
        <div className="accordion-section__header">
          <h2 className="accordion-section__title">The engines of superintelligence</h2>
          <p className="accordion-section__description">
            Experience the next generation of AI infrastructure with our high-performance GPU clusters, designed for the most demanding workloads.
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
