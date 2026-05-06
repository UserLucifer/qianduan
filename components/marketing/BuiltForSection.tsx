'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

/* ── SplitText Component ── */
interface SplitTextProps {
  text: string;
  className?: string;
}

const SplitText: React.FC<SplitTextProps> = ({ text, className }) => {
  const chars = text.split('');
  
  return (
    <span className={`inline-block ${className}`}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: i * 0.03,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

/* ── SpotlightCard Component ── */
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(168, 85, 247, 0.08), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.08), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

/* ── BuiltForSection Component ── */
interface BuiltForSectionProps {
  title: string;
  items: string[];
}

export const BuiltForSection: React.FC<BuiltForSectionProps> = ({ title, items }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1 max-w-2xl mx-auto";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count === 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    if (count === 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <section ref={containerRef} className="uc-built-optimized">
      <div className="uc-built-header-optimized">
        <h2 className="text-center">
          <SplitText text={title} className="uc-built-title-optimized" />
        </h2>
      </div>

      <div className={`grid gap-5 ${getGridClass(items.length)}`}>
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.6,
              delay: 0.1 + index * 0.1,
              ease: [0.21, 0.47, 0.32, 0.98]
            }}
          >
            <SpotlightCard className="uc-built-card-optimized">
              <div className="uc-built-card-content">
                <div className="uc-built-card-icon-wrap">
                  <FiCheckCircle />
                </div>
                <p>{item}</p>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
