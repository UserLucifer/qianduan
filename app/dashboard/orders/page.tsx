"use client";

import { useCallback, useMemo, useState } from "react";
import {
  AlertCircle,
  Clock,
  Cpu,
  CreditCard,
  Loader2,
  MapPin,
  Play,
  RefreshCcw,
  Zap,
  ChevronRight,
  Terminal,
  XCircle,
  Wallet,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { OrderTimeline } from "@/components/shared/OrderTimeline";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  cancelRentalOrder,
  getRentalOrderDetail,
  getRentalOrders,
  payRentalOrder,
  settleEarly
} from "@/api/rental";
import { getWalletInfo } from "@/api/wallet";
import type {
  PageResult,
  RentalOrderDetailResponse,
  RentalOrderQueryRequest,
  RentalOrderSummaryResponse,
  WalletMeResponse
} from "@/api/types";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { toErrorMessage } from "@/lib/format";
import { RentalOrderStatus } from "@/types/enums";
import { getStatusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";

const initialParams: RentalOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function DashboardOrdersPage() {
  const loader = useCallback(async (params: RentalOrderQueryRequest): Promise<PageResult<RentalOrderSummaryResponse>> => {
    const res = await getRentalOrders(params);
    return res.data;
  }, []);

  const { page, loading, updateParams, reload, changePage } = usePaginatedResource(loader, initialParams);
  const [activeTab, setActiveTab] = useState("ALL");
  
  const [detail, setDetail] = useState<RentalOrderDetailResponse | null>(null);
  const [payTarget, setPayTarget] = useState<RentalOrderSummaryResponse | null>(null);
  const [wallet, setWallet] = useState<WalletMeResponse | null>(null);
  const [paying, setPaying] = useState(false);
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success_anim" | "completed">("idle");

  // Simple local toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Tab Filtering Logic ---
  const handleTabChange = (val: string) => {
    setActiveTab(val);
    let status: string | undefined = undefined;
    
    // Map categories to individual backend status enums
    if (val === "IN_PROGRESS") status = RentalOrderStatus.RUNNING;
    if (val === "PENDING_PAY") status = RentalOrderStatus.PENDING_PAY;
    if (val === "FINISHED") status = RentalOrderStatus.SETTLED;
    
    updateParams({ ...initialParams, orderStatus: status });
  };

  // --- Handlers ---
  const openDetail = async (orderNo: string) => {
    try {
      const res = await getRentalOrderDetail(orderNo);
      setDetail(res.data);
    } catch (err) {
      showToast(toErrorMessage(err), "error");
    }
  };

  const openPayment = async (order: RentalOrderSummaryResponse) => {
    setPayTarget(order);
    setPaymentState("idle");
    try {
      const res = await getWalletInfo();
      setWallet(res.data);
    } catch (err) {
      showToast("获取余额失败", "error");
    }
  };

  const executePay = async () => {
    if (!payTarget) return;
    setPaying(true);
    setPaymentState("processing");
    try {
      await payRentalOrder(payTarget.orderNo);
      setPaymentState("success_anim");
      
      // Show success animation for 2 seconds before closing and reloading
      setTimeout(() => {
        setPaymentState("completed");
        setPayTarget(null);
        reload();
      }, 2000);
    } catch (err) {
      setPaymentState("idle");
      showToast(toErrorMessage(err), "error");
    } finally {
      setPaying(false);
    }
  };

  const runAction = async (action: () => Promise<any>, successMsg: string) => {
    try {
      await action();
      showToast(successMsg);
      reload();
    } catch (err) {
      showToast(toErrorMessage(err), "error");
    }
  };

  const detailSections: DetailSectionDef<RentalOrderDetailResponse>[] = [
    {
      title: "核心配置",
      fields: [
        { label: "订单号", render: (d: RentalOrderDetailResponse) => d.orderNo },
        { label: "算力型号", render: (d: RentalOrderDetailResponse) => d.gpuModelSnapshot },
        { label: "显存容量", render: (d: RentalOrderDetailResponse) => `${d.gpuMemorySnapshotGb} GB` },
        { label: "部署地区", render: (d: RentalOrderDetailResponse) => d.regionNameSnapshot },
        { label: "AI 模型", render: (d: RentalOrderDetailResponse) => d.aiModelNameSnapshot },
      ]
    },
    {
      title: "部署信息",
      fields: [
        { label: "机器编号", render: (d: RentalOrderDetailResponse) => d.machineAliasSnapshot || "分配中..." },
        { label: "日产 Token", render: (d: RentalOrderDetailResponse) => (d.tokenOutputPerDaySnapshot ?? 0).toLocaleString() },
        { label: "租赁周期", render: (d: RentalOrderDetailResponse) => `${d.cycleDaysSnapshot} 天` },
        { label: "过期时间", render: (d: RentalOrderDetailResponse) => <DateTimeText value={d.expiredAt} /> },
      ]
    },
    {
      title: "财务统计",
      fields: [
        { label: "订单总额", render: (d: RentalOrderDetailResponse) => <MoneyText value={d.orderAmount} /> },
        { label: "已支付金额", render: (d: RentalOrderDetailResponse) => <MoneyText value={d.paidAmount} /> },
        { label: "预计总收益", render: (d: RentalOrderDetailResponse) => <MoneyText value={d.expectedTotalProfit} /> },
        { label: "日均预计收益", render: (d: RentalOrderDetailResponse) => <MoneyText value={d.expectedDailyProfit} /> },
      ]
    },
    {
      title: "订单生命周期",
      fields: [
        { 
          label: "", 
          render: (d: RentalOrderDetailResponse) => (
            <div className="mt-2 w-full">
              <OrderTimeline data={d} />
            </div>
          ),
          fullWidth: true
        }
      ]
    }
  ];

  const insufficient = payTarget && wallet ? wallet.availableBalance < payTarget.orderAmount : false;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="租赁资产管理"
          description="管理您的算力资源并监控实时收益。"
        />
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-transparent h-auto p-0 gap-8 border-b rounded-none w-full justify-start overflow-x-auto no-scrollbar">
          <TabsTrigger value="ALL" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-transparent px-2 pb-3 font-bold text-muted-foreground data-[state=active]:text-foreground transition-all">全部</TabsTrigger>
          <TabsTrigger value="IN_PROGRESS" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-transparent px-2 pb-3 font-bold text-muted-foreground data-[state=active]:text-foreground transition-all">进行中</TabsTrigger>
          <TabsTrigger value="PENDING_PAY" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-transparent px-2 pb-3 font-bold text-muted-foreground data-[state=active]:text-foreground transition-all">待支付</TabsTrigger>
          <TabsTrigger value="FINISHED" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-transparent px-2 pb-3 font-bold text-muted-foreground data-[state=active]:text-foreground transition-all">已结束</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* List Content */}
      <div className="space-y-4">
        {loading && page.records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-brand" />
            <span className="text-sm text-muted-foreground">加载订单列表中...</span>
          </div>
        ) : page.records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 border rounded-2xl bg-muted/10">
            <CreditCard className="h-12 w-12 text-muted-foreground/50" />
            <span className="text-sm text-muted-foreground">暂无相关订单</span>
          </div>
        ) : (
          page.records.map((order) => (
            <OrderCard
              key={order.orderNo}
              order={order}
              onDetail={() => openDetail(order.orderNo)}
              onPay={() => openPayment(order)}
              onAction={runAction}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {page.total > page.pageSize && (
        <div className="flex justify-center pt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page.pageNo <= 1}
              onClick={() => changePage(page.pageNo - 1)}
            >
              上一页
            </Button>
            <span className="text-sm font-medium px-4">
              {page.pageNo} / {Math.ceil(page.total / page.pageSize)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page.pageNo >= Math.ceil(page.total / page.pageSize)}
              onClick={() => changePage(page.pageNo + 1)}
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      {/* --- Toast --- */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border ${
          toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 font-bold" : "bg-destructive/10 border-destructive/20 text-destructive font-bold"
        } animate-in fade-in slide-in-from-bottom-4`}>
          {toast.msg}
        </div>
      )}

      {/* --- Detail Drawer --- */}
      <DetailDrawer
        title="算力资产详情"
        open={!!detail}
        onClose={() => setDetail(null)}
        data={detail}
        sections={detailSections}
      >
        {detail?.orderStatus === RentalOrderStatus.RUNNING && (
          <div className="mt-6 flex flex-col gap-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">实时部署中</span>
              </div>
              <Button size="sm" className="h-8 bg-emerald-600 text-white hover:bg-emerald-700">
                控制台交互
              </Button>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {detail.machineAliasSnapshot}</div>
              <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> 部署于: {detail.regionNameSnapshot}</div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* --- Payment Modal --- */}
      <Dialog open={!!payTarget} onOpenChange={(o) => {
        if (paymentState === "processing" || paymentState === "success_anim") return;
        if (!o) setPayTarget(null);
      }}>
        <DialogContent className="max-w-md border-[var(--admin-border)] bg-[var(--admin-panel-strong)] p-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {paymentState === "success_anim" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center justify-center py-16 px-8 text-center space-y-6"
              >
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5, times: [0, 0.7, 1] }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10"
                  >
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-emerald-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-foreground">支付成功！</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    正在为您分配算力节点，请稍后...
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand font-bold animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  后台部署中
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="p-6 pb-4">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                      <CreditCard className="h-5 w-5 text-brand" /> 算力订单收银台
                    </DialogTitle>
                  </DialogHeader>
                  
                  {payTarget && (
                    <div className="space-y-6 py-4">
                      {/* Order Summary */}
                      <div className="text-center space-y-2 py-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">待支付金额</p>
                        <div className="flex items-baseline justify-center gap-1">
                          <MoneyText value={payTarget.orderAmount} className="text-4xl font-black tracking-tighter text-foreground" />
                          <span className="text-sm font-bold text-muted-foreground">USDT</span>
                        </div>
                        <div className="inline-flex items-center rounded-full bg-muted/50 px-3 py-1 text-[10px] font-mono text-muted-foreground border">
                          订单号: {payTarget.orderNo}
                        </div>
                      </div>

                      <div className="h-px bg-border/50" />

                      {/* Method Selection */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">选择支付方式</h3>
                        <div className="relative rounded-xl border-2 border-brand bg-brand/5 p-4 transition-all dark:bg-brand/10">
                          <div className="absolute right-3 top-3">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand">
                              <Zap className="h-3 w-3 text-white fill-current" />
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20 text-brand">
                              <Wallet className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">钱包余额支付</p>
                              <p className="text-[11px] text-muted-foreground">可用: <MoneyText value={wallet?.availableBalance ?? 0} className={cn(insufficient ? "text-destructive font-bold" : "font-medium")} /></p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {insufficient && (
                        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-[11px] text-destructive leading-relaxed font-bold">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          余额不足。请前往钱包页充值或选择其他支付方式。
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <DialogFooter className="bg-muted/30 p-6 flex items-center gap-3 sm:flex-row flex-col">
                  <Button 
                    variant="ghost" 
                    onClick={() => setPayTarget(null)} 
                    disabled={paymentState === "processing"} 
                    className="w-full sm:w-auto px-8 rounded-xl font-bold text-muted-foreground hover:text-foreground"
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={executePay} 
                    disabled={paymentState === "processing" || insufficient || !wallet}
                    className="flex-1 w-full h-11 bg-[#5e6ad2] hover:bg-[#4f59c1] text-white font-black rounded-xl text-sm shadow-md shadow-brand/20 transition-all active:scale-[0.98]"
                  >
                    {paymentState === "processing" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    确认支付并启动
                  </Button>
                </DialogFooter>
                <div className="bg-muted/30 pb-4 px-6">
                  <p className="text-[10px] text-center text-muted-foreground leading-tight">
                    请确保钱包余额充足，支付后算力将自动进入激活流程。
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Subcomponent: OrderCard ---

interface OrderCardProps {
  order: RentalOrderSummaryResponse;
  onDetail: () => void;
  onPay: () => void;
  onAction: (action: () => Promise<any>, msg: string) => void;
}

function OrderCard({ order, onDetail, onPay, onAction }: OrderCardProps) {
  const isRunning = order.orderStatus === RentalOrderStatus.RUNNING;
  const isPending = order.orderStatus === RentalOrderStatus.PENDING_PAY;

  // Progress Calculation
  const progress = useMemo(() => {
    if (!isRunning || !order.activatedAt) return 0;
    const start = new Date(order.activatedAt).getTime();
    const end = start + order.cycleDaysSnapshot * 86400 * 1000;
    const now = Date.now();
    if (now >= end) return 100;
    return Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
  }, [isRunning, order.activatedAt, order.cycleDaysSnapshot]);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-muted/60 dark:bg-zinc-900/40">
      {/* Card Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4 px-6 border-b bg-muted/5">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-base font-black tracking-tight flex items-center gap-2 uppercase">
            <Cpu className="h-4 w-4 text-brand" /> {order.productNameSnapshot}
          </CardTitle>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">ID: {order.orderNo}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={order.orderStatus} />
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <span className={cn("h-1 w-1 rounded-full", order.profitStatus === "RUNNING" ? "bg-emerald-500 animate-pulse" : "bg-zinc-400")} />
              收益: {getStatusMeta(order.profitStatus).label}
            </span>
            <span className="text-[9px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <span className={cn("h-1 w-1 rounded-full", order.settlementStatus === "SETTLED" ? "bg-brand" : "bg-zinc-400")} />
              结算: {getStatusMeta(order.settlementStatus).label}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Left: Specs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.1em]">AI 模型</p>
              <p className="text-xs font-bold truncate">{order.aiModelNameSnapshot}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.1em]">区域</p>
              <p className="text-xs font-bold flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.machineAliasSnapshot || "分配中"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="bg-muted/30 rounded-lg px-2 py-1 text-[10px] font-medium border">USDT 结算</div>
            <div className="bg-muted/30 rounded-lg px-2 py-1 text-[10px] font-medium border">独享资源</div>
          </div>
        </div>

        {/* Middle: Cycle & Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold text-muted-foreground uppercase">租赁周期</p>
              <p className="text-sm font-black">{order.cycleDaysSnapshot} 天</p>
            </div>
            {isRunning && (
              <p className="text-[10px] font-mono text-muted-foreground italic">已运行 {Math.round(progress)}%</p>
            )}
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000",
                isRunning ? "bg-brand" : "bg-muted-foreground/30"
              )} 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
            <span>开始: <DateTimeText value={order.activatedAt || order.createdAt} /></span>
            <span>结束: <DateTimeText value={order.profitEndAt} /></span>
          </div>
        </div>

        {/* Right: Earnings */}
        <div className="flex flex-col items-center md:items-end gap-1">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">预估总收益</p>
          <div className={cn(
            "text-2xl font-black tracking-tighter",
            isRunning ? "text-emerald-500" : "text-foreground"
          )}>
            <MoneyText value={order.expectedTotalProfit} />
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            日收益: <MoneyText value={order.expectedDailyProfit} />
          </p>
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="px-6 py-4 bg-muted/5 border-t flex justify-between items-center">
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium">
          <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" /> {order.orderAmount} USDT</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> <DateTimeText value={order.createdAt} /></span>
        </div>
        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="flex items-center gap-2">
              <ConfirmActionButton
                title="取消订单"
                description="确认要取消该笔租赁申请吗？"
                onConfirm={() => onAction(() => cancelRentalOrder(order.orderNo), "订单已取消")}
                variant="ghost"
                className="h-9 px-4 text-xs font-bold text-muted-foreground hover:text-destructive"
              >
                <XCircle className="mr-2 h-4 w-4" /> 取消
              </ConfirmActionButton>
              <Button 
                onClick={onPay}
                className="h-9 px-6 bg-[#5e6ad2] hover:bg-[#4f59c1] text-white font-bold rounded-xl text-xs shadow-md shadow-brand/20 transition-all active:scale-[0.95]"
              >
                <Zap className="mr-2 h-4 w-4" /> 立即支付
              </Button>
            </div>
          ) : isRunning ? (
            <div className="flex items-center gap-2">
              <ConfirmActionButton
                title="提前终止"
                description="提前终止将扣除剩余租期的违约金，确认继续？"
                onConfirm={() => onAction(() => settleEarly(order.orderNo), "已发起提前结算")}
                variant="ghost"
                className="h-9 px-4 text-xs font-bold text-muted-foreground hover:text-destructive"
              >
                <RefreshCcw className="mr-2 h-4 w-4" /> 提前终止
              </ConfirmActionButton>
              <Button 
                onClick={onDetail}
                variant="outline"
                className="h-9 px-6 font-bold rounded-xl text-xs"
              >
                <Terminal className="mr-2 h-4 w-4" /> 控制台
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDetail}
              className="text-muted-foreground font-bold hover:text-foreground"
            >
              查看详情 <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
