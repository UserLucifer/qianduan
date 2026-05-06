"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import './FAQSection.css';

type FAQCopy = {
  question: string;
  answer: string;
};

export default function FAQSection() {
  const t = useTranslations("MarketingHome.faq");
  const faqs = t.raw("items") as FAQCopy[];

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2>{t("title")}</h2>
          <p>{t("subtitle")}</p>
        </div>
        
        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="faq-accordion"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className="faq-accordion__item"
            >
              <AccordionTrigger className="faq-accordion__trigger">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="faq-accordion__content">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
