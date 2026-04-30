'use client';

import React from 'react';

export const LineArtDiagram: React.FC = () => {
  return (
    <div className="relative aspect-video w-full rounded-2xl border border-border/50 bg-background/50 p-8 flex items-center justify-center overflow-hidden">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(circle_at_center,var(--ui-primary)_1px,transparent_1px)] [background-size:20px_20px]" />
      
      <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-lg">
        {/* Network Core */}
        <div className="h-16 w-40 rounded-xl border-2 border-primary/40 bg-primary/5 flex flex-col items-center justify-center relative shadow-sm group hover:border-primary transition-colors">
          <div className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-1">Compute Core v4</div>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-primary/40" />
            <div className="w-1 h-1 rounded-full bg-primary/40" />
          </div>
          {/* Main Distribution Line */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-px h-12 border-l border-dashed border-primary/30" />
        </div>

        {/* Server Racks */}
        <div className="flex gap-6 items-center justify-center w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative group">
              <div className="h-24 w-16 rounded-lg border border-border bg-muted/20 p-2 flex flex-col gap-1.5 transition-all hover:border-primary/30 hover:bg-muted/30">
                {[1, 2, 3, 4, 5].map(j => (
                  <div key={j} className={`h-1.5 w-full rounded-sm ${j === 3 ? 'bg-primary/20' : 'bg-border'}`} />
                ))}
              </div>
              {/* Branch Connection */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-4 border-l border-dashed border-border" />
            </div>
          ))}
        </div>

        {/* Global Connection Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
           <path d="M 50% 120 C 50% 140, 20% 140, 20% 160 M 50% 120 C 50% 140, 80% 140, 80% 160" stroke="currentColor" fill="none" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>
      
      {/* HUD Info Labels */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1">
        <div className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest">Topology: Mesh-4x</div>
        <div className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest">Latency: 0.8ms</div>
      </div>
      
      <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
    </div>
  );
};
