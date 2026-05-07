"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Bell,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  PackagePlus,
  ReceiptText,
  Send,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { BentoCard, BentoGrid } from "@/components/shared/BentoGrid";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Terminal, Loader2 } from "lucide-react";
import { getCommissionSummary } from "@/api/commission";
import { getProfitRecords, getProfitSummary } from "@/api/profit";
import { getRentalOrders } from "@/api/rental";
import { getTeamSummary } from "@/api/team";
import { getUserNotifications } from "@/api/notification";
import { getTransactions } from "@/api/wallet";
import type {
  CommissionSummaryResponse,
  ProfitRecordResponse,
  ProfitSummaryResponse,
  RentalOrderSummaryResponse,
  SysNotification,
  TeamSummaryResponse,
  WalletMeResponse,
  WalletTransactionResponse,
} from "@/api/types";
import { getWalletInfo } from "@/api/wallet";
import { bizTypeLabel, txTypeLabel } from "@/lib/status";
import { formatDate, formatMoney } from "@/lib/format";

interface DashboardData {
  wallet: WalletMeResponse;
  orders: RentalOrderSummaryResponse[];
  transactions: WalletTransactionResponse[];
  profitSummary: ProfitSummaryResponse;
  profitRecords: ProfitRecordResponse[];
  commissionSummary: CommissionSummaryResponse;
  teamSummary: TeamSummaryResponse;
  notifications: SysNotification[];
}

interface TrendPoint {
  date: string;
  profit: number;
}

function buildProfitTrend(records: ProfitRecordResponse[]): TrendPoint[] {
  // The backend does not expose a trend endpoint yet, so the overview aggregates recent profit records by date.
  const grouped = new Map<string, number>();
  records.forEach((record) => {
    const key = formatDate(record.profitDate);
    grouped.set(key, (grouped.get(key) ?? 0) + record.finalProfitAmount);
  });
  return Array.from(grouped.entries())
    .map(([date, profit]) => ({ date, profit }))
    .slice(-7);
}

export default function DashboardPage() {
  const t = useTranslations("DashboardHome");
  const statusT = useTranslations("Status");
  const [chartReady, setChartReady] = useState(false);
  const loader = useCallback(async (): Promise<DashboardData> => {
    const [
      wallet,
      orders,
      transactions,
      profitSummary,
      profitRecords,
      commissionSummary,
      teamSummary,
      notifications,
    ] = await Promise.all([
      getWalletInfo(),
      getRentalOrders({ pageNo: 1, pageSize: 5 }),
      getTransactions({ pageNo: 1, pageSize: 5 }),
      getProfitSummary(),
      getProfitRecords({ pageNo: 1, pageSize: 30 }),
      getCommissionSummary(),
      getTeamSummary(),
      getUserNotifications({ pageNo: 1, pageSize: 5 }),
    ]);

    return {
      wallet: wallet.data,
      orders: orders.data.records,
      transactions: transactions.data.records,
      profitSummary: profitSummary.data,
      profitRecords: profitRecords.data.records,
      commissionSummary: commissionSummary.data,
      teamSummary: teamSummary.data,
      notifications: notifications.data.records,
    };
  }, []);

  const { data, loading, error, reload } = useAsyncResource(loader);
  const trend = buildProfitTrend(data?.profitRecords ?? []);
  const runningOrders = data?.orders.filter((order) => order.orderStatus === "RUNNING").length ?? 0;
  const pendingPayOrders = data?.orders.filter((order) => order.orderStatus === "PENDING_PAY" || order.orderStatus === "PENDING_PAYMENT").length ?? 0;
  const transactionColumns: DataTableColumn<WalletTransactionResponse>[] = [
    {
      key: "txType",
      title: t("transactions.columns.type"),
      render: (row) => <StatusBadge status={row.txType} label={txTypeLabel(row.txType, statusT)} />,
    },
    {
      key: "amount",
      title: t("transactions.columns.amount"),
      render: (row) => (
        <MoneyText value={row.amount} signed={row.txType === "IN" || row.txType === "UNFREEZE"} />
      ),
    },
    {
      key: "bizType",
      title: t("transactions.columns.business"),
      render: (row) => <span>{bizTypeLabel(row.bizType, statusT)}</span>,
    },
    {
      key: "createdAt",
      title: t("transactions.columns.time"),
      render: (row) => <DateTimeText value={row.createdAt} />,
    },
  ];
  const quickActions = [
    { label: t("quickActions.rentGpu"), href: "/dashboard/products", icon: PackagePlus },
    { label: t("quickActions.recharge"), href: "/dashboard/recharge", icon: CreditCard },
    { label: t("quickActions.withdraw"), href: "/dashboard/withdraw", icon: Send },
    { label: t("quickActions.apiCredentials"), href: "/dashboard/api", icon: KeyRound },
    { label: t("quickActions.profits"), href: "/dashboard/profits", icon: TrendingUp },
    { label: t("quickActions.team"), href: "/dashboard/team", icon: Users },
  ];

  useEffect(() => {
    setChartReady(true);
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t("header.eyebrow")}
        title={t("header.title")}
        description={t("header.description")}
        actions={
          <Button onClick={() => void reload()} variant="outline">
            {t("header.refresh")}
          </Button>
        }
      />

      {error ? (
        <ErrorAlert message={error}>
          <Button variant="destructive" className="ml-3 h-8" onClick={() => void reload()}>
            {t("common.retry")}
          </Button>
        </ErrorAlert>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("stats.walletTotal.title")}</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">
              {loading ? (
                <div className="h-9 w-24 animate-pulse rounded bg-muted" />
              ) : (
                <MoneyText value={(data?.wallet.availableBalance ?? 0) + (data?.wallet.frozenBalance ?? 0)} />
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-wider">
              {t("stats.walletTotal.description")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("stats.activeInstances.title")}</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">
              {loading ? (
                <div className="h-9 w-12 animate-pulse rounded bg-muted" />
              ) : (
                runningOrders
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-wider">
              {t("stats.activeInstances.pending", { count: pendingPayOrders })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("stats.todayProfit.title")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter text-emerald-500">
              {loading ? (
                <div className="h-9 w-24 animate-pulse rounded bg-muted" />
              ) : (
                <MoneyText value={data?.profitSummary.todayProfit} />
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-wider">
              {t("stats.todayProfit.total", { amount: formatMoney(data?.profitSummary.totalProfit ?? 0) })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("stats.teamMembers.title")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter">
              {loading ? (
                <div className="h-9 w-12 animate-pulse rounded bg-muted" />
              ) : (
                data?.teamSummary.totalTeamCount ?? 0
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-wider">
              {t("stats.teamMembers.direct", { count: data?.teamSummary.directTeamCount ?? 0 })}
            </p>
          </CardContent>
        </Card>
      </div>

      <BentoGrid>

        <BentoCard title={t("assets.title")} description={t("assets.description")} className="lg:col-span-4" contentClassName="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="text-xs text-muted-foreground">{t("assets.availableBalance")}</div>
              <div className="mt-2 text-xl font-medium text-foreground"><MoneyText value={data?.wallet.availableBalance} /></div>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="text-xs text-muted-foreground">{t("assets.frozenBalance")}</div>
              <div className="mt-2 text-xl font-medium text-foreground"><MoneyText value={data?.wallet.frozenBalance} /></div>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="text-xs text-muted-foreground">{t("assets.totalRecharge")}</div>
              <div className="mt-2 text-sm font-medium text-foreground"><MoneyText value={data?.wallet.totalRecharge} /></div>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="text-xs text-muted-foreground">{t("assets.totalWithdraw")}</div>
              <div className="mt-2 text-sm font-medium text-foreground"><MoneyText value={data?.wallet.totalWithdraw} /></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild><Link href="/dashboard/recharge"><CreditCard className="h-4 w-4" />{t("assets.actions.recharge")}</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard/withdraw"><Send className="h-4 w-4" />{t("assets.actions.withdraw")}</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard/wallet"><ReceiptText className="h-4 w-4" />{t("assets.actions.transactions")}</Link></Button>
          </div>
        </BentoCard>

        <BentoCard title={t("apiStatus.title")} description={t("apiStatus.description")} className="lg:col-span-3" contentClassName="space-y-5">
          <StatusIndicator status={runningOrders > 0 ? "ACTIVE" : "INACTIVE"} label={runningOrders > 0 ? t("apiStatus.active") : t("apiStatus.inactive")} pulse={runningOrders > 0} />
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <div className="text-xs text-muted-foreground">{t("apiStatus.suggestionLabel")}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("apiStatus.suggestion")}
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/dashboard/api"><KeyRound className="h-4 w-4" />{t("apiStatus.cta")}</Link>
          </Button>
        </BentoCard>

        <BentoCard title={t("profitTrend.title")} description={t("profitTrend.description")} className="lg:col-span-5">
          <div className="h-64">
            {chartReady ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--ui-primary))" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(var(--ui-primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--ui-border))" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--ui-muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--ui-muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--ui-popover))", border: "1px solid hsl(var(--ui-border))", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="profit" stroke="hsl(var(--ui-primary))" fill="url(#profitFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </BentoCard>

        <BentoCard title={t("quickActions.title")} className="lg:col-span-12">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {quickActions.map((item) => (
              <Button key={item.href} asChild variant="outline" className="h-12 justify-start bg-muted/40">
                <Link href={item.href}><item.icon className="h-4 w-4" />{item.label}</Link>
              </Button>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>

      <div className="space-y-4">
        <div className="flex items-center justify-between mt-10 mb-4">
          <h3 className="text-lg font-medium tracking-tight">{t("orders.title")}</h3>
          <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
            <Link href="/dashboard/orders">{t("orders.viewAll")}</Link>
          </Button>
        </div>

        {loading && (data?.orders.length ?? 0) === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground font-medium">{t("orders.loading")}</p>
          </div>
        ) : (data?.orders.length ?? 0) === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-16 flex flex-col items-center justify-center bg-muted/5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/30 mb-6">
              <Zap className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h4 className="text-base font-semibold text-foreground mb-2">{t("orders.emptyTitle")}</h4>
            <p className="text-sm text-muted-foreground mb-8 max-w-xs text-center">
              {t("orders.emptyDescription")}
            </p>
            <Button asChild variant="outline" className="rounded-full px-8">
              <Link href="/dashboard/products">
                <PackagePlus className="mr-2 h-4 w-4" /> {t("orders.deploy")}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("orders.columns.instance")}</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("orders.columns.plan")}</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("orders.columns.status")}</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">{t("orders.columns.cost")}</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.orders.map((order) => (
                  <TableRow key={order.orderNo} className="group hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="font-bold text-sm tracking-tight">{order.productNameSnapshot}</span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">ID: {order.orderNo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-xs font-semibold">{order.aiModelNameSnapshot}</span>
                        <span className="text-[10px] text-muted-foreground">{order.machineAliasSnapshot || t("orders.autoAssigned")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn(
                        "font-bold uppercase text-[10px] px-2 py-0.5",
                        order.orderStatus === "RUNNING" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground"
                      )}>
                        {order.orderStatus === "RUNNING" && <span className="mr-1.5 h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />}
                        {order.orderStatus === "RUNNING" ? t("orders.status.running") : order.orderStatus === "PENDING_PAY" ? t("orders.status.pendingPay") : t("orders.status.settled")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-black">
                      <MoneyText value={order.orderAmount} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("orders.menu.label")}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard/orders" className="flex w-full items-center">
                              <LayoutDashboard className="mr-2 h-4 w-4" /> {t("orders.menu.manage")}
                            </Link>
                          </DropdownMenuItem>
                          {order.orderStatus === "RUNNING" && (
                            <DropdownMenuItem className="text-primary font-bold">
                              <Terminal className="mr-2 h-4 w-4" /> {t("orders.menu.console")}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 mt-12">
        <BentoCard title={t("transactions.title")} description={t("transactions.description")}>
          <DataTable columns={transactionColumns} data={data?.transactions ?? []} rowKey={(row) => row.txNo} loading={loading} emptyText={t("transactions.empty")} />
        </BentoCard>
        <BentoCard title={t("notifications.title")} description={t("notifications.description")}>
          <div className="space-y-3">
            {(data?.notifications ?? []).map((notice) => (
              <Link key={notice.id} href="/dashboard/notifications" className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition hover:bg-muted/50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground leading-none">{notice.title}</p>
                    <p className="mt-1 truncate text-[10px] text-muted-foreground">{notice.content}</p>
                  </div>
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap ml-4"><DateTimeText value={notice.createdAt} /></span>
              </Link>
            ))}
            {!loading && (data?.notifications.length ?? 0) === 0 ? (
              <div className="p-4 text-xs text-center text-muted-foreground">{t("notifications.empty")}</div>
            ) : null}
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
