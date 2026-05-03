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
      ? "text-emerald-500"
      : status === "warn"
        ? "text-amber-500"
        : status === "bad"
          ? "text-rose-500"
          : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={className}
    >
      <Card className="group h-full bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50">
        <CardContent className="p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
              {loading ? (
                <Skeleton className="mt-3 h-8 w-28" />
              ) : (
                <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  {value}
                </div>
              )}
            </div>
            {Icon ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                <Icon className="h-4 w-4" />
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-xs text-muted-foreground">{description}</p>
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
