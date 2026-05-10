"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { maskSecret } from "@/lib/format";

export function CopyableSecret({
  value,
  maskedValue,
  canReveal = true,
  className,
  truncate = true,
}: {
  value: string | null | undefined;
  maskedValue?: string | null;
  canReveal?: boolean;
  className?: string;
  truncate?: boolean;
}) {
  const t = useTranslations("SharedControls.copyableSecret");
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
        "inline-flex max-w-full gap-1 rounded-md border bg-muted/50 px-2 py-1 font-mono text-xs text-muted-foreground",
        truncate ? "items-center" : "items-start whitespace-normal",
        className,
      )}
    >
      <span className={cn(truncate ? "truncate" : "break-all whitespace-normal")}>{display}</span>
      {canReveal ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? t("hide") : t("show")}
        >
          {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </Button>
      ) : null}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={copyValue}
        disabled={!value}
        aria-label={t("copy")}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
    </span>
  );
}
