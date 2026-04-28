"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
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


  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-100 bg-gray-50 hover:bg-gray-50 dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-white/[0.02]">
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={cn("h-11 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500", column.className)}
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
          ) : (
            data.map((row) => (
              <TableRow key={rowKey(row)} className="border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/[0.02]">
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
            ))
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
