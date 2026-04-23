"use client";

import React, { useRef, useState, useEffect } from 'react';
import { SiOpenai } from 'react-icons/si';
import './TestimonialSection.css';

const testimonials = [
  {
    id: 1,
    logoText: 'Jane Street',
    logoIcon: null,
    quote: "CoreWeave's ability to deliver reliable, cutting-edge hardware has consistently met the demands of our critical workloads. We also value their flexibility in tailoring solutions to our unique requirements, enabling us to optimize performance and meet the demands of a rapidly evolving landscape.",
    author: "Craig Falls",
    title: "Head of Quant Research",
    company: "Jane Street"
  },
  {
    id: 2,
    logoText: 'OpenAI',
    logoIcon: <SiOpenai className="text-xl" />,
    quote: "CoreWeave has been one of our earliest and largest compute partners. CoreWeave has helped us build really large-scale computing clusters that led to the creation of some of the models that we’re best known for and helped us deliver these systems to customers at the scale that they need.",
    author: "Sam Altman",
    title: "CEO",
    company: "OpenAI"
  },
  {
    id: 3,
    logoText: 'Mistral AI',
    logoIcon: null,
    quote: "We worked hand-in-hand with CoreWeave's team to build the infrastructure side. The performance of our CoreWeave clusters has been top tier in terms of reliability and stability as we continue to deliver cutting edge models.",
    author: "Arthur Mensch",
    title: "Founder & CEO",
    company: "Mistral AI"
  },
  {
    id: 4,
    logoText: 'Scale AI',
    logoIcon: null,
    quote: "Our partnership with CoreWeave has significantly accelerated our model training cycles. Their API-first infrastructure is robust and highly scalable, exactly what we need for modern AI workflows.",
    author: "Alexandr Wang",
    title: "CEO",
    company: "Scale AI"
  },
  {
    id: 5,
    logoText: 'Hugging Face',
    logoIcon: null,
    quote: "CoreWeave provides the high-performance GPU instances required to deploy our massive open-source models efficiently. The stability of their network ensures our models are always available to the community.",
    author: "Clem Delangue",
    title: "CEO",
    company: "Hugging Face"
  },
  {
    id: 6,
    logoText: 'Anthropic',
    logoIcon: null,
    quote: "Building state-of-the-art Claude models requires massive, uninterrupted compute power. CoreWeave’s infrastructure delivers precisely that, allowing our researchers to focus purely on algorithmic breakthroughs.",
    author: "Dario Amodei",
    title: "CEO",
    company: "Anthropic"
  }
];

const dotColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function TestimonialSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(testimonials.length - 1);

  // Mouse drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollL = scrollRef.current.scrollLeft;
      const slideWidth = scrollRef.current.children[0].clientWidth;
      const index = Math.round(scrollL / slideWidth);
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.children[0].clientWidth;
      scrollRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handlePointerUpOrLeave = () => {
    setIsDragging(false);
  };

  // Calculate the actual maximum index we can scroll to based on viewport
  useEffect(() => {
    const updateMaxIndex = () => {
      if (scrollRef.current) {
        const containerWidth = scrollRef.current.clientWidth;
        const slideWidth = scrollRef.current.children[0].clientWidth;
        const visibleSlides = Math.round(containerWidth / slideWidth);
        setMaxIndex(Math.max(0, testimonials.length - visibleSlides));
      }
    };
    
    updateMaxIndex();
    window.addEventListener('resize', updateMaxIndex);
    return () => window.removeEventListener('resize', updateMaxIndex);
  }, []);

  const dotsCount = maxIndex + 1;

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <h2 className="testimonial-header">Leading AI innovators rely on CoreWeave</h2>
        
        <div className="testimonial-carousel-wrapper">
          <div 
            className={`testimonial-track ${isDragging ? 'dragging' : ''}`}
            ref={scrollRef}
            onScroll={handleScroll}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUpOrLeave}
            onPointerLeave={handlePointerUpOrLeave}
          >
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-slide">
                <div className="testimonial-content-wrapper">
                  <div className="testimonial-logo">
                    {t.logoIcon && <span className="logo-icon">{t.logoIcon}</span>}
                    <span className="logo-text">{t.logoText}</span>
                  </div>
                  
                  <div className="testimonial-quote">
                    &quot;{t.quote}&quot;
                  </div>
                  
                  <div className="testimonial-author">
                    {t.author}, <span className="author-title">{t.title}</span>, <span className="author-company">{t.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonial-pagination">
          {Array.from({ length: dotsCount }).map((_, i) => (
            <button
              key={i}
              className={`pagination-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                backgroundColor: i === activeIndex ? dotColors[i % dotColors.length] : undefined
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
