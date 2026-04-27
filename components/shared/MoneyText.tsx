"use client";

import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/format";

export function MoneyText({
  value,
  currency = "USDT",
  signed = false,
  className,
}: {
  value: number | null | undefined;
  currency?: string;
  signed?: boolean;
  className?: string;
}) {
  const amount = Number.isFinite(value) ? Number(value) : 0;
  const tone =
    signed && amount > 0
      ? "text-emerald-500 font-medium"
      : signed && amount < 0
        ? "text-rose-500 font-medium"
        : "text-[var(--admin-text)] font-semibold";

  return (
    <span className={cn("tabular-nums", tone, className)}>
      {formatMoney(amount, { currency, signed })}
    </span>
  );
}
