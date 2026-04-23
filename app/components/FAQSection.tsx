"use client";

import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about our product and billing.</p>
        </div>
        
        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
              >
                <button 
                  className="faq-question" 
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">
                    {isOpen ? <FiMinus /> : <FiPlus />}
                  </span>
                </button>
                <div 
                  className="faq-answer-wrapper"
                  style={{ height: isOpen ? 'auto' : 0, overflow: 'hidden' }}
                >
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
