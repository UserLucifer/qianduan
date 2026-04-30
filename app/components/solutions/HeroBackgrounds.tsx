'use client';

import React from 'react';

interface HeroBackgroundProps {
  type: 'grid' | 'dots' | 'waves';
}

export const HeroBackground: React.FC<HeroBackgroundProps> = ({ type }) => {
  if (type === 'grid') {
    return (
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--ui-foreground)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--ui-foreground)/0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>
    );
  }
  
  if (type === 'dots') {
    return (
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--ui-foreground)/0.1)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>
    );
  }

  if (type === 'waves') {
    return (
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <svg 
          className="absolute top-0 left-0 w-full opacity-[0.04]" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <path 
            fill="currentColor" 
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>
    );
  }

  return null;
};
