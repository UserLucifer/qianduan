"use client";

import { useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  CreditCard,
  KeyRound,
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
import { BentoCard, BentoGrid } from "@/components/shared/BentoGrid";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { useAsyncResource } from "@/hooks/useAsyncResource";
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

const orderColumns: DataTableColumn<RentalOrderSummaryResponse>[] = [
  {
    key: "orderNo",
    title: "订单号",
    render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.orderNo}</span>,
  },
  {
    key: "productNameSnapshot",
    title: "算力产品",
    render: (row) => (
      <div>
        <div className="font-medium text-zinc-100">{row.productNameSnapshot}</div>
        <div className="text-xs text-zinc-500">{row.machineAliasSnapshot || row.machineCodeSnapshot}</div>
      </div>
    ),
  },
  { key: "orderAmount", title: "金额", render: (row) => <MoneyText value={row.orderAmount} /> },
  { key: "orderStatus", title: "订单状态", render: (row) => <StatusBadge status={row.orderStatus} /> },
  { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={row.createdAt} /> },
];

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

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="用户后台"
        title="算力与资产控制台"
        description="聚合钱包余额、租赁订单、API 激活、收益、佣金、团队和最近通知，优先呈现可执行事项。"
        actions={
          <Button onClick={() => void reload()} variant="outline" className="border-gray-200 bg-white text-slate-600 hover:bg-gray-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-muted-foreground dark:hover:bg-white/[0.06]">
            刷新数据
          </Button>
        }
      />

      {error ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
          {error}
          <Button className="ml-3 h-8 bg-rose-400 text-black hover:bg-rose-300" onClick={() => void reload()}>
            重试
          </Button>
        </div>
      ) : null}

      <BentoGrid>
        <StatsCard
          className="lg:col-span-3"
          title="钱包余额"
          value={<MoneyText value={(data?.wallet.availableBalance ?? 0) + (data?.wallet.frozenBalance ?? 0)} />}
          description="可用 + 冻结"
          icon={Wallet}
          loading={loading}
        />
        <StatsCard
          className="lg:col-span-3"
          title="有效租赁"
          value={runningOrders}
          description={`${pendingPayOrders} 个待支付订单`}
          icon={Zap}
          loading={loading}
          status={runningOrders > 0 ? "good" : "neutral"}
        />
        <StatsCard
          className="lg:col-span-3"
          title="今日收益"
          value={<MoneyText value={data?.profitSummary.todayProfit} />}
          description={`累计 ${formatMoney(data?.profitSummary.totalProfit ?? 0)}`}
          icon={TrendingUp}
          loading={loading}
          status="good"
        />
        <StatsCard
          className="lg:col-span-3"
          title="团队人数"
          value={data?.teamSummary.totalTeamCount ?? 0}
          description={`直属 ${data?.teamSummary.directTeamCount ?? 0} 人`}
          icon={Users}
          loading={loading}
        />

        <BentoCard title="资产中心" description="余额、冻结金额与资金流向" className="lg:col-span-4" contentClassName="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="text-xs text-slate-500 dark:text-zinc-500">可用余额</div>
              <div className="mt-2 text-xl font-medium text-slate-900 dark:text-zinc-50"><MoneyText value={data?.wallet.availableBalance} /></div>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="text-xs text-slate-500 dark:text-zinc-500">冻结金额</div>
              <div className="mt-2 text-xl font-medium text-slate-900 dark:text-zinc-50"><MoneyText value={data?.wallet.frozenBalance} /></div>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="text-xs text-slate-500 dark:text-zinc-500">累计充值</div>
              <div className="mt-2 text-sm font-medium text-slate-700 dark:text-zinc-200"><MoneyText value={data?.wallet.totalRecharge} /></div>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="text-xs text-slate-500 dark:text-zinc-500">累计提现</div>
              <div className="mt-2 text-sm font-medium text-slate-700 dark:text-zinc-200"><MoneyText value={data?.wallet.totalWithdraw} /></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="bg-[#5e6ad2] text-white hover:bg-[#7170ff] dark:bg-[#5e6ad2] dark:hover:bg-[#7170ff]"><Link href="/dashboard/recharge"><CreditCard className="h-4 w-4" />充值</Link></Button>
            <Button asChild variant="outline" className="border-gray-200 bg-white text-slate-600 hover:bg-gray-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-muted-foreground dark:hover:bg-white/[0.06]"><Link href="/dashboard/withdraw"><Send className="h-4 w-4" />提现</Link></Button>
            <Button asChild variant="outline" className="border-gray-200 bg-white text-slate-600 hover:bg-gray-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-muted-foreground dark:hover:bg-white/[0.06]"><Link href="/dashboard/wallet"><ReceiptText className="h-4 w-4" />流水</Link></Button>
          </div>
        </BentoCard>

        <BentoCard title="API 状态" description="凭证与部署入口" className="lg:col-span-3" contentClassName="space-y-5">
          <StatusIndicator status={runningOrders > 0 ? "ACTIVE" : "INACTIVE"} label={runningOrders > 0 ? "存在可激活订单" : "暂无运行中订单"} pulse={runningOrders > 0} />
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="text-xs text-slate-500 dark:text-zinc-500">建议操作</div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-muted-foreground">
              进入 API 管理页查看订单关联凭证、部署状态和 Token 到期时间。敏感字段默认脱敏。
            </p>
          </div>
          <Button asChild className="w-full bg-white text-black hover:bg-zinc-200">
            <Link href="/dashboard/api"><KeyRound className="h-4 w-4" />查看 API 凭证</Link>
          </Button>
        </BentoCard>

        <BentoCard title="收益趋势" description="基于收益记录按日期聚合" className="lg:col-span-5">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5e6ad2" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#5e6ad2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#8a8f98", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8a8f98", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="profit" stroke="#9aa2ff" fill="url(#profitFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
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
              <Button key={item.href} asChild variant="outline" className="h-12 justify-start border-gray-200 bg-white text-slate-600 hover:bg-gray-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-muted-foreground dark:hover:bg-white/[0.06]">
                <Link href={item.href}><item.icon className="h-4 w-4" />{item.label}</Link>
              </Button>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <BentoCard title="最近租赁订单" description="展示最新 5 条订单">
          <DataTable columns={orderColumns} data={data?.orders ?? []} rowKey={(row) => row.orderNo} loading={loading} emptyText="暂无租赁订单，先去算力市场选择 GPU 产品。" />
        </BentoCard>
        <BentoCard title="最近资金流水" description="展示最新 5 条钱包流水">
          <DataTable columns={transactionColumns} data={data?.transactions ?? []} rowKey={(row) => row.txNo} loading={loading} emptyText="暂无资金流水。" />
        </BentoCard>
      </div>

      <BentoCard title="最新通知" description="系统、订单、财务、收益相关通知">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {(data?.notifications ?? []).map((notice) => (
            <Link key={notice.id} href="/dashboard/notifications" className="rounded-lg border border-gray-100 bg-white p-4 transition hover:border-gray-200 hover:bg-gray-50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20 dark:hover:bg-white/[0.05]">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-slate-900 dark:text-zinc-100">{notice.title}</span>
                <Bell className="h-4 w-4 shrink-0 text-blue-600 dark:text-[#9aa2ff]" />
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-zinc-500">{notice.content}</p>
              <div className="mt-3"><DateTimeText value={notice.createdAt} /></div>
            </Link>
          ))}
          {!loading && (data?.notifications.length ?? 0) === 0 ? (
            <div className="col-span-full rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-500">暂无通知。</div>
          ) : null}
        </div>
      </BentoCard>
    </div>
  );
}
