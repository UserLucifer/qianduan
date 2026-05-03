"use client";

import { useCallback, useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  ExternalLink,
  ShieldCheck,
  UserPlus,
  Users,
  Wallet,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { getAdminDashboardBundle } from "@/api/admin";
import { formatMoney, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

import { useSysConfig } from "@/app/contexts/SysConfigContext";

export default function AdminDashboardPage() {
  const loader = useCallback(() => getAdminDashboardBundle(), []);
  const { data, loading, error, reload } = useAsyncResource(loader);
  const { getConfig } = useSysConfig();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const orderStructure = [
    { name: "进行中", value: data?.orders.runningOrderCount ?? 0 },
    { name: "待支付", value: data?.orders.pendingPayOrderCount ?? 0 },
    { name: "异常", value: data?.orders.abnormalOrderCount ?? 0 },
    { name: "已完成", value: data?.orders.completedOrderCount ?? 0 },
  ];
  const userStructure = [
    { name: "总用户", value: data?.users.totalUserCount ?? 0 },
    { name: "新增", value: data?.users.todayNewUserCount ?? 0 },
    { name: "活跃", value: data?.users.activeUserCount ?? 0 },
    { name: "禁用", value: data?.users.disabledUserCount ?? 0 },
  ];

  return (
    <div className="min-h-screen space-y-6 pb-12">
      <PageHeader
        eyebrow="PLATFORM ANALYTICS"
        title="数据概览"
        description="实时监控平台核心运营指标、财务状况及系统负载。"
        actions={
          <Button
            type="button"
            variant="outline"
            className="h-10 border-slate-200 bg-white shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.08]"
            onClick={() => void reload()}
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
            刷新看板
          </Button>
        }
      />

      {error ? (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      ) : null}

      {/* Top Integrated Stats Panel */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Users Card */}
        <DashboardCard
          title="用户规模"
          value={formatNumber(data?.users.totalUserCount)}
          subtitle={
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span className="font-semibold">{data?.users?.todayNewUserCount ?? 0}</span>
              <span>今日新增</span>
            </div>
          }
          icon={Users}
          iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
          loading={loading}
        />

        {/* Orders Card */}
        <DashboardCard
          title="业务订单"
          value={formatNumber(data?.orders.totalOrderCount)}
          subtitle={
            <div className={cn(
              "flex items-center gap-1.5",
              (data?.orders?.abnormalOrderCount ?? 0) > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
            )}>
              <span className="font-semibold">{data?.orders?.abnormalOrderCount ?? 0}</span>
              <span>异常订单</span>
            </div>
          }
          icon={ClipboardList}
          iconClassName="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          loading={loading}
        />

        {/* Finance Card */}
        <DashboardCard
          title="累计收益"
          value={formatMoney(data?.finance.totalProfitAmount)}
          subtitle={
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
              <Banknote className="h-3.5 w-3.5" />
              <span>流水：{formatMoney(data?.finance?.totalRechargeAmount)}</span>
            </div>
          }
          icon={CircleDollarSign}
          iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          loading={loading}
        />

        {/* System Status Card */}
        <Card className="rounded-xl border-none bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all dark:bg-white/[0.035] dark:ring-white/10">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">系统运行状态</p>
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/[0.03]">
              <ShieldCheck className="h-5 w-5 text-slate-400 dark:text-zinc-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                  getConfig("SYSTEM_STATUS", data?.overview.systemStatus) === "ABNORMAL" ? "bg-rose-400" : "bg-emerald-400"
                )}></span>
                <span className={cn(
                  "relative inline-flex h-3 w-3 rounded-full",
                  getConfig("SYSTEM_STATUS", data?.overview.systemStatus) === "ABNORMAL" ? "bg-rose-500" : "bg-emerald-500"
                )}></span>
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                {getConfig("SYSTEM_STATUS", data?.overview.systemStatus) === "ABNORMAL" ? "服务运行异常" : "所有服务运行正常"}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-500">
              核心组件健康度：100%
            </p>
          </div>
        </Card>
      </section>

      {/* Main Grid Content */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Pending Tasks Panel */}
        <Card className="rounded-xl border-none bg-white shadow-sm ring-1 ring-slate-200 dark:bg-white/[0.035] dark:ring-white/10 xl:col-span-4">
          <CardHeader className="border-b border-slate-100 p-6 dark:border-white/5">
            <CardTitle className="text-sm font-bold tracking-tight text-slate-900 dark:text-zinc-50">待处理事项</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            <PendingItem label="待审核充值" value={data?.finance.pendingRechargeCount ?? 0} href="/admins/recharge" color="blue" />
            <PendingItem label="待审核提现" value={data?.finance.pendingWithdrawCount ?? 0} href="/admins/withdraw" color="amber" />
            <PendingItem label="待打款提现" value={data?.finance.pendingPaidWithdrawCount ?? 0} href="/admins/withdraw" color="purple" />
            <PendingItem label="异常订单待排查" value={data?.orders.abnormalOrderCount ?? 0} href="/admins/orders" color="rose" />
          </CardContent>
        </Card>

        {/* Financial Details Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-8">
          <DashboardCard
            title="充值总额"
            value={formatMoney(data?.finance.totalRechargeAmount)}
            icon={Wallet}
            iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
            loading={loading}
          />
          <DashboardCard
            title="提现总额"
            value={formatMoney(data?.finance.totalWithdrawAmount)}
            icon={Banknote}
            iconClassName="bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-zinc-400"
            loading={loading}
          />
          <DashboardCard
            title="累计收益"
            value={formatMoney(data?.finance.totalProfitAmount)}
            icon={CircleDollarSign}
            iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            loading={loading}
          />
          <DashboardCard
            title="分销佣金支出"
            value={formatMoney(data?.finance.totalCommissionAmount)}
            icon={AlertTriangle}
            iconClassName="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
            loading={loading}
          />
        </div>
      </section>

      {/* Visual Analytics */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="算力租赁订单分布" eyebrow="Order Structure">
          {mounted ? <OverviewBarChart data={orderStructure} fill="#5e6ad2" /> : <ChartSkeleton />}
        </ChartCard>

        <ChartCard title="平台用户类型占比" eyebrow="User Structure">
          {mounted ? <OverviewBarChart data={userStructure} fill="#8b93ff" /> : <ChartSkeleton />}
        </ChartCard>
      </section>
    </div>
  );
}

function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconClassName, 
  loading 
}: { 
  title: string; 
  value: string | number | undefined; 
  subtitle?: ReactNode; 
  icon: LucideIcon;
  iconClassName?: string;
  loading?: boolean;
}) {
  return (
    <Card className="rounded-xl border-none bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:ring-blue-500/30 dark:bg-white/[0.035] dark:ring-white/10 dark:hover:ring-blue-400/30">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">{title}</p>
        <div className={cn("rounded-lg p-2 transition-transform group-hover:scale-110", iconClassName)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded bg-slate-100 dark:bg-white/5" />
        ) : (
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">{value}</h3>
        )}
        {subtitle && <div className="mt-2 text-xs">{subtitle}</div>}
      </div>
    </Card>
  );
}

function PendingItem({ label, value, href, color }: { label: string; value: number; href: string; color: string }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20 dark:hover:bg-blue-500/20",
    amber: "bg-amber-50 text-amber-700 ring-amber-100 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20 dark:hover:bg-amber-500/20",
    rose: "bg-rose-50 text-rose-700 ring-rose-100 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20 dark:hover:bg-rose-500/20",
    purple: "bg-purple-50 text-purple-700 ring-purple-100 hover:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20 dark:hover:bg-purple-500/20",
  };

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium ring-1 transition-all",
        colors[color as keyof typeof colors]
      )}
    >
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-base font-bold">{formatNumber(value)}</span>
        <ExternalLink className="h-3.5 w-3.5 opacity-50" />
      </div>
    </Link>
  );
}

function ChartCard({ title, eyebrow, children }: { title: string; eyebrow?: string; children: ReactNode }) {
  return (
    <Card className="rounded-xl border-none bg-white shadow-sm ring-1 ring-slate-200 dark:bg-white/[0.035] dark:ring-white/10">
      <CardHeader className="border-b border-slate-50 p-6 dark:border-white/5">
        <div className="flex flex-col gap-0.5">
          {eyebrow && <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">{eyebrow}</p>}
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-zinc-50">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="h-80 min-h-[320px] p-6">
        {children}
      </CardContent>
    </Card>
  );
}

function OverviewBarChart({ data, fill }: { data: Array<{ name: string; value: number }>; fill: string }) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dy={10} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            allowDecimals={false} 
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
            contentStyle={{ 
              backgroundColor: '#fff',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              fontSize: '12px',
              padding: '12px'
            }} 
          />
          <Bar dataKey="value" fill={fill} radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartSkeleton() {
  return <div className="h-full w-full animate-pulse rounded-xl bg-slate-50 dark:bg-white/5" />;
}
