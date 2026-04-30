'use client';

import React, { useEffect, useState } from 'react';

interface HeroBackgroundsProps {
  variant?: string;
}

/**
 * Premium SVG Backgrounds for AI/GPU Solution Landing Pages.
 * Fixed for SSR Hydration issues by avoiding Math.random() in render.
 */
export const HeroBackgrounds: React.FC<HeroBackgroundsProps> = ({ variant }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mapping logic
  const resolvedVariant = (() => {
    if (!variant) return 'ai-training';
    const v = variant.toLowerCase();
    if (v.includes('training') || v.includes('computing') || v.includes('research')) return 'ai-training';
    if (v.includes('inference') || v.includes('agents') || v.includes('generation') || v.includes('startups')) return 'ai-inference';
    if (v.includes('rendering') || v.includes('gaming')) return 'vfx-rendering';
    if (v.includes('driving')) return 'autonomous-driving';
    return 'ai-training';
  })();

  // SSR Fallback (Simple static grid or nothing to avoid mismatch)
  if (!mounted) {
    return <div className="absolute inset-0 -z-10" />;
  }

  return (
    <div 
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-primary/5"
      data-resolved-variant={resolvedVariant}
    >
      {/* 1. AI Training - Neural Compute Grid */}
      {resolvedVariant === 'ai-training' && (
        <svg className="w-full h-full text-primary/40" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexGrid" x="0" y="0" width="100" height="173.2" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
              <path d="M50 0L100 28.85V86.6L50 115.45L0 86.6V28.85L50 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="0" r="2" fill="currentColor" opacity="0.5" />
              <circle cx="0" cy="28.85" r="1" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexGrid)" />
          <g className="animate-pulse">
            <circle cx="20%" cy="30%" r="150" fill="currentColor" opacity="0.05" filter="blur(80px)" />
            <circle cx="80%" cy="20%" r="200" fill="currentColor" opacity="0.03" filter="blur(100px)" />
          </g>
        </svg>
      )}

      {/* 2. AI Inference - Dynamic Data Flows */}
      {resolvedVariant === 'ai-inference' && (
        <svg className="w-full h-full text-primary/40" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[1, 2, 3, 4, 5].map((i) => (
            <circle 
              key={i}
              cx="50%" cy="-10%" r={i * 200} 
              fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray={`${i * 10} ${i * 20}`}
              className="opacity-20"
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <line 
              key={i}
              x1="-10%" y1={i * 100} x2="110%" y2={i * 100 + ((i * 13) % 50)} 
              stroke="url(#flowGrad)" strokeWidth="1" strokeDasharray="100 400"
            >
              <animate attributeName="stroke-dashoffset" from="500" to="0" dur={`${5 + (i % 5)}s`} repeatCount="indefinite" />
            </line>
          ))}
        </svg>
      )}

      {/* 3. VFX Rendering - Isometric Depth */}
      {resolvedVariant === 'vfx-rendering' && (
        <svg className="w-full h-full text-primary/40" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="isoGrid" x="0" y="0" width="80" height="46.2" patternUnits="userSpaceOnUse">
              <path d="M40 0L80 23.1L40 46.2L0 23.1Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <line x1="40" y1="0" x2="40" y2="46.2" stroke="currentColor" strokeWidth="0.2" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#isoGrid)" />
          <g transform="translate(600, 300) scale(2)" opacity="0.2">
            <path d="M0 -50L43.3 -25V25L0 50L-43.3 25V-25L0 -50" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M0 -50V0M43.3 -25L0 0M-43.3 -25L0 0M0 50V0" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          </g>
          <g transform="translate(300, 150) scale(1.5)" opacity="0.1">
            <path d="M0 -50L43.3 -25V25L0 50L-43.3 25V-25L0 -50" fill="none" stroke="currentColor" strokeWidth="1" />
          </g>
          <g transform="translate(900, 450) scale(1.2)" opacity="0.1">
            <path d="M0 -50L43.3 -25V25L0 50L-43.3 25V-25L0 -50" fill="none" stroke="currentColor" strokeWidth="1" />
          </g>
        </svg>
      )}

      {/* 4. Autonomous Driving - Perception Ripples */}
      {resolvedVariant === 'autonomous-driving' && (
        <svg className="w-full h-full text-primary/40" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="100%" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5">
            <animate attributeName="r" from="100" to="1000" dur="8s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="8s" repeatCount="indefinite" />
          </circle>
          <circle cx="50%" cy="100%" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5">
            <animate attributeName="r" from="100" to="1000" dur="8s" begin="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="8s" begin="4s" repeatCount="indefinite" />
          </circle>
          {[...Array(30)].map((_, i) => (
            <circle 
              key={i}
              cx={`${(i * 17) % 100}%`} 
              cy={`${(i * 31) % 70}%`} 
              r="1.5" 
              fill="currentColor"
            >
              <animate attributeName="opacity" values="0;0.6;0" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <path d="M0 400 Q 300 350, 600 400 T 1200 400" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 10" />
          <path d="M0 500 Q 300 450, 600 500 T 1200 500" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 15" />
        </svg>
      )}
    </div>
  );
};

export default HeroBackgrounds;
