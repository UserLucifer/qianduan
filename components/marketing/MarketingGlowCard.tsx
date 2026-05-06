"use client";

import type { ReactNode } from "react";
import BorderGlow from "@/components/marketing/BorderGlow";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MarketingGlowCardProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  backgroundColor?: string;
};

const glowColors = ["#5e6ad2", "#9aa2ff", "#38bdf8"];

export function MarketingGlowCard({
  children,
  className,
  contentClassName,
  backgroundColor = "rgba(255,255,255,0.02)",
}: MarketingGlowCardProps) {
  return (
    <BorderGlow
      className={cn("h-full w-full min-w-0", className)}
      backgroundColor={backgroundColor}
      borderRadius={8}
      glowRadius={22}
      glowIntensity={0.45}
      glowColor="238 85 73"
      colors={glowColors}
      fillOpacity={0.16}
      coneSpread={22}
    >
      <Card className="h-full w-full min-w-0 rounded-[8px] border-0 bg-transparent text-[#f7f8f8] shadow-none">
        <CardContent className={cn("w-full min-w-0", contentClassName)}>{children}</CardContent>
      </Card>
    </BorderGlow>
  );
}
