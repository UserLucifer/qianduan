"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SearchPanel({
  children,
  onSearch,
  onReset,
  defaultCollapsed = false,
}: {
  children: ReactNode;
  onSearch: () => void;
  onReset: () => void;
  defaultCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const t = useTranslations("SearchPanel");


  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2 h-9 gap-2 px-2 text-sm font-semibold text-foreground"
            onClick={() => setCollapsed((current) => !current)}
            aria-expanded={!collapsed}
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            {t("filters")}
            <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", !collapsed && "rotate-180")} />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 font-medium"
              onClick={onReset}
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              {t("reset")}
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-9 font-semibold"
              onClick={onSearch}
            >
              <Search className="mr-2 h-3.5 w-3.5" />
              {t("search")}
            </Button>
          </div>
        </div>
        <div className={cn("grid transition-[grid-template-rows,opacity] duration-200", collapsed ? "grid-rows-[0fr] opacity-0" : "mt-5 grid-rows-[1fr] opacity-100")}>
          <div className="min-h-0 overflow-hidden">
            <div className="flex flex-wrap items-end gap-4">
              {children}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
