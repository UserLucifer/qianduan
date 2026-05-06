"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocsCopyButton() {
  const [copied, setCopied] = useState(false);

  const copyPage = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-9 gap-2 rounded-lg border-border bg-background px-3 text-muted-foreground shadow-none hover:text-foreground"
      onClick={copyPage}
    >
      {copied ? <Check className="h-4 w-4 text-[#4770FF]" /> : <Copy className="h-4 w-4" />}
      {copied ? "已复制" : "复制页面"}
      <span className="ml-1 border-l border-border pl-2">
        <ChevronDown className="h-3.5 w-3.5" />
      </span>
    </Button>
  );
}
