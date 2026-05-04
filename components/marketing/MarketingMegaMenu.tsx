'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type MarketingMegaMenuProps = {
  children: ReactNode;
  className?: string;
};

export default function MarketingMegaMenu({
  children,
  className
}: MarketingMegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: '-50%', y: 10 }}
      animate={{ opacity: 1, x: '-50%', y: 0 }}
      exit={{ opacity: 0, x: '-50%', y: 10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'absolute left-1/2 top-full z-[110] mt-2 hidden max-w-[calc(100vw-40px)] overflow-hidden rounded-xl border border-border bg-background shadow-lg md:flex',
        'w-[1000px]',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
