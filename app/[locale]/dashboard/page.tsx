"use client";

import { useCallback, useEffect, useState } from "react";
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

// orderColumns refactored to Table in component body

const transactionColumns: DataTableColumn<WalletTransactionResponse>[] = [
  { key: "txType", title: "类型", render: (row) => <StatusBadge status={row.txType} label={txTypeLabel(row.txType)} /> },
  { key: "amount", title: "金额", render: (row) => <MoneyText value={row.amount} signed={row.txType === "IN" || row.txType === "UNFREEZE"} /> },
  { key: "bizType", title: "业务", render: (row) => <span>{bizTypeLabel(row.bizType)}</span> },
  { key: "createdAt", title: "时间", render: (row) => <DateTimeText value={row.createdAt} /> },
];

function buildProfitTrend(records: ProfitRecordResponse[]): TrendPoint[] {
  // 后端暂无趋势接口，这里只基于收益记录列表按日期轻量聚合，用于首页趋势概览。
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

  useEffect(() => {
    setChartReady(true);
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="用户后台"
        title="算力与资产控制台"
        description="聚合钱包余额、租赁订单、API 激活、收益、佣金、团队和最近通知，优先呈现可执行事项。"
        actions={
          <Button onClick={() => void reload()} variant="outline">
            刷新数据
          </Button>
        }
      />

      {error ? (
        <ErrorAlert message={error}>
          <Button variant="destructive" className="ml-3 h-8" onClick={() => void reload()}>
            重试
          </Button>
        </ErrorAlert>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">钱包总余额</CardTitle>
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
              可用 + 冻结余额
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">有效租赁实例</CardTitle>
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
              {pendingPayOrders} 个待支付订单
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">今日预计收益</CardTitle>
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
              累计收益: {formatMoney(data?.profitSummary.totalProfit ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">团队成员</CardTitle>
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
              直属邀请: {data?.teamSummary.directTeamCount ?? 0} 人
            </p>
          </CardContent>
        </Card>
      </div>

      <BentoGrid>

        <BentoCard title="资产中心" description="余额、冻结金额与资金流向" className="lg:col-span-4" contentClassName="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="text-xs text-muted-foreground">可用余额</div>
              <div className="mt-2 text-xl font-medium text-foreground"><MoneyText value={data?.wallet.availableBalance} /></div>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="text-xs text-muted-foreground">冻结金额</div>
              <div className="mt-2 text-xl font-medium text-foreground"><MoneyText value={data?.wallet.frozenBalance} /></div>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="text-xs text-muted-foreground">累计充值</div>
              <div className="mt-2 text-sm font-medium text-foreground"><MoneyText value={data?.wallet.totalRecharge} /></div>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="text-xs text-muted-foreground">累计提现</div>
              <div className="mt-2 text-sm font-medium text-foreground"><MoneyText value={data?.wallet.totalWithdraw} /></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild><Link href="/dashboard/recharge"><CreditCard className="h-4 w-4" />充值</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard/withdraw"><Send className="h-4 w-4" />提现</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard/wallet"><ReceiptText className="h-4 w-4" />流水</Link></Button>
          </div>
        </BentoCard>

        <BentoCard title="API 状态" description="凭证与部署入口" className="lg:col-span-3" contentClassName="space-y-5">
          <StatusIndicator status={runningOrders > 0 ? "ACTIVE" : "INACTIVE"} label={runningOrders > 0 ? "存在可激活订单" : "暂无运行中订单"} pulse={runningOrders > 0} />
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <div className="text-xs text-muted-foreground">建议操作</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              进入 API 管理页查看订单关联凭证、部署状态和 Token 到期时间。敏感字段默认脱敏。
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/dashboard/api"><KeyRound className="h-4 w-4" />查看 API 凭证</Link>
          </Button>
        </BentoCard>

        <BentoCard title="收益趋势" description="基于收益记录按日期聚合" className="lg:col-span-5">
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

        <BentoCard title="快捷入口" className="lg:col-span-12">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {[
              { label: "租赁 GPU", href: "/dashboard/products", icon: PackagePlus },
              { label: "充值", href: "/dashboard/recharge", icon: CreditCard },
              { label: "提现", href: "/dashboard/withdraw", icon: Send },
              { label: "API 凭证", href: "/dashboard/api", icon: KeyRound },
              { label: "收益", href: "/dashboard/profits", icon: TrendingUp },
              { label: "团队", href: "/dashboard/team", icon: Users },
            ].map((item) => (
              <Button key={item.href} asChild variant="outline" className="h-12 justify-start bg-muted/40">
                <Link href={item.href}><item.icon className="h-4 w-4" />{item.label}</Link>
              </Button>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>

      <div className="space-y-4">
        <div className="flex items-center justify-between mt-10 mb-4">
          <h3 className="text-lg font-medium tracking-tight">最近算力实例</h3>
          <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
            <Link href="/dashboard/orders">查看全部订单</Link>
          </Button>
        </div>

        {loading && (data?.orders.length ?? 0) === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground font-medium">同步云端实例数据...</p>
          </div>
        ) : (data?.orders.length ?? 0) === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-16 flex flex-col items-center justify-center bg-muted/5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/30 mb-6">
              <Zap className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h4 className="text-base font-semibold text-foreground mb-2">没有任何运行中的实例</h4>
            <p className="text-sm text-muted-foreground mb-8 max-w-xs text-center">
              您当前没有活跃的算力资源。立即前往算力市场，选择最适合您 AI 任务的 GPU 节点。
            </p>
            <Button asChild variant="outline" className="rounded-full px-8">
              <Link href="/dashboard/products">
                <PackagePlus className="mr-2 h-4 w-4" /> 立即部署新实例
              </Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">实例名称</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">配置方案</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">运行状态</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">费用</TableHead>
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
                        <span className="text-[10px] text-muted-foreground">{order.machineAliasSnapshot || "自动分配"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn(
                        "font-bold uppercase text-[10px] px-2 py-0.5",
                        order.orderStatus === "RUNNING" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground"
                      )}>
                        {order.orderStatus === "RUNNING" && <span className="mr-1.5 h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />}
                        {order.orderStatus === "RUNNING" ? "运行中" : order.orderStatus === "PENDING_PAY" ? "待支付" : "已结算"}
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
                          <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">实例管理</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard/orders" className="flex w-full items-center">
                              <LayoutDashboard className="mr-2 h-4 w-4" /> 管理详情
                            </Link>
                          </DropdownMenuItem>
                          {order.orderStatus === "RUNNING" && (
                            <DropdownMenuItem className="text-primary font-bold">
                              <Terminal className="mr-2 h-4 w-4" /> 控制台交互
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
        <BentoCard title="最近资金流水" description="展示最新 5 条钱包流水">
          <DataTable columns={transactionColumns} data={data?.transactions ?? []} rowKey={(row) => row.txNo} loading={loading} emptyText="暂无资金流水。" />
        </BentoCard>
        <BentoCard title="最新通知" description="系统、订单与财务动态">
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
              <div className="p-4 text-xs text-center text-muted-foreground">暂无未读通知。</div>
            ) : null}
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
