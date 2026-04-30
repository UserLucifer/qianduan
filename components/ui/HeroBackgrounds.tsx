'use client';

import React from 'react';

interface HeroBackgroundsProps {
  variant: 'ai-training' | 'ai-inference' | 'vfx-rendering' | 'autonomous-driving';
}

const HeroBackgrounds: React.FC<HeroBackgroundsProps> = ({ variant }) => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]">
      {variant === 'ai-training' && (
        <svg className="w-full h-full text-foreground/10" viewBox="0 0 800 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gpu-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 0L37.32 10V30L20 40L2.68 30V10L20 0Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="20" cy="20" r="1.5" fill="currentColor" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gpu-grid)" />
          <path d="M0 100 Q 200 50, 400 100 T 800 100" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <path d="M0 300 Q 200 350, 400 300 T 800 300" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        </svg>
      )}

      {variant === 'ai-inference' && (
        <svg className="w-full h-full text-foreground/10" viewBox="0 0 800 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="flow-line" x="0" y="0" width="20" height="100" patternUnits="userSpaceOnUse">
              <rect x="9.5" y="0" width="1" height="60" fill="currentColor" opacity="0.6" />
              <rect x="9.5" y="70" width="1" height="10" fill="currentColor" opacity="0.3" />
              <rect x="9.5" y="85" width="1" height="5" fill="currentColor" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#flow-line)" />
          <circle cx="400" cy="0" r="300" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.05" />
          <circle cx="400" cy="0" r="200" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          <circle cx="400" cy="0" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        </svg>
      )}

      {variant === 'vfx-rendering' && (
        <svg className="w-full h-full text-foreground/10" viewBox="0 0 800 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="isometric-grid" x="0" y="0" width="60" height="34.6" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 17.3L30 34.6L0 17.3Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M30 0V34.6" fill="none" stroke="currentColor" strokeWidth="0.2" />
              <path d="M0 17.3L60 17.3" fill="none" stroke="currentColor" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#isometric-grid)" />
          <g opacity="0.3">
            <path d="M200 100L300 150L200 200L100 150Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M200 100V150M300 150V200M200 200V250M100 150V200" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M200 150L300 200L200 250L100 200Z" fill="none" stroke="currentColor" strokeWidth="1" />
          </g>
        </svg>
      )}

      {variant === 'autonomous-driving' && (
        <svg className="w-full h-full text-foreground/10" viewBox="0 0 800 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 400 C 100 350, 200 380, 400 300 S 700 250, 900 300" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M-100 350 C 100 300, 200 330, 400 250 S 700 200, 900 250" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.8" />
          <path d="M-100 300 C 100 250, 200 280, 400 200 S 700 150, 900 200" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
          <path d="M-100 250 C 100 200, 200 230, 400 150 S 700 100, 900 150" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <path d="M-100 200 C 100 150, 200 180, 400 100 S 700 50, 900 100" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          
          <circle cx="400" cy="400" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3">
            <animate attributeName="r" from="50" to="400" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.3" to="0" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="400" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3">
            <animate attributeName="r" from="50" to="400" dur="4s" begin="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.3" to="0" dur="4s" begin="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      )}
    </div>
  );
};

export default HeroBackgrounds;
