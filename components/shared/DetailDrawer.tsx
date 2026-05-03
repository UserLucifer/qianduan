"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface DetailFieldDef<T> {
  label: string;
  render: (data: T) => ReactNode;
  fullWidth?: boolean;
}

export interface DetailSectionDef<T> {
  title: string;
  fields: DetailFieldDef<T>[];
}

export interface DetailDrawerProps<T> {
  open: boolean;
  data: T | null | undefined;
  title: string | ((data: T) => string);
  subtitle?: ReactNode | ((data: T) => ReactNode);
  sections?: DetailSectionDef<T>[];
  children?: ReactNode | ((data: T) => ReactNode);
  onClose: () => void;
}

export function DetailDrawer<T>({
  open,
  data,
  title,
  subtitle,
  sections,
  children,
  onClose,
}: DetailDrawerProps<T>) {
  if (!open || data == null) return null;

  const displayTitle = typeof title === "function" ? title(data) : title;
  const displaySubtitle = typeof subtitle === "function" ? subtitle(data) : subtitle;
  const displayChildren = typeof children === "function" ? children(data) : children;

  return (
    <Drawer
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      direction="right"
      shouldScaleBackground={false}
    >
      <DrawerContent className="!inset-y-0 !left-auto !right-0 !mt-0 h-full w-full max-w-xl rounded-none border-l border-border bg-background p-0 shadow-2xl [&>div:first-child]:hidden">
        <DrawerHeader className="sticky top-0 z-10 flex-row items-start justify-between gap-4 border-b border-border bg-background/95 p-5 text-left backdrop-blur-xl">
          <div className="min-w-0">
            <DrawerTitle className="truncate text-lg font-semibold text-foreground">{displayTitle}</DrawerTitle>
            {displaySubtitle ? (
              <DrawerDescription asChild>
                <div className="mt-1 text-xs text-muted-foreground">{displaySubtitle}</div>
              </DrawerDescription>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="关闭详情"
            className="text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DrawerHeader>
        <div className="space-y-4 overflow-y-auto p-5">
          {displayChildren}
          {sections?.map((section) => (
            <section key={section.title} className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-foreground">{section.title}</h3>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <div key={field.label} className={field.fullWidth ? "sm:col-span-2" : ""}>
                    {field.label && (
                      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{field.label}</dt>
                    )}
                    <dd className={cn("min-w-0 text-sm font-medium text-foreground", field.label ? "mt-1.5" : "mt-0")}>
                      {field.render(data)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
