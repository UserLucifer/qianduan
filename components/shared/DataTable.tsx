"use client";

import { useRef, type ReactNode } from "react";
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
  emptyText = "暂无数据",
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
  const pageCount = pageNo && pageSize && total ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const canPrevious = Boolean(pageNo && pageNo > 1);
  const canNext = Boolean(pageNo && pageNo < pageCount);

  const parentRef = useRef<HTMLDivElement>(null);
  const isVirtual = data.length > VIRTUAL_THRESHOLD;

  const virtualizer = useVirtualizer({
    count: isVirtual ? data.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 53, // 预估每行高度 53px
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
        className="border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/[0.02]"
      >
        {columns.map((column) => {
          const cellValue = row[column.key as keyof T];
          return (
            <TableCell
              key={String(column.key)}
              className={cn("px-4 py-3.5 text-sm text-slate-700 dark:text-muted-foreground", column.className)}
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
        "rounded-xl border border-gray-100 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950 dark:shadow-none",
        isVirtual ? "max-h-[800px] overflow-y-auto" : "overflow-hidden"
      )}
    >
      <Table>
        <TableHeader className={cn(isVirtual && "sticky top-0 z-10")}>
          <TableRow className="border-gray-100 bg-gray-50 hover:bg-gray-50 dark:border-white/5 dark:bg-zinc-900 dark:hover:bg-zinc-900">
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={cn("h-11 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400", column.className)}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow className="border-gray-50 hover:bg-transparent dark:border-white/5">
              <TableCell colSpan={columns.length} className="h-32 text-center text-slate-400 dark:text-zinc-600">
                <span className="inline-flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  数据加载中
                </span>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow className="border-gray-50 hover:bg-transparent dark:border-white/5">
              <TableCell colSpan={columns.length} className="h-32 text-center text-sm text-slate-400 dark:text-zinc-600">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : isVirtual ? (
            <>
              {paddingTop > 0 && (
                <tr>
                  <td colSpan={columns.length} style={{ height: `${paddingTop}px` }} />
                </tr>
              )}
              {virtualItems.map((virtualRow) => {
                const row = data[virtualRow.index];
                return renderRow(row, virtualRow.index, virtualizer.measureElement);
              })}
              {paddingBottom > 0 && (
                <tr>
                  <td colSpan={columns.length} style={{ height: `${paddingBottom}px` }} />
                </tr>
              )}
            </>
          ) : (
            data.map((row, index) => renderRow(row, index))
          )}
        </TableBody>
      </Table>
      {pageNo && pageSize && typeof total === "number" && onPageChange ? (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-4 text-xs text-slate-500 dark:border-white/5 dark:text-zinc-500">
          <span className="font-medium">
            第 {pageNo} / {pageCount} 页，共 {total} 条数据
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-gray-200 bg-white font-medium text-slate-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-muted-foreground dark:hover:bg-white/[0.06]"
              disabled={!canPrevious}
              onClick={() => onPageChange(pageNo - 1)}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-gray-200 bg-white font-medium text-slate-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-muted-foreground dark:hover:bg-white/[0.06]"
              disabled={!canNext}
              onClick={() => onPageChange(pageNo + 1)}
            >
              下一页
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
