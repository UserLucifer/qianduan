"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { maskSecret } from "@/lib/format";

export function CopyableSecret({
  value,
  maskedValue,
  canReveal = true,
  className,
}: {
  value: string | null | undefined;
  maskedValue?: string | null;
  canReveal?: boolean;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const display = visible ? value ?? "-" : maskedValue || maskSecret(value);

  const copyValue = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-xs text-zinc-300",
        className,
      )}
    >
      <span className="truncate">{display}</span>
      {canReveal ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-zinc-500 hover:bg-white/5 hover:text-zinc-100"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </Button>
      ) : null}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 text-zinc-500 hover:bg-white/5 hover:text-zinc-100"
        onClick={copyValue}
        disabled={!value}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
    </span>
  );
}
