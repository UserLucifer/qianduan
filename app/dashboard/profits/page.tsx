"use client";

import { useCallback, useEffect, useState } from "react";
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

const columns: DataTableColumn<ProfitRecordResponse>[] = [
  { key: "profitNo", title: "收益编号", render: (row) => <span className="font-mono text-xs">{row.profitNo}</span> },
  { key: "orderNo", title: "关联订单", render: (row) => <span className="font-mono text-xs">{row.orderNo}</span> },
  { key: "productNameSnapshot", title: "产品 / 模型", render: (row) => <span>{row.productNameSnapshot} · {row.aiModelNameSnapshot}</span> },
  { key: "finalProfitAmount", title: "收益金额", render: (row) => <MoneyText value={row.finalProfitAmount} signed /> },
  { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
  { key: "profitDate", title: "收益日期", render: (row) => formatDate(row.profitDate) },
  { key: "settledAt", title: "结算时间", render: (row) => <DateTimeText value={row.settledAt} /> },
];

function buildTrend(records: ProfitRecordResponse[]): TrendPoint[] {
  // 后端暂无收益趋势接口，这里基于当前页收益记录按日期聚合。
  const map = new Map<string, number>();
  records.forEach((record) => {
    const key = formatDate(record.profitDate);
    map.set(key, (map.get(key) ?? 0) + record.finalProfitAmount);
  });
  return Array.from(map.entries()).map(([date, amount]) => ({ date, amount }));
}

export default function ProfitsPage() {
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

  useEffect(() => {
    setChartReady(true);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="收益中心" title="收益记录与趋势" description="查看今日收益、累计收益、待结算收益及订单维度收益记录。" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <StatsCard title="今日收益" value={<MoneyText value={summary.data?.todayProfit} />} description="当前自然日" icon={TrendingUp} loading={summary.loading} status="good" />
        <StatsCard title="累计收益" value={<MoneyText value={summary.data?.totalProfit} />} description="历史累计收益" icon={TrendingUp} loading={summary.loading} status="good" />
        <StatsCard title="本月收益" value={<MoneyText value={summary.data?.currentMonthProfit} />} description="当前月份" icon={TrendingUp} loading={summary.loading} />
        <StatsCard title="已结算笔数" value={summary.data?.settledProfitCount ?? 0} description="接口返回统计" icon={TrendingUp} loading={summary.loading} />
      </div>
      <BentoCard title="收益趋势">
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
          <Label htmlFor="orderNo">订单号</Label>
          <Input id="orderNo" value={filters.orderNo ?? ""} onChange={(event) => setFilters((current) => ({ ...current, orderNo: event.target.value || undefined }))} placeholder="关联单号" className="h-9 w-[180px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>结算状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val === " " ? undefined : val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value="PENDING">待结算</SelectItem>
              <SelectItem value="SETTLED">已结算</SelectItem>
              <SelectItem value="CANCELED">已失效</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>收益日期</Label>
          <Input type="date" value={filters.profitDate ?? ""} onChange={(event) => setFilters((current) => ({ ...current, profitDate: event.target.value || undefined }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
      </SearchPanel>
      <ErrorAlert message={records.error} />
      <DataTable columns={columns} data={records.page.records} rowKey={(row) => row.profitNo} loading={records.loading} emptyText="暂无收益记录。" pageNo={records.page.pageNo} pageSize={records.page.pageSize} total={records.page.total} onPageChange={records.changePage} />
    </div>
  );
}
