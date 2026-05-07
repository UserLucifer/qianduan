"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { 
  TrendingUp, 
  Wallet, 
  Zap, 
  CalendarDays, 
  CheckCircle2,
  Server,
  Loader2,
  FileText
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BentoCard } from "@/components/shared/BentoGrid";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";

import { getProfitRecords, getProfitSummary } from "@/api/profit";
import type { PageResult, ProfitRecordQueryRequest, ProfitRecordResponse, ProfitSummaryResponse } from "@/api/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { formatDate } from "@/lib/format";

const initialParams: ProfitRecordQueryRequest = { pageNo: 1, pageSize: 12 };

interface TrendPoint {
  date: string;
  amount: number;
}

export default function ProfitsPage() {
  const t = useTranslations("DashboardProfits");
  const dt = useTranslations("DataTable");
  const [chartReady, setChartReady] = useState(false);

  // Load summaries from real API
  const summaryLoader = useCallback(async (): Promise<ProfitSummaryResponse> => {
    const res = await getProfitSummary();
    return res.data;
  }, []);

  // Load paginated records from real API
  const loader = useCallback(async (params: ProfitRecordQueryRequest): Promise<PageResult<ProfitRecordResponse>> => {
    const res = await getProfitRecords(params);
    return res.data;
  }, []);

  // Separate loader for Trend Chart to get more data points than a single page
  const trendLoader = useCallback(async (): Promise<ProfitRecordResponse[]> => {
    const res = await getProfitRecords({ pageNo: 1, pageSize: 50 });
    return res.data.records;
  }, []);

  const summary = useAsyncResource(summaryLoader);
  const trendSource = useAsyncResource(trendLoader);
  const records = usePaginatedResource(loader, initialParams);
  
  const [activeTab, setActiveTab] = useState("ALL");
  const [dateRange, setDateRange] = useState("ALL");

  useEffect(() => {
    setChartReady(true);
  }, []);

  useEffect(() => {
    if (records.error) toast.error(records.error);
    if (summary.error) toast.error(summary.error);
  }, [records.error, summary.error]);

  // Aggregate trend data from trendSource
  const trendData = useMemo(() => {
    const rawRecords = trendSource.data || [];
    const grouped = new Map<string, number>();
    
    // Create a 7-day baseline if no data, or just ensure some range
    const daysToCover = 7;
    for (let i = daysToCover - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d.toISOString().split("T")[0]);
      grouped.set(dateStr, 0);
    }

    rawRecords.forEach((record) => {
      const dateStr = formatDate(record.profitDate.split(" ")[0]);
      if (grouped.has(dateStr)) {
        grouped.set(dateStr, grouped.get(dateStr)! + record.finalProfitAmount);
      } else if (rawRecords.length > 0) {
          // If we have records, we can add them to the map even if outside the 7-day baseline
          grouped.set(dateStr, (grouped.get(dateStr) || 0) + record.finalProfitAmount);
      }
    });

    return Array.from(grouped.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [trendSource.data]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    triggerSearch(val, dateRange);
  };

  const handleDateRangeChange = (val: string) => {
    setDateRange(val);
    triggerSearch(activeTab, val);
  };

  const triggerSearch = (statusOpt: string, dateOption: string) => {
    const status = statusOpt === "ALL" ? undefined : statusOpt;
    
    // Determine profitDate based on dateOption (3D, 7D, 30D)
    let profitDate: string | undefined = undefined;
    if (dateOption !== "ALL") {
       const d = new Date();
       const days = parseInt(dateOption);
       d.setDate(d.getDate() - days);
       // Note: The backend API 'profitDate' might expect a specific format or be a single date.
       // Assuming it's a start date filter for this refactor.
       profitDate = d.toISOString().split("T")[0];
    }

    records.updateParams({ 
      ...records.page, 
      pageNo: 1, 
      status,
      profitDate
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />
      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <StatsCard title={t("stats.today")} value={<MoneyText value={summary.data?.todayProfit} />} description={t("stats.todayDesc")} icon={Zap} loading={summary.loading} status="good" />
        <StatsCard title={t("stats.total")} value={<MoneyText value={summary.data?.totalProfit} />} description={t("stats.totalDesc")} icon={Wallet} loading={summary.loading} status="good" />
        <StatsCard title={t("stats.month")} value={<MoneyText value={summary.data?.currentMonthProfit} />} description={t("stats.monthDesc")} icon={CalendarDays} loading={summary.loading} />
        <StatsCard title={t("stats.settledCount")} value={summary.data?.settledProfitCount ?? 0} description={t("stats.settledCountDesc")} icon={CheckCircle2} loading={summary.loading} />
      </div>

      <BentoCard title={t("trend")} className="shadow-sm border-border bg-card">
        <div className="h-[300px] w-full pt-4">
          {chartReady && !trendSource.loading ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--ui-border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: "hsl(var(--ui-muted-foreground))", fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--ui-muted-foreground))", fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: "hsl(var(--ui-popover))", 
                    border: "1px solid hsl(var(--ui-border))", 
                    borderRadius: 8,
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                  itemStyle={{ color: "hsl(var(--ui-foreground))", fontWeight: "bold" }}
                  formatter={(value: any) => [`$${Number(value).toFixed(2)}`, t("trend")]}
                  labelStyle={{ color: "hsl(var(--ui-muted-foreground))", marginBottom: 4 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#profitTrendFill)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
             <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
             </div>
          )}
        </div>
      </BentoCard>

      <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full lg:w-auto overflow-x-auto">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border/50">
            <TabsTrigger value="ALL" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("filters.allStatus")}
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("filters.pending")}
            </TabsTrigger>
            <TabsTrigger value="SETTLED" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("filters.settled")}
            </TabsTrigger>
            <TabsTrigger value="CANCELED" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("filters.canceled")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="h-10 w-[140px] bg-card border-border text-xs font-medium">
              <SelectValue placeholder={t("filters.allTime")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("filters.allTime")}</SelectItem>
              <SelectItem value="3">{t("filters.last3Days")}</SelectItem>
              <SelectItem value="7">{t("filters.last7Days")}</SelectItem>
              <SelectItem value="30">{t("filters.last30Days")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="min-h-[400px]">
        {records.loading && records.page.records.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{dt("loading")}</span>
          </div>
        ) : records.page.records.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/30">
            <FileText className="h-10 w-10 text-muted-foreground/40" />
            <span className="text-sm font-medium text-muted-foreground">{t("empty")}</span>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {records.page.records.map((row) => (
              <div
                key={row.profitNo}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/20 hover:bg-muted/30 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-500/20">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10Z" />
                        <path d="M12 12v4" />
                        <path d="M8 14h8" />
                        <path d="M2 6h20" />
                        <path d="M6 2v4" />
                        <path d="M18 2v4" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">
                        {row.productNameSnapshot}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {row.aiModelNameSnapshot}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={row.status} />
                </div>

                <div className="space-y-3 border-t border-border/50 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t("columns.profitNo")}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">#{row.profitNo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t("columns.orderNo")}</span>
                    <span className="font-mono text-xs font-medium">{row.orderNo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t("columns.profitDate")}</span>
                    <span className="text-xs font-medium">{formatDate(row.profitDate)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">{t("columns.amount")}</span>
                    <MoneyText value={row.finalProfitAmount} signed className="text-lg font-black text-emerald-500 dark:text-emerald-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {records.page.total > records.page.pageSize && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-border pt-6 gap-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {dt("pageSummary", {
              pageNo: records.page.pageNo,
              pageCount: Math.ceil(records.page.total / records.page.pageSize),
              total: records.page.total
            })}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={records.page.pageNo <= 1}
              onClick={() => records.changePage(records.page.pageNo - 1)}
            >
              {dt("previousPage")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={records.page.pageNo >= Math.ceil(records.page.total / records.page.pageSize)}
              onClick={() => records.changePage(records.page.pageNo + 1)}
            >
              {dt("nextPage")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
