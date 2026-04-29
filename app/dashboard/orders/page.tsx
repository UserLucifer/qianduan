"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Eye, Loader2, Play, ReceiptText, XCircle, AlertCircle, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  cancelRentalOrder, getRentalOrderDetail, getRentalOrders,
  payRentalOrder, startOrder
} from "@/api/rental";
import type {
  PageResult, RentalOrderDetailResponse,
  RentalOrderQueryRequest, RentalOrderSummaryResponse
} from "@/api/types";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { RentalOrderStatus } from "@/types/enums";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─── Inline Toast ─── */
type ToastEntry = { id: number; message: string; type: "error" | "success" };

function useInlineToast() {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const show = useCallback((message: string, type: "error" | "success" = "error") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  return { toasts, show };
}

function ToastContainer({ toasts }: { toasts: ToastEntry[] }) {
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[9999] flex -translate-x-1/2 flex-col gap-2">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={cn(
              "pointer-events-auto flex items-center gap-3 rounded-xl border px-5 py-3 text-sm font-medium shadow-xl backdrop-blur-sm",
              t.type === "error"
                ? "border-rose-500/30 bg-rose-950/90 text-rose-300"
                : "border-emerald-500/30 bg-emerald-950/90 text-emerald-300"
            )}
          >
            {t.type === "error" ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── Payment Modal ─── */
type PaymentPhase = "confirm" | "loading" | "success";

interface PaymentModalProps {
  order: RentalOrderSummaryResponse | null;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (msg: string, type: "error" | "success") => void;
}

function PaymentModal({ order, onClose, onSuccess, showToast }: PaymentModalProps) {
  const [phase, setPhase] = useState<PaymentPhase>("confirm");

  // Reset phase when a new order is opened
  useEffect(() => {
    if (order) setPhase("confirm");
  }, [order]);

  const handlePay = async () => {
    if (!order) return;
    setPhase("loading");
    try {
      await payRentalOrder(order.orderNo);
      setPhase("success");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1800);
    } catch (err) {
      setPhase("confirm");
      showToast(`支付失败：${toErrorMessage(err)}`, "error");
    }
  };

  return (
    <Dialog open={Boolean(order)} onOpenChange={(open) => { if (!open && phase !== "loading") onClose(); }}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border/50 px-6 py-5">
          <DialogTitle className="text-base font-semibold">确认支付</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6">
          <AnimatePresence mode="wait">
            {phase === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-foreground">支付成功！</p>
                  <p className="mt-1 text-sm text-muted-foreground">算力正在为您部署，请稍候...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                {/* Order info */}
                <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">订单号</span>
                    <span className="font-mono text-xs text-foreground">{order?.orderNo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">产品名称</span>
                    <span className="text-sm font-medium text-foreground">{order?.productNameSnapshot}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">AI 模型</span>
                    <span className="text-sm text-muted-foreground">{order?.aiModelNameSnapshot} · {order?.cycleDaysSnapshot} 天</span>
                  </div>
                </div>

                {/* Amount highlight */}
                <div className="rounded-xl border border-[#5e6ad2]/30 bg-[#5e6ad2]/5 p-5 text-center">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">需支付金额</p>
                  <div className="text-3xl font-black text-[#5e6ad2]">
                    <MoneyText value={order?.orderAmount} />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">将从您的钱包余额中扣除</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {phase !== "success" && (
          <DialogFooter className="border-t border-border/50 px-6 py-4">
            <Button variant="outline" onClick={onClose} disabled={phase === "loading"}>取消</Button>
            <Button
              onClick={() => void handlePay()}
              disabled={phase === "loading"}
              className="min-w-[100px] bg-[#5e6ad2] text-white hover:bg-[#7170ff]"
            >
              {phase === "loading" ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />支付中...</>
              ) : (
                <><ReceiptText className="mr-2 h-4 w-4" />确认支付</>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─── Time Range helper ─── */
function getTimeRange(range: string): { startTime?: string; endTime?: string } {
  if (range === "ALL") return {};
  const now = new Date();
  const days = range === "7d" ? 7 : 30;
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { startTime: start.toISOString().split("T")[0] };
}

/* ─── Page ─── */
const initialParams: RentalOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function DashboardOrdersPage() {
  const loader = useCallback(async (params: RentalOrderQueryRequest): Promise<PageResult<RentalOrderSummaryResponse>> => {
    const res = await getRentalOrders(params);
    return res.data;
  }, []);

  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialParams);
  const [filters, setFilters] = useState<RentalOrderQueryRequest>(initialParams);
  const [timeRange, setTimeRange] = useState("ALL");
  const [detail, setDetail] = useState<RentalOrderDetailResponse | null>(null);
  const [payOrder, setPayOrder] = useState<RentalOrderSummaryResponse | null>(null);
  const { toasts, show: showToast } = useInlineToast();

  const openDetail = async (orderNo: string) => {
    try {
      const res = await getRentalOrderDetail(orderNo);
      setDetail(res.data);
    } catch (err) {
      showToast(`获取详情失败：${toErrorMessage(err)}`, "error");
    }
  };

  const runAction = async (action: () => Promise<Readonly<object>>, successMsg?: string) => {
    try {
      await action();
      await reload();
      if (successMsg) showToast(successMsg, "success");
    } catch (err) {
      showToast(toErrorMessage(err), "error");
    }
  };

  const handleSearch = () => {
    const timeParams = getTimeRange(timeRange);
    updateParams({ ...filters, ...timeParams, pageNo: 1 });
  };

  const handleReset = () => {
    setFilters(initialParams);
    setTimeRange("ALL");
    updateParams(initialParams);
  };

  const columns: DataTableColumn<RentalOrderSummaryResponse>[] = [
    {
      key: "orderNo",
      title: "订单号",
      render: (row) => (
        <button
          onClick={() => void openDetail(row.orderNo)}
          className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {row.orderNo}
        </button>
      )
    },
    {
      key: "productNameSnapshot",
      title: "产品 / 模型",
      render: (row) => (
        <div>
          <div className="font-medium text-foreground">{row.productNameSnapshot}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {row.aiModelNameSnapshot} · {row.cycleDaysSnapshot} 天
          </div>
        </div>
      ),
    },
    {
      key: "orderAmount",
      title: "金额",
      render: (row) => <MoneyText value={row.orderAmount} className="font-semibold" />
    },
    { key: "orderStatus", title: "订单状态", render: (row) => <StatusBadge status={row.orderStatus} /> },
    { key: "profitStatus", title: "收益状态", render: (row) => <StatusBadge status={row.profitStatus} /> },
    { key: "settlementStatus", title: "结算状态", render: (row) => <StatusBadge status={row.settlementStatus} /> },
    { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: "操作",
      className: "text-right",
      render: (row) => {
        const isPending = row.orderStatus === RentalOrderStatus.PENDING_PAY;
        const isPaused = row.orderStatus === RentalOrderStatus.PAUSED;

        return (
          <div className="flex items-center justify-end gap-2">
            {/* Primary CTA: Pay */}
            {isPending && (
              <Button
                size="sm"
                onClick={() => setPayOrder(row)}
                className="h-8 bg-[#5e6ad2] px-3 text-xs font-semibold text-white shadow-md shadow-[#5e6ad2]/20 hover:bg-[#7170ff]"
              >
                <ReceiptText className="mr-1.5 h-3.5 w-3.5" />
                立即支付
              </Button>
            )}

            {/* Primary CTA: Resume */}
            {isPaused && (
              <ConfirmActionButton
                title="启动暂停订单"
                description="订单启动后会继续消耗租赁周期。"
                confirmText="确认启动"
                onConfirm={() => runAction(() => startOrder(row.orderNo), "订单已启动")}
              >
                <Play className="mr-1.5 h-3.5 w-3.5" />
                启动
              </ConfirmActionButton>
            )}

            {/* Secondary: Details + Cancel */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void openDetail(row.orderNo)}
              className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Eye className="h-3.5 w-3.5" />
              详情
            </Button>
            {isPending && (
              <ConfirmActionButton
                title="取消租赁订单"
                description="取消后该订单不可继续支付。"
                confirmText="确认取消"
                onConfirm={() => runAction(() => cancelRentalOrder(row.orderNo), "订单已取消")}
              >
                <XCircle className="h-3.5 w-3.5" />
                取消
              </ConfirmActionButton>
            )}
          </div>
        );
      },
    },
  ];

  const detailSections: DetailSectionDef<RentalOrderDetailResponse>[] = [
    {
      title: "订单信息",
      fields: [
        { label: "订单号", render: (d) => <span className="font-mono">{d.orderNo}</span> },
        { label: "订单状态", render: (d) => <StatusBadge status={d.orderStatus} /> },
        { label: "收益状态", render: (d) => <StatusBadge status={d.profitStatus} /> },
        { label: "结算状态", render: (d) => <StatusBadge status={d.settlementStatus} /> },
        { label: "订单金额", render: (d) => <MoneyText value={d.orderAmount} /> },
        { label: "已付金额", render: (d) => <MoneyText value={d.paidAmount} /> },
      ],
    },
    {
      title: "产品信息",
      fields: [
        { label: "产品名称", render: (d) => d.productNameSnapshot },
        { label: "GPU 型号", render: (d) => d.gpuModelSnapshot },
        { label: "地区", render: (d) => d.regionNameSnapshot },
        { label: "机器", render: (d) => d.machineAliasSnapshot || d.machineCodeSnapshot },
        { label: "显存", render: (d) => `${d.gpuMemorySnapshotGb} GB` },
        { label: "日 Token", render: (d) => (d.tokenOutputPerDaySnapshot ?? 0).toLocaleString("zh-CN") },
      ],
    },
    {
      title: "API 信息",
      fields: [
        { label: "凭证编号", render: (d) => formatEmpty(d.apiCredential?.credentialNo) },
        { label: "Token 状态", render: (d) => <StatusBadge status={d.apiCredential?.tokenStatus} /> },
        { label: "API 名称", render: (d) => formatEmpty(d.apiCredential?.apiName) },
        { label: "部署费", render: (d) => <MoneyText value={d.deployFeeSnapshot} /> },
      ],
    },
    {
      title: "时间信息",
      fields: [
        { label: "创建时间", render: (d) => <DateTimeText value={d.createdAt} /> },
        { label: "支付时间", render: (d) => <DateTimeText value={d.paidAt} /> },
        { label: "激活时间", render: (d) => <DateTimeText value={d.activatedAt} /> },
        { label: "收益开始", render: (d) => <DateTimeText value={d.profitStartAt} /> },
        { label: "收益结束", render: (d) => <DateTimeText value={d.profitEndAt} /> },
        { label: "到期时间", render: (d) => <DateTimeText value={d.expiredAt} /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="租赁订单"
        title="我的租赁订单"
        description="查看租赁订单状态、收益状态、结算状态以及关联 API 部署信息。"
      />

      <SearchPanel
        onSearch={handleSearch}
        onReset={handleReset}
      >
        {/* Status filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">订单状态</Label>
          <Select
            value={filters.orderStatus ?? "ALL"}
            onValueChange={(v) =>
              setFilters(cur => ({ ...cur, orderStatus: v === "ALL" ? undefined : v }))
            }
          >
            <SelectTrigger className="h-9 min-w-[140px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部状态</SelectItem>
              <SelectItem value={RentalOrderStatus.PENDING_PAY}>待支付</SelectItem>
              <SelectItem value={RentalOrderStatus.RUNNING}>运行中</SelectItem>
              <SelectItem value={RentalOrderStatus.PAUSED}>已暂停</SelectItem>
              <SelectItem value={RentalOrderStatus.SETTLED}>已结算</SelectItem>
              <SelectItem value={RentalOrderStatus.CANCELED}>已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time range quick filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">时间范围</Label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="h-9 min-w-[140px] bg-background text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部时间</SelectItem>
              <SelectItem value="7d">最近 7 天</SelectItem>
              <SelectItem value="30d">最近 30 天</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>

      {/* List-level error (load failure) */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={page.records}
        rowKey={(row) => row.orderNo}
        loading={loading}
        emptyText="暂无租赁订单。"
        pageNo={page.pageNo}
        pageSize={page.pageSize}
        total={page.total}
        onPageChange={changePage}
      />

      <DetailDrawer
        data={detail}
        open={Boolean(detail)}
        title="租赁订单详情"
        subtitle={(data) => data.orderNo}
        sections={detailSections}
        onClose={() => setDetail(null)}
      />

      <PaymentModal
        order={payOrder}
        onClose={() => setPayOrder(null)}
        onSuccess={() => void reload()}
        showToast={showToast}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
