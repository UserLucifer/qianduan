"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatsCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  loading = false,
  status,
  className,
}: {
  title: string;
  value: ReactNode;
  description?: string;
  trend?: string;
  icon?: LucideIcon;
  loading?: boolean;
  status?: "good" | "warn" | "bad" | "neutral";
  className?: string;
}) {
  const statusClassName =
    status === "good"
      ? "text-emerald-300"
      : status === "warn"
        ? "text-amber-300"
        : status === "bad"
          ? "text-rose-300"
          : "text-zinc-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={className}
    >

      <Card className="group h-full border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5e6ad2]/50 dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none dark:backdrop-blur-xl dark:hover:border-[#9aa2ff]/50">
        <CardContent className="p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">{title}</p>
              {loading ? (
                <Skeleton className="mt-3 h-8 w-28" />
              ) : (
                <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                  {value}
                </div>
              )}
            </div>
            {Icon ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-slate-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-500">
                <Icon className="h-4 w-4" />
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-xs text-slate-500 dark:text-zinc-500">{description}</p>
            {trend ? (
              <span className={cn("shrink-0 text-xs font-medium", statusClassName)}>
                {trend}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
