"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Bot,
  Boxes,
  Code2,
  DatabaseZap,
  FileText,
  ImageIcon,
  Mic,
  MonitorCog,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

import MarketingMegaMenu from "./MarketingMegaMenu";

type UseCaseItem = {
  key: string;
  href: string;
  icon: LucideIcon;
};

const useCaseItems: UseCaseItem[] = [
  { key: "textGeneration", href: "/use-cases/ai-text-generation", icon: FileText },
  { key: "imageVideo", href: "/use-cases/ai-image-video-generation", icon: ImageIcon },
  { key: "agents", href: "/use-cases/ai-agents", icon: Bot },
  { key: "fineTuning", href: "/use-cases/ai-fine-tuning", icon: SlidersHorizontal },
  { key: "batchData", href: "/use-cases/batch-data-processing", icon: DatabaseZap },
  { key: "audio", href: "/use-cases/audio-to-text-transcription", icon: Mic },
  { key: "virtualComputing", href: "/use-cases/virtual-computing", icon: MonitorCog },
  { key: "gpuProgramming", href: "/use-cases/gpu-programming", icon: Code2 },
  { key: "rendering", href: "/use-cases/3d-rendering", icon: Boxes },
];

export default function UseCaseMegaMenu() {
  const t = useTranslations("MegaMenus.useCases");

  return (
    <MarketingMegaMenu className="w-[820px] items-stretch">
      <main className="min-w-0 flex-1 p-6">
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("title")}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {useCaseItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                href={item.href}
                prefetch={false}
                className="group rounded-lg p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-muted p-1.5 text-foreground transition-colors group-hover:bg-background">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-tight text-foreground">
                      {t(`items.${item.key}.name`)}
                    </div>
                    <div className="mt-1 text-xs leading-snug text-muted-foreground">
                      {t(`items.${item.key}.description`)}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <aside className="flex w-64 shrink-0 flex-col bg-muted/30 p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t("sideTitle")}
        </h3>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {t("sideDescription")}
        </p>
        <Link
          href="/use-cases"
          prefetch={false}
          className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
        >
          {t("viewAll")}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </aside>
    </MarketingMegaMenu>
  );
}
