"use client";

import { useCallback, useState } from "react";
import {
  AlertCircle,
  Clock,
  Cpu,
  CreditCard,
  Eye,
  Loader2,
  MapPin,
  Play,
  RefreshCcw,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  cancelRentalOrder,
  getRentalOrderDetail,
  getRentalOrders,
  payRentalOrder,
  startOrder
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

const initialParams: RentalOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function DashboardOrdersPage() {
  const loader = useCallback(async (params: RentalOrderQueryRequest): Promise<PageResult<RentalOrderSummaryResponse>> => {
    const res = await getRentalOrders(params);
    return res.data;
  }, []);

  const { page, loading, updateParams, reload, changePage } = usePaginatedResource(loader, initialParams);
  const [filters, setFilters] = useState<RentalOrderQueryRequest>(initialParams);
  const [timeRange, setTimeRange] = useState("ALL");
  
  const [detail, setDetail] = useState<RentalOrderDetailResponse | null>(null);
  const [payTarget, setPayTarget] = useState<RentalOrderSummaryResponse | null>(null);
  const [wallet, setWallet] = useState<WalletMeResponse | null>(null);
  const [paying, setPaying] = useState(false);

  // Simple local toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Handlers ---
  const handleSearch = () => {
    const timeParams = getTimeRangeParams(timeRange);
    updateParams({ ...filters, ...timeParams, pageNo: 1 });
  };

  const handleReset = () => {
    setFilters(initialParams);
    setTimeRange("ALL");
    updateParams(initialParams);
  };

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
    try {
      await payRentalOrder(payTarget.orderNo);
      showToast("支付成功，资源正在部署中");
      setPayTarget(null);
      reload();
    } catch (err) {
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

  // --- UI Config ---
  const columns: DataTableColumn<RentalOrderSummaryResponse>[] = [
    {
      key: "orderNo",
      title: "订单号",
      render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.orderNo}</span>
    },
    {
      key: "productName",
      title: "算力产品 / 型号",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold">{row.productNameSnapshot}</span>
          <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
            <Cpu className="h-3 w-3" /> {row.aiModelNameSnapshot}
          </span>
        </div>
      )
    },
    {
      key: "orderAmount",
      title: "金额",
      render: (row) => <MoneyText value={row.orderAmount} className="font-bold" />
    },
    {
      key: "orderStatus",
      title: "状态",
      render: (row) => <StatusBadge status={row.orderStatus} />
    },
    {
      key: "profitStatus",
      title: "收益状态",
      render: (row) => <StatusBadge status={row.profitStatus} />
    },
    {
      key: "settlementStatus",
      title: "结算状态",
      render: (row) => <StatusBadge status={row.settlementStatus} />
    },
    {
      key: "createdAt",
      title: "创建时间",
      render: (row) => <DateTimeText value={row.createdAt} className="text-xs text-muted-foreground" />
    },
    {
      key: "actions",
      title: "操作",
      className: "text-right",
      render: (row) => {
        const isPending = row.orderStatus === RentalOrderStatus.PENDING_PAY;
        const isPaused = row.orderStatus === RentalOrderStatus.PAUSED;

        return (
          <div className="flex items-center justify-end gap-2">
            {isPending ? (
              <Button size="sm" onClick={() => openPayment(row)} className="bg-brand hover:bg-brand/90">
                立即支付
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => openDetail(row.orderNo)}>
                详情
              </Button>
            )}

            <div className="flex items-center gap-1">
              {isPaused && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-emerald-500"
                  onClick={() => runAction(() => startOrder(row.orderNo), "资源已重新上线")}
                >
                  <Play className="h-4 w-4 fill-current" />
                </Button>
              )}
              {isPending && (
                <ConfirmActionButton
                  title="取消订单"
                  description="确认要取消该笔算力租赁申请吗？"
                  onConfirm={() => runAction(() => cancelRentalOrder(row.orderNo), "订单已取消")}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </ConfirmActionButton>
              )}
            </div>
          </div>
        );
      }
    }
  ];

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
      title: "状态流水",
      fields: [
        { label: "订单状态", render: (d: RentalOrderDetailResponse) => <StatusBadge status={d.orderStatus} /> },
        { label: "收益状态", render: (d: RentalOrderDetailResponse) => <StatusBadge status={d.profitStatus} /> },
        { label: "结算状态", render: (d: RentalOrderDetailResponse) => <StatusBadge status={d.settlementStatus} /> },
        { label: "创建时间", render: (d: RentalOrderDetailResponse) => <DateTimeText value={d.createdAt} /> },
      ]
    }
  ];


  const insufficient = payTarget && wallet ? wallet.availableBalance < payTarget.orderAmount : false;

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="租赁资产管理"
        description="管理您的分布式算力资产，监控实时收益与部署状态。"
      />

      <SearchPanel onSearch={handleSearch} onReset={handleReset}>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">订单状态</span>
            <div className="flex bg-muted/50 p-1 rounded-lg">
              {["ALL", RentalOrderStatus.RUNNING, RentalOrderStatus.PENDING_PAY].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilters({ ...filters, orderStatus: s === "ALL" ? undefined : s as RentalOrderStatus })}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                    (filters.orderStatus ?? "ALL") === s
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s === "ALL" ? "全部" : getStatusMeta(s).label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">时间范围</span>
            <div className="flex bg-muted/50 p-1 rounded-lg">
              {["ALL", "7d", "30d"].map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                    timeRange === r
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r === "ALL" ? "不限" : r === "7d" ? "最近 7 天" : "最近 30 天"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SearchPanel>

      <div className="admin-card overflow-hidden">
        <DataTable
          columns={columns}
          data={page.records}
          rowKey={(row) => row.orderNo}
          loading={loading}
          pageNo={page.pageNo}
          pageSize={page.pageSize}
          total={page.total}
          onPageChange={changePage}
        />
      </div>

      {/* --- Toast --- */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border ${
          toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-destructive/10 border-destructive/20 text-destructive"
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
              <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> 运行时长: {Math.floor(Math.random() * 100)}h</div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* --- Payment Modal --- */}
      <Dialog open={!!payTarget} onOpenChange={(o) => !o && setPayTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand" /> 确认订单支付
            </DialogTitle>
          </DialogHeader>
          
          {payTarget && (
            <div className="space-y-6 py-4">
              <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">订单号</span>
                  <span className="font-mono">{payTarget.orderNo}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">资源型号</span>
                  <span className="font-bold">{payTarget.productNameSnapshot}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground">待付总额</span>
                  <MoneyText value={payTarget.orderAmount} className="text-2xl font-black text-brand" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">可用余额</span>
                  <MoneyText value={wallet?.availableBalance ?? 0} className={insufficient ? "text-destructive font-bold" : "font-bold"} />
                </div>
                {insufficient && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-[11px] text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    余额不足，请先充值后再进行支付。
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setPayTarget(null)} disabled={paying}>取消</Button>
            <Button 
              onClick={executePay} 
              disabled={paying || insufficient || !wallet}
              className="bg-brand hover:bg-brand/90"
            >
              {paying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
              立即支付并启动
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getTimeRangeParams(range: string) {
  if (range === "ALL") return { startTime: undefined, endTime: undefined };
  const now = new Date();
  const days = range === "7d" ? 7 : 30;
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return {
    startTime: start.toISOString().split("T")[0],
    endTime: undefined
  };
}
