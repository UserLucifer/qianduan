"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ChevronRight,
  Cloud,
  Cpu,
  Database,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MarketingMegaMenu from "./MarketingMegaMenu";

type ProductSubItem = {
  key: string;
  href: string;
  items?: string[];
};

type ProductCategory = {
  id: string;
  messageKey: string;
  icon: LucideIcon;
  subItems: ProductSubItem[];
  featured: {
    image: string;
  };
};

const productCategories: ProductCategory[] = [
  {
    id: "foundation",
    messageKey: "foundation",
    icon: Cpu,
    subItems: [
      { key: "gpuComputing", href: "/gpu-computing", items: ["NVIDIA Blackwell", "NVIDIA Hopper", "NVIDIA Ada Lovelace"] },
      { key: "cpuComputing", href: "/cpu-computing" },
      { key: "bareMetal", href: "/bare-metal-servers" },
      { key: "networking", href: "/networking-services" },
    ],
    featured: {
      image: "/images/navagation/1.jpg",
    },
  },
  {
    id: "data-storage",
    messageKey: "dataStorage",
    icon: Database,
    subItems: [
      { key: "objectStorage", href: "/ai-object-storage" },
      { key: "vastStorage", href: "/dedicated-vast-storage" },
      { key: "distributedFile", href: "/ai-object-storage#distributed-file-storage" },
      { key: "localStorage", href: "/ai-object-storage#local-storage" },
    ],
    featured: {
      image: "/images/navagation/2.jpg",
    },
  },
  {
    id: "infrastructure-control",
    messageKey: "infrastructureControl",
    icon: Cloud,
    subItems: [
      { key: "managedKubernetes", href: "/managed-kubernetes" },
    ],
    featured: {
      image: "/images/navagation/3.jpg",
    },
  },
  {
    id: "runtime-acceleration",
    messageKey: "runtimeAcceleration",
    icon: Zap,
    subItems: [
      { key: "sunk", href: "/sunk" },
      { key: "sunkAnywhere", href: "/sunk-anywhere" },
      { key: "serverlessRl", href: "https://wandb.ai/site/serverless-rl/?utm_source=coreweave.com&utm_medium=site" },
    ],
    featured: {
      image: "/images/navagation/4.jpg",
    },
  },
  {
    id: "model-agent-development",
    messageKey: "modelAgent",
    icon: Target,
    subItems: [
      { key: "training", href: "https://wandb.ai/site/models/?utm_source=coreweave.com&utm_medium=site" },
      { key: "fineTuning", href: "https://wandb.ai/site/wb-training/?utm_source=coreweave.com&utm_medium=site" },
      { key: "inference", href: "https://wandb.ai/site/inference/?utm_source=coreweave.com&utm_medium=site#" },
      { key: "monitoring", href: "https://wandb.ai/site/weave/?utm_source=coreweave.com&utm_medium=site" },
    ],
    featured: {
      image: "/images/navagation/5.avif",
    },
  },
  {
    id: "mission-control",
    messageKey: "missionControl",
    icon: Activity,
    subItems: [
      { key: "missionControl", href: "/mission-control" },
      { key: "fleetLifecycle", href: "/mission-control#fleet-lifecycle-controller" },
      { key: "nodeLifecycle", href: "/mission-control#node-lifecycle-controller" },
      { key: "observability", href: "/observability" },
    ],
    featured: {
      image: "/images/navagation/6.jpg",
    },
  },
];

export default function ProductMegaMenu() {
  const [activeCategory, setActiveCategory] = useState(productCategories[0]);
  const t = useTranslations("MegaMenus.product");
  const ActiveIcon = activeCategory.icon;

  const categoryName = (category: ProductCategory) => t(`categories.${category.messageKey}.name`);
  const featuredTitle = t(`categories.${activeCategory.messageKey}.featuredTitle`);

  return (
    <MarketingMegaMenu className="w-[1080px] items-stretch">
      <aside className="w-64 shrink-0 border-r border-border/50 bg-muted/20 p-4">
        <div className="px-3 pb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("catalog")}
          </h3>
        </div>
        <div className="flex flex-col gap-1">
          {productCategories.map((category) => {
            const Icon = category.icon;

            return (
              <Button
                key={category.id}
                type="button"
                variant="ghost"
                className={cn(
                  "h-auto w-full justify-start gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground",
                  activeCategory.id === category.id && "bg-accent/60 text-foreground",
                )}
                onFocus={() => setActiveCategory(category)}
                onMouseEnter={() => setActiveCategory(category)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{categoryName(category)}</span>
                <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            );
          })}
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-muted p-2 text-foreground">
                <ActiveIcon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  {categoryName(activeCategory)}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("categoryDescription")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {activeCategory.subItems.map((sub) => (
                <Link
                  key={sub.key}
                  href={sub.href}
                  prefetch={false}
                  className="group rounded-lg border border-transparent p-3 transition-colors hover:border-border/60 hover:bg-accent/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {t(`categories.${activeCategory.messageKey}.items.${sub.key}`)}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </div>
                  {sub.items ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {sub.items.map((item) => (
                        <span key={item} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs leading-snug text-muted-foreground">
                      {t("defaultItemDescription")}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <aside className="flex w-80 shrink-0 flex-col bg-muted/30 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory.id}-featured`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex h-full flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border/50">
              <Image
                src={activeCategory.featured.image}
                alt={featuredTitle}
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
            <div className="pt-5">
              <h4 className="text-sm font-semibold leading-snug text-foreground">
                {featuredTitle}
              </h4>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {t(`categories.${activeCategory.messageKey}.featuredDescription`)}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </aside>
    </MarketingMegaMenu>
  );
}
