"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getStatusMeta, type StatusTone } from "@/lib/status";

const toneClassName: Record<StatusTone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  warning: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  danger: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  info: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  brand: "border-primary/30 bg-primary/10 text-primary",
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: string | number | boolean | null | undefined;
  label?: string;
  className?: string;
}) {
  const meta = getStatusMeta(status);

  return (
    <Badge
      variant="outline"
      className={cn(
        "whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-none",
        toneClassName[meta.tone],
        className,
      )}
    >
      {label ?? meta.label}
    </Badge>
  );
}
