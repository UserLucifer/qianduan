"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BentoCard } from "@/components/shared/BentoGrid";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getProfitRecords, getProfitSummary } from "@/api/profit";
import type { PageResult, ProfitRecordQueryRequest, ProfitRecordResponse, ProfitSummaryResponse } from "@/api/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { formatDate } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

const initialParams: ProfitRecordQueryRequest = { pageNo: 1, pageSize: 10 };

interface TrendPoint {
  date: string;
  amount: number;
}


function buildTrend(records: ProfitRecordResponse[]): TrendPoint[] {
  // The backend does not expose a profit trend endpoint yet, so this chart aggregates the current page by date.
  const map = new Map<string, number>();
  records.forEach((record) => {
    const key = formatDate(record.profitDate);
    map.set(key, (map.get(key) ?? 0) + record.finalProfitAmount);
  });
  return Array.from(map.entries()).map(([date, amount]) => ({ date, amount }));
}

export default function ProfitsPage() {
  const t = useTranslations("DashboardProfits");
  const [chartReady, setChartReady] = useState(false);
  const summaryLoader = useCallback(async (): Promise<ProfitSummaryResponse> => {
    const res = await getProfitSummary();
    return res.data;
  }, []);
  const loader = useCallback(async (params: ProfitRecordQueryRequest): Promise<PageResult<ProfitRecordResponse>> => {
    const res = await getProfitRecords(params);
    return res.data;
  }, []);
  const summary = useAsyncResource(summaryLoader);
  const records = usePaginatedResource(loader, initialParams);
  const [filters, setFilters] = useState<ProfitRecordQueryRequest>(initialParams);
  const trend = buildTrend(records.page.records);

  const columns: DataTableColumn<ProfitRecordResponse>[] = [
    { key: "profitNo", title: t("columns.profitNo"), render: (row) => <span className="font-mono text-xs">{row.profitNo}</span> },
    { key: "orderNo", title: t("columns.orderNo"), render: (row) => <span className="font-mono text-xs">{row.orderNo}</span> },
    { key: "productNameSnapshot", title: t("columns.productModel"), render: (row) => <span>{row.productNameSnapshot} / {row.aiModelNameSnapshot}</span> },
    { key: "finalProfitAmount", title: t("columns.amount"), render: (row) => <MoneyText value={row.finalProfitAmount} signed /> },
    { key: "status", title: t("columns.status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "profitDate", title: t("columns.profitDate"), render: (row) => formatDate(row.profitDate) },
    { key: "settledAt", title: t("columns.settledAt"), render: (row) => <DateTimeText value={row.settledAt} /> },
  ];

  useEffect(() => {
    setChartReady(true);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <StatsCard title={t("stats.today")} value={<MoneyText value={summary.data?.todayProfit} />} description={t("stats.todayDesc")} icon={TrendingUp} loading={summary.loading} status="good" />
        <StatsCard title={t("stats.total")} value={<MoneyText value={summary.data?.totalProfit} />} description={t("stats.totalDesc")} icon={TrendingUp} loading={summary.loading} status="good" />
        <StatsCard title={t("stats.month")} value={<MoneyText value={summary.data?.currentMonthProfit} />} description={t("stats.monthDesc")} icon={TrendingUp} loading={summary.loading} />
        <StatsCard title={t("stats.settledCount")} value={summary.data?.settledProfitCount ?? 0} description={t("stats.settledCountDesc")} icon={TrendingUp} loading={summary.loading} />
      </div>
      <BentoCard title={t("trend")}>
        <div className="h-64">
          {chartReady ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="profitTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--ui-primary))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--ui-primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--ui-border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--ui-muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--ui-muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--ui-popover))", border: "1px solid hsl(var(--ui-border))", borderRadius: 8 }} />
                <Area type="monotone" dataKey="amount" stroke="hsl(var(--ui-primary))" fill="url(#profitTrendFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      </BentoCard>
      <SearchPanel
        onSearch={() => records.updateParams({ ...filters, pageNo: 1 })}
        onReset={() => {
          setFilters(initialParams);
          records.updateParams(initialParams);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="orderNo">{t("filters.orderNo")}</Label>
          <Input id="orderNo" value={filters.orderNo ?? ""} onChange={(event) => setFilters((current) => ({ ...current, orderNo: event.target.value || undefined }))} placeholder={t("filters.orderPlaceholder")} className="h-9 w-[180px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>{t("filters.status")}</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val === " " ? undefined : val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder={t("filters.allStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("filters.allStatus")}</SelectItem>
              <SelectItem value="PENDING">{t("filters.pending")}</SelectItem>
              <SelectItem value="SETTLED">{t("filters.settled")}</SelectItem>
              <SelectItem value="CANCELED">{t("filters.canceled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("filters.profitDate")}</Label>
          <Input type="date" value={filters.profitDate ?? ""} onChange={(event) => setFilters((current) => ({ ...current, profitDate: event.target.value || undefined }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
      </SearchPanel>
      <ErrorAlert message={records.error} />
      <DataTable columns={columns} data={records.page.records} rowKey={(row) => row.profitNo} loading={records.loading} emptyText={t("empty")} pageNo={records.page.pageNo} pageSize={records.page.pageSize} total={records.page.total} onPageChange={records.changePage} />
    </div>
  );
}
