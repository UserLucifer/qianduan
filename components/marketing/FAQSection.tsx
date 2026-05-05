"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import './FAQSection.css';

const faqs = [
  {
    question: "What types of GPUs are available for rental?",
    answer: "We offer a wide range of high-performance GPUs, including NVIDIA H100, A100, and RTX 4090, tailored for various AI training and inference workloads."
  },
  {
    question: "How does the pricing model work?",
    answer: "Our pricing is transparent and based on a pay-as-you-go model. You are billed per hour of usage, with no hidden fees. We also offer discounted rates for long-term commitments."
  },
  {
    question: "Is there a minimum rental period?",
    answer: "No, there is no minimum rental period. You can spin up an instance for as little as one hour, making it perfect for both short experiments and long-running production workloads."
  },
  {
    question: "What level of technical support is provided?",
    answer: "We provide 24/7 technical support for all our infrastructure. Our team of experts is available via chat and email to help you troubleshoot issues and optimize your deployments."
  },
  {
    question: "Can I scale my compute resources dynamically?",
    answer: "Yes, our platform is designed for dynamic scaling. You can easily add or remove GPU nodes via our API or dashboard to match your workload demands in real-time."
  }
];

export default function FAQSection() {
  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about our product and billing.</p>
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
