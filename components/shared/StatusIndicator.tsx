"use client";

import { cn } from "@/lib/utils";
import { getStatusMeta } from "@/lib/status";

export function StatusIndicator({
  status,
  label,
  pulse = false,
}: {
  status: string | number | null | undefined;
  label?: string;
  pulse?: boolean;
}) {
  const meta = getStatusMeta(status);
  const dotClassName =
    meta.tone === "success"
      ? "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.45)]"
      : meta.tone === "warning"
        ? "bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.38)]"
        : meta.tone === "danger"
          ? "bg-rose-400 shadow-[0_0_14px_rgba(251,113,133,0.38)]"
          : meta.tone === "info"
            ? "bg-sky-300 shadow-[0_0_14px_rgba(125,211,252,0.38)]"
            : "bg-zinc-500";


  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--admin-text)]">
      <span className="relative flex h-2 w-2">
        {pulse ? (
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", dotClassName)} />
        ) : null}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", dotClassName)} />
      </span>
      {label ?? meta.label}
    </span>
  );
}
