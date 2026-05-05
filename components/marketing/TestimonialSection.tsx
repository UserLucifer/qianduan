"use client";

import React, { useRef, useState, useEffect } from 'react';
import { SiOpenai } from 'react-icons/si';
import './TestimonialSection.css';

const testimonials = [
  {
    id: 1,
    logoText: 'Jane Street',
    logoIcon: null,
    quote: "CoreWeave 提供可靠、前沿硬件的能力，持续满足了我们关键工作负载的需求。我们同样看重他们能够根据我们的独特需求定制解决方案，帮助我们优化性能，并应对快速变化的市场环境。",
    author: "Craig Falls",
    title: "量化研究负责人",
    company: "Jane Street"
  },
  {
    id: 2,
    logoText: 'OpenAI',
    logoIcon: <SiOpenai className="text-xl" />,
    quote: "CoreWeave 是我们最早、规模最大的算力合作伙伴之一。CoreWeave 帮助我们构建了超大规模计算集群，推动了部分知名模型的诞生，并帮助我们以客户所需的规模交付这些系统。",
    author: "Sam Altman",
    title: "首席执行官",
    company: "OpenAI"
  },
  {
    id: 3,
    logoText: 'Mistral AI',
    logoIcon: null,
    quote: "我们与 CoreWeave 团队紧密协作，共同建设基础设施。随着我们持续交付前沿模型，CoreWeave 集群在可靠性和稳定性方面始终保持一流水准。",
    author: "Arthur Mensch",
    title: "创始人兼首席执行官",
    company: "Mistral AI"
  },
  {
    id: 4,
    logoText: 'Scale AI',
    logoIcon: null,
    quote: "与 CoreWeave 的合作显著加快了我们的模型训练周期。他们以 API 优先的基础设施稳定且高度可扩展，正是现代 AI 工作流所需要的能力。",
    author: "Alexandr Wang",
    title: "首席执行官",
    company: "Scale AI"
  },
  {
    id: 5,
    logoText: 'Hugging Face',
    logoIcon: null,
    quote: "CoreWeave 提供高性能 GPU 实例，让我们能够高效部署大型开源模型。他们稳定的网络确保我们的模型始终能够服务社区。",
    author: "Clem Delangue",
    title: "首席执行官",
    company: "Hugging Face"
  },
  {
    id: 6,
    logoText: 'Anthropic',
    logoIcon: null,
    quote: "构建先进的 Claude 模型需要大规模且不中断的算力。CoreWeave 的基础设施正好提供了这一点，让我们的研究人员能够专注于算法突破。",
    author: "Dario Amodei",
    title: "首席执行官",
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
        <h2 className="testimonial-header">领先的 AI 创新者信赖 CoreWeave</h2>
        
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
              aria-label={`跳转到第 ${i + 1} 张推荐语`}
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
