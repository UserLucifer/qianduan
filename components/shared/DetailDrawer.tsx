"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DetailFieldDef<T> {
  label: string;
  render: (data: T) => ReactNode;
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted || data == null) return null;

  const displayTitle = typeof title === "function" ? title(data) : title;
  const displaySubtitle = typeof subtitle === "function" ? subtitle(data) : subtitle;
  const displayChildren = typeof children === "function" ? children(data) : children;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="关闭详情" />

      <aside className="relative z-10 h-full w-full max-w-xl overflow-y-auto border-l border-[var(--admin-border)] bg-[var(--admin-panel-strong)] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[var(--admin-border)] bg-[var(--admin-panel-strong)]/90 p-5 backdrop-blur-xl">
          <div>
            <h2 className="text-lg font-semibold text-[var(--admin-text)]">{displayTitle}</h2>
            {displaySubtitle ? <div className="mt-1 text-xs text-[var(--admin-muted)]">{displaySubtitle}</div> : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4 p-5">
          {displayChildren}
          {sections?.map((section) => (
            <section key={section.title} className="admin-card p-5">
              <h3 className="mb-4 text-sm font-bold text-[var(--admin-text)]">{section.title}</h3>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <div key={field.label}>
                    <dt className="text-[11px] font-medium uppercase tracking-wider text-[var(--admin-muted)]">{field.label}</dt>
                    <dd className="mt-1.5 min-w-0 text-sm font-medium text-[var(--admin-text)]">{field.render(data)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </aside>
    </div>,
    document.body
  );
}
