"use client";

import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";

export function DateTimeText({
  value,
  className,
}: {
  value: string | null | undefined;
  className?: string;
}) {
  return (

    <span className={cn("text-xs tabular-nums text-[var(--admin-muted)]", className)}>
      {formatDateTime(value)}
    </span>
  );
}
