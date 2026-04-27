"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 lg:grid-cols-12", className)}>
      {children}
    </div>
  );
}

export function BentoCard({
  title,
  description,
  children,
  className,
  contentClassName,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className={className}
    >
      <Card className="h-full overflow-hidden border-gray-100 bg-white shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none dark:backdrop-blur-xl">
        {title ? (
          <CardHeader className="border-b border-gray-50 p-5 dark:border-white/5">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-zinc-100">{title}</CardTitle>
            {description ? <p className="text-xs text-slate-500 dark:text-zinc-500">{description}</p> : null}
          </CardHeader>
        ) : null}
        <CardContent className={cn("p-5", !title && "pt-5", contentClassName)}>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
