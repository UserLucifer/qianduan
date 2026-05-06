"use client";

import { useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T extends object> {
  key: keyof T | string;
  title: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

const VIRTUAL_THRESHOLD = 50;

export function DataTable<T extends object>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyText,
  pageNo,
  pageSize,
  total,
  onPageChange,
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  emptyText?: string;
  pageNo?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (pageNo: number) => void;
}) {
  const t = useTranslations("DataTable");
  const pageCount = pageNo && pageSize && total ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const canPrevious = Boolean(pageNo && pageNo > 1);
  const canNext = Boolean(pageNo && pageNo < pageCount);

  const parentRef = useRef<HTMLDivElement>(null);
  const isVirtual = data.length > VIRTUAL_THRESHOLD;

  const virtualizer = useVirtualizer({
    count: isVirtual ? data.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 53,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0]?.start || 0 : 0;
  const paddingBottom = virtualItems.length > 0 ? virtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end || 0) : 0;

  const renderRow = (row: T, index: number, measureRef?: (el: HTMLElement | null) => void) => {
    return (
      <TableRow
        key={rowKey(row)}
        ref={measureRef}
        data-index={index}
        className="border-border transition-colors hover:bg-muted/50"
      >
        {columns.map((column) => {
          const cellValue = row[column.key as keyof T];
          return (
            <TableCell
              key={String(column.key)}
              className={cn("px-4 py-3.5 text-sm text-foreground", column.className)}
            >
              {column.render ? column.render(row) : String(cellValue ?? "-")}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  return (
    <div
      ref={parentRef}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        isVirtual ? "max-h-[800px] overflow-y-auto" : "overflow-hidden"
      )}
    >
      <Table>
        <TableHeader className={cn(isVirtual && "sticky top-0 z-10")}>
          <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={cn("h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground", column.className)}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow className="border-border hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                <span className="inline-flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("loading")}
                </span>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow className="border-border hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-32 text-center text-sm text-muted-foreground">
                {emptyText ?? t("empty")}
              </TableCell>
            </TableRow>
          ) : isVirtual ? (
            <>
              {paddingTop > 0 && (
                <TableRow aria-hidden="true" className="border-0 hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="p-0" style={{ height: `${paddingTop}px` }} />
                </TableRow>
              )}
              {virtualItems.map((virtualRow) => {
                const row = data[virtualRow.index];
                return renderRow(row, virtualRow.index, virtualizer.measureElement);
              })}
              {paddingBottom > 0 && (
                <TableRow aria-hidden="true" className="border-0 hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="p-0" style={{ height: `${paddingBottom}px` }} />
                </TableRow>
              )}
            </>
          ) : (
            data.map((row, index) => renderRow(row, index))
          )}
        </TableBody>
      </Table>
      {pageNo && pageSize && typeof total === "number" && onPageChange ? (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium">
            {t("pageSummary", { pageNo, pageCount, total })}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 font-medium"
              disabled={!canPrevious}
              onClick={() => onPageChange(pageNo - 1)}
            >
              {t("previousPage")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 font-medium"
              disabled={!canNext}
              onClick={() => onPageChange(pageNo + 1)}
            >
              {t("nextPage")}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
