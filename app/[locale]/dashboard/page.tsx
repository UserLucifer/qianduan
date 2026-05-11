"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  CreditCard,
  KeyRound,
  PackagePlus,
  Send,
  TrendingUp,
  Users,
  Wallet,
  Zap,
  Terminal,
  Loader2,
  Activity,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { MoneyText } from "@/components/shared/MoneyText";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { getDashboardOverview } from "@/api/dashboard";
import { getProfitTrend } from "@/api/profit";

import type {
  ProfitTrendRecordResponse,
  ProfitSummaryResponse,
  RentalOrderSummaryResponse,
  TeamSummaryResponse,
  WalletMeResponse,
} from "@/api/types";

interface DashboardData {
  wallet: WalletMeResponse;
  orders: RentalOrderSummaryResponse[];
  runningOrderCount: number;
  pendingPayOrderCount: number;
  profitSummary: ProfitSummaryResponse;
  profitRecords: ProfitTrendRecordResponse[];
  teamSummary: TeamSummaryResponse;
}

interface TrendPoint {
  date: string;
  profit: number;
}

const PROFIT_TREND_DAYS = 7;
function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getRecentDateKeys(days: number): string[] {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - index - 1));
    return toDateKey(date);
  });
}

function buildProfitTrend(records: ProfitTrendRecordResponse[]): TrendPoint[] {
  // Always initialize with 7 days to ensure a baseline line for new users
  const grouped = new Map<string, number>();
  getRecentDateKeys(PROFIT_TREND_DAYS).forEach((dateKey) => {
    grouped.set(formatDate(dateKey), 0);
  });

  if (records && records.length > 0) {
    records.forEach((record) => {
      const key = formatDate(record.profitDate.split(" ")[0] || record.profitDate);
      if (grouped.has(key)) {
        grouped.set(key, grouped.get(key)! + record.finalProfitAmount);
      }
    });
  }

  return Array.from(grouped.entries())
    .map(([date, profit]) => ({ date, profit }));
}

export default function DashboardPage() {
  const t = useTranslations("DashboardHome");
  const [chartReady, setChartReady] = useState(false);

  const loader = useCallback(async (): Promise<DashboardData> => {
    const trendDates = getRecentDateKeys(PROFIT_TREND_DAYS);
    const [overview, profitTrend] = await Promise.all([
      getDashboardOverview(),
      getProfitTrend({
        startDate: trendDates[0],
        endDate: trendDates[trendDates.length - 1],
        groupBy: "DAY",
      }),
    ]);
    const dashboard = overview.data;

    return {
      wallet: dashboard.wallet,
      orders: dashboard.rental.recentOrders,
      runningOrderCount: dashboard.rental.runningOrderCount,
      pendingPayOrderCount: dashboard.rental.pendingPayOrderCount,
      profitSummary: dashboard.profit.summary,
      profitRecords: profitTrend.data.records,
      teamSummary: dashboard.team,
    };
  }, []);

  const { data, loading, error, reload } = useAsyncResource(loader);

  const trend = buildProfitTrend(data?.profitRecords ?? []);
  const runningOrders = data?.runningOrderCount ?? 0;
  const pendingPayOrders = data?.pendingPayOrderCount ?? 0;
  
  const quickActions = [
    { label: t("quickActions.rentGpu"), href: "/dashboard/products", icon: PackagePlus, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: t("quickActions.recharge"), href: "/dashboard/recharge", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: t("quickActions.withdraw"), href: "/dashboard/withdraw", icon: Send, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: t("quickActions.apiCredentials"), href: "/dashboard/api", icon: KeyRound, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: t("quickActions.profits"), href: "/dashboard/profits", icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: t("quickActions.team"), href: "/dashboard/team", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ];

  useEffect(() => {
    setChartReady(true);
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("header.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("header.description")}</p>
        </div>
        <Button onClick={() => void reload()} variant="outline" size="sm" className="w-full sm:w-auto">
          <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
          {t("header.refresh")}
        </Button>
      </div>

      <ErrorAlert message={error}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 border-destructive/30 bg-background px-3 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => void reload()}
        >
          {t("common.retry")}
        </Button>
      </ErrorAlert>

      {/* CORE DASHBOARD - HERO SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t("stats.walletTotal.title")}</h3>
            <div className="rounded-full bg-primary/10 p-2">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            ) : (
              <MoneyText value={(data?.wallet.availableBalance ?? 0) + (data?.wallet.frozenBalance ?? 0)} className="text-3xl font-black tracking-tight" />
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">{t("assets.availableBalance")}:</span>
            <span className="font-semibold"><MoneyText value={data?.wallet.availableBalance} /></span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t("stats.todayProfit.title")}</h3>
            <div className="rounded-full bg-emerald-500/10 p-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            ) : (
              <MoneyText value={data?.profitSummary.todayProfit} className="text-3xl font-black tracking-tight text-emerald-500 dark:text-emerald-400" />
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">{t("stats.todayProfit.total", { amount: '' })}</span>
            <span className="font-semibold"><MoneyText value={data?.profitSummary.totalProfit} /></span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t("stats.activeInstances.title")}</h3>
            <div className="flex items-center gap-2">
              {runningOrders > 0 && <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>}
              <div className="rounded-full bg-blue-500/10 p-2">
                <Zap className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            {loading ? (
              <div className="h-8 w-12 animate-pulse rounded bg-muted" />
            ) : (
              <span className="text-3xl font-black tracking-tight">{runningOrders}</span>
            )}
            <span className="text-sm font-medium text-muted-foreground">{t("orders.status.running")}</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">{t("stats.activeInstances.pending", { count: pendingPayOrders })}</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t("stats.teamMembers.title")}</h3>
            <div className="rounded-full bg-indigo-500/10 p-2">
              <Users className="h-4 w-4 text-indigo-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            {loading ? (
              <div className="h-8 w-12 animate-pulse rounded bg-muted" />
            ) : (
              <span className="text-3xl font-black tracking-tight">{data?.teamSummary.totalTeamCount ?? 0}</span>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">{t("stats.teamMembers.direct", { count: data?.teamSummary.directTeamCount ?? 0 })}</span>
          </div>
        </div>
      </div>

      {/* CHARTS & HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-foreground">{t("profitTrend.title")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("profitTrend.description")}</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-xs text-muted-foreground">
              <Link href="/dashboard/profits">{t("profitTrend.details")} <ChevronRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="h-[280px] w-full">
            {chartReady ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={trend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
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
                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, t("quickActions.profits")]}
                    labelStyle={{ color: "hsl(var(--ui-muted-foreground))", marginBottom: 4 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fill="url(#profitFill)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex-1 flex flex-col">
            <h3 className="text-base font-bold text-foreground mb-4">{t("health.title")}</h3>
            <div className="flex-1 flex flex-col justify-center items-center text-center p-4 border border-dashed border-border rounded-xl bg-muted/20">
              <div className="relative mb-4">
                {runningOrders > 0 ? (
                  <>
                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <Activity className="h-6 w-6 text-emerald-500" />
                    </div>
                  </>
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border border-border">
                    <Activity className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <h4 className="font-semibold text-foreground">
                {runningOrders > 0 ? t("health.title") : t("health.emptyTitle")}
              </h4>
              <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
                {runningOrders > 0 
                  ? t("health.desc") 
                  : t("health.emptyDesc")}
              </p>
            </div>
            <Button asChild className="w-full mt-4">
              <Link href="/dashboard/api"><KeyRound className="mr-2 h-4 w-4" />{t("apiStatus.cta")}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-4">{t("quickActions.title")}</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm"
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110", item.bg)}>
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              <span className="text-xs font-semibold text-foreground">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* COMPUTE MONITORING (INSTANCES) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mt-8">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            {t("orders.monitor")}
          </h3>
          <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <Link href="/dashboard/orders">{t("orders.viewAll")} <ChevronRight className="ml-1 h-3 w-3" /></Link>
          </Button>
        </div>

        {loading && (data?.orders.length ?? 0) === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
          </div>
        ) : (data?.orders.length ?? 0) === 0 ? (
          <div className="border border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center bg-card/30">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
              <Zap className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h4 className="text-base font-semibold text-foreground mb-1">{t("orders.emptyTitle")}</h4>
            <p className="text-sm text-muted-foreground mb-6">{t("orders.emptyDescription")}</p>
            <Button asChild>
              <Link href="/dashboard/products">
                <PackagePlus className="mr-2 h-4 w-4" /> {t("orders.deploy")}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.orders.map((order) => (
              <div key={order.orderNo} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <Terminal className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold leading-none">{order.productNameSnapshot}</h4>
                        <span className="text-[10px] text-muted-foreground">{order.aiModelNameSnapshot}</span>
                      </div>
                    </div>
                    <StatusBadge status={order.orderStatus} className="px-2 py-0 text-[9px] font-bold uppercase" />
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground mb-4 opacity-70">
                    ID: {order.orderNo}
                  </div>
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">{t("orders.currentCost")}</span>
                    <MoneyText value={order.orderAmount} className="font-bold text-foreground" />
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8" asChild>
                     <Link href="/dashboard/orders">{t("orders.details")}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
