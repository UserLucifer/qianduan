"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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


  return (
    <div className="rounded-xl border border-input bg-background p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Search className="h-4 w-4 text-muted-foreground" />
          筛选条件
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 font-medium"
            onClick={onReset}
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            重置
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-9 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            onClick={onSearch}
          >
            <Search className="mr-2 h-3.5 w-3.5" />
            查询
          </Button>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex flex-wrap items-end gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}
