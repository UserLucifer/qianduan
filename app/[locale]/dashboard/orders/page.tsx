"use client";

import { Suspense, useCallback, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Loader2,
  Zap,
  XCircle,
  Wallet,
  CheckCircle2,
  MoreHorizontal,
  LayoutDashboard,
  History,
  Info,
  PlayCircle,
  ReceiptText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
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
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  cancelRentalOrder,
  getRentalOrderDetail,
  getRentalOrders,
  payRentalOrder,
  settleEarly,
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
import { RentalOrderStatus } from "@/types/enums";
import { cn } from "@/lib/utils";

const initialParams: RentalOrderQueryRequest = { pageNo: 1, pageSize: 10 };
type OrderTab = "ALL" | "PENDING_PAY" | "PENDING_ACTIVATION" | "PAUSED" | "RUNNING";
type AssetStage = "PENDING_PAY" | "PENDING_DEPLOY" | "DEPLOYING" | "READY_TO_START" | "RUNNING" | "SETTLING" | "FINISHED" | "CANCELED";

const orderTabs: OrderTab[] = ["ALL", "PENDING_PAY", "PENDING_ACTIVATION", "PAUSED", "RUNNING"];
const orderTabStatus: Partial<Record<OrderTab, RentalOrderStatus>> = {
  PENDING_PAY: RentalOrderStatus.PENDING_PAY,
  PENDING_ACTIVATION: RentalOrderStatus.PENDING_ACTIVATION,
  PAUSED: RentalOrderStatus.PAUSED,
  RUNNING: RentalOrderStatus.RUNNING,
};

function getAssetStage(status: string): AssetStage {
  if (status === RentalOrderStatus.PENDING_PAY) return "PENDING_PAY";
  if (status === RentalOrderStatus.PENDING_ACTIVATION) return "PENDING_DEPLOY";
  if (status === RentalOrderStatus.ACTIVATING) return "DEPLOYING";
  if (status === RentalOrderStatus.PAUSED) return "READY_TO_START";
  if (status === RentalOrderStatus.RUNNING) return "RUNNING";
  if (status === RentalOrderStatus.SETTLING) return "SETTLING";
  if (status === RentalOrderStatus.CANCELED) return "CANCELED";
  return "FINISHED";
}

export default function DashboardOrdersPage() {
  return (
    <Suspense fallback={null}>
      <DashboardOrdersContent />
    </Suspense>
  );
}

function DashboardOrdersContent() {
  const t = useTranslations("DashboardOrders");
  const searchParams = useSearchParams();
  const focusedOrderNo = searchParams.get("orderNo")?.trim() ?? "";
  const scopedInitialParams: RentalOrderQueryRequest = focusedOrderNo ? { ...initialParams, orderNo: focusedOrderNo } : initialParams;
  const loader = useCallback(async (params: RentalOrderQueryRequest): Promise<PageResult<RentalOrderSummaryResponse>> => {
    const res = await getRentalOrders(params);
    return res.data;
  }, []);

  const { page, loading, updateParams, reload, changePage } = usePaginatedResource(loader, scopedInitialParams);
  const [activeTab, setActiveTab] = useState<OrderTab>("ALL");
  
  const [detail, setDetail] = useState<RentalOrderDetailResponse | null>(null);
  const [payTarget, setPayTarget] = useState<RentalOrderSummaryResponse | null>(null);
  const [wallet, setWallet] = useState<WalletMeResponse | null>(null);
  const [paying, setPaying] = useState(false);
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success_anim" | "completed">("idle");
  const [settleTarget, setSettleTarget] = useState<RentalOrderSummaryResponse | null>(null);
  const [settling, setSettling] = useState(false);

  const handleTabChange = (val: string) => {
    const nextTab = val as OrderTab;
    setActiveTab(nextTab);
    const status = orderTabStatus[nextTab];
    updateParams({ ...scopedInitialParams, orderStatus: status });
  };

  const openDetail = async (orderNo: string) => {
    try {
      const res = await getRentalOrderDetail(orderNo);
      setDetail(res.data);
    } catch {
      // API errors are surfaced by the request interceptor.
    }
  };

  const openPayment = async (order: RentalOrderSummaryResponse) => {
    setPayTarget(order);
    setPaymentState("idle");
    try {
      const res = await getWalletInfo();
      setWallet(res.data);
    } catch {
      // API errors are surfaced by the request interceptor.
    }
  };

  const executePay = async () => {
    if (!payTarget) return;
    setPaying(true);
    setPaymentState("processing");
    try {
      await payRentalOrder(payTarget.orderNo);
      setPaymentState("success_anim");
      setTimeout(() => {
        setPaymentState("completed");
        setPayTarget(null);
        reload();
      }, 2000);
    } catch {
      setPaymentState("idle");
    } finally {
      setPaying(false);
    }
  };

  const runAction = async (action: () => Promise<unknown>) => {
    try {
      await action();
      reload();
    } catch {
      // API errors are surfaced by the request interceptor.
    }
  };

  const executeEarlySettle = async () => {
    if (!settleTarget) return;
    setSettling(true);
    try {
      await settleEarly(settleTarget.orderNo);
      setSettleTarget(null);
      reload();
    } catch {
      // API errors are surfaced by the request interceptor.
    } finally {
      setSettling(false);
    }
  };

  const detailSections: DetailSectionDef<RentalOrderDetailResponse>[] = [
    {
      title: t("detail.lifecycle"),
      fields: [
        { label: t("detail.currentStage"), render: (d) => <OrderStateBadge status={d.orderStatus as RentalOrderStatus} /> },
        { label: t("detail.paidAt"), render: (d) => <DateTimeText value={d.paidAt} /> },
        { label: t("detail.deployFeePaidAt"), render: (d) => <DateTimeText value={d.deployFeePaidAt} /> },
        { label: t("detail.startedAt"), render: (d) => <DateTimeText value={d.startedAt} /> },
        { label: t("detail.profitEndAt"), render: (d) => <DateTimeText value={d.profitEndAt} /> },
      ]
    },
    {
      title: t("detail.core"),
      fields: [
        { label: t("detail.orderNo"), render: (d) => d.orderNo },
        { label: t("detail.gpuModel"), render: (d) => d.gpuModelSnapshot },
        { label: t("detail.gpuMemory"), render: (d) => `${d.gpuMemorySnapshotGb} GB` },
        { label: t("detail.region"), render: (d) => d.regionNameSnapshot },
        { label: t("detail.aiModel"), render: (d) => d.aiModelNameSnapshot },
      ]
    },
    {
      title: t("detail.finance"),
      fields: [
        { label: t("detail.orderAmount"), render: (d) => <MoneyText value={d.orderAmount} /> },
        { label: t("detail.expectedTotalProfit"), render: (d) => <MoneyText value={d.expectedTotalProfit} /> },
        { label: t("detail.expectedDailyProfit"), render: (d) => <MoneyText value={d.expectedDailyProfit} /> },
      ]
    }
  ];

  const insufficient = payTarget && wallet ? wallet.availableBalance < payTarget.orderAmount : false;

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title={t("header.title")}
        description={t("header.description")}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-transparent h-auto p-0 gap-8 border-b rounded-none w-full justify-start overflow-x-auto no-scrollbar">
          {orderTabs.map((v) => (
            <TabsTrigger 
              key={v} 
              value={v} 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-bold text-muted-foreground data-[state=active]:text-foreground transition-all uppercase text-[11px] tracking-widest"
            >
              {t(`tabs.${v}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[200px]">{t("columns.instance")}</TableHead>
              <TableHead>{t("columns.plan")}</TableHead>
              <TableHead>{t("columns.status")}</TableHead>
              <TableHead>{t("columns.cycle")}</TableHead>
              <TableHead className="text-right">{t("columns.amount")}</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && page.records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground font-medium">{t("loading")}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : page.records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center text-muted-foreground text-sm">
                  {t("empty")}</TableCell>
              </TableRow>
            ) : (
              page.records.map((order) => (
                <TableRow
                  key={order.orderNo}
                  className={cn(
                    "group hover:bg-muted/30 transition-colors",
                    focusedOrderNo === order.orderNo && "bg-primary/5 ring-1 ring-inset ring-primary/30",
                  )}
                >
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="font-bold text-sm tracking-tight flex items-center gap-2">
                        {order.productNameSnapshot}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase">ID: {order.orderNo}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-left">
                      <div className="text-xs font-semibold">{order.aiModelNameSnapshot}</div>
                      <div className="text-[10px] text-muted-foreground">{order.machineAliasSnapshot}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <OrderStateBadge status={order.orderStatus as RentalOrderStatus} />
                      <p className="text-[10px] leading-4 text-muted-foreground">
                        {t(`stageHelp.${getAssetStage(order.orderStatus)}`)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-bold">{t("cycleDays", { days: order.cycleDaysSnapshot })}</div>
                    <div className="text-[10px] text-muted-foreground"><DateTimeText value={order.createdAt} /></div>
                  </TableCell>
                  <TableCell className="text-right font-black">
                    <MoneyText value={order.orderAmount} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("menu.label")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDetail(order.orderNo)}>
                          <Info className="mr-2 h-4 w-4" /> {t("menu.detail")}</DropdownMenuItem>
                        {order.orderStatus === RentalOrderStatus.RUNNING && (
                          <>
                            <DropdownMenuItem className="text-primary font-bold">
                              <LayoutDashboard className="mr-2 h-4 w-4" /> {t("menu.console")}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive font-bold" onClick={() => setSettleTarget(order)}>
                              <History className="mr-2 h-4 w-4" /> {t("menu.earlyTerminate")}</DropdownMenuItem>
                          </>
                        )}
                        {order.orderStatus === RentalOrderStatus.PAUSED && (
                          <>
                            <DropdownMenuItem className="text-primary font-bold" onClick={() => runAction(() => startOrder(order.orderNo))}>
                              <PlayCircle className="mr-2 h-4 w-4" /> {t("menu.startAsset")}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive font-bold" onClick={() => setSettleTarget(order)}>
                              <History className="mr-2 h-4 w-4" /> {t("menu.earlyTerminate")}</DropdownMenuItem>
                          </>
                        )}
                        {order.orderStatus === RentalOrderStatus.PENDING_PAY && (
                          <>
                            <DropdownMenuItem className="bg-primary/10 text-primary font-bold" onClick={() => openPayment(order)}>
                              <Zap className="mr-2 h-4 w-4" /> {t("menu.payNow")}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive font-bold" onClick={() => runAction(() => cancelRentalOrder(order.orderNo))}>
                              <XCircle className="mr-2 h-4 w-4" /> {t("menu.cancelOrder")}</DropdownMenuItem>
                          </>
                        )}
                        {order.orderStatus === RentalOrderStatus.PENDING_ACTIVATION && (
                          <DropdownMenuItem asChild className="text-primary font-bold">
                            <Link href={`/dashboard/api?orderNo=${encodeURIComponent(order.orderNo)}`}>
                              <ReceiptText className="mr-2 h-4 w-4" /> {t("menu.payDeployFee")}
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {getAssetStage(order.orderStatus) === "FINISHED" && (
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard/billing">
                              <History className="mr-2 h-4 w-4" /> {t("menu.viewSettlement")}
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {page.total > page.pageSize && (
        <div className="flex justify-end pt-4">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              {t("pagination.summary", { pageNo: page.pageNo, pageCount: Math.ceil(page.total / page.pageSize) })}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page.pageNo <= 1} onClick={() => changePage(page.pageNo - 1)}>{t("pagination.previous")}</Button>
              <Button variant="outline" size="sm" disabled={page.pageNo >= Math.ceil(page.total / page.pageSize)} onClick={() => changePage(page.pageNo + 1)}>{t("pagination.next")}</Button>
            </div>
          </div>
        </div>
      )}

      {/* --- Detail Drawer & Payment Modal remain logic-wise the same --- */}
      <DetailDrawer title={t("detail.title")} open={!!detail} onClose={() => setDetail(null)} data={detail} sections={detailSections} />

      <Dialog open={!!settleTarget} onOpenChange={(open) => { if (!open && !settling) setSettleTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("earlySettlement.title")}</DialogTitle>
            <DialogDescription>{t("earlySettlement.description")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettleTarget(null)} disabled={settling}>{t("earlySettlement.cancel")}</Button>
            <Button variant="destructive" onClick={executeEarlySettle} disabled={settling}>
              {settling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <History className="mr-2 h-4 w-4" />}
              {t("earlySettlement.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!payTarget} onOpenChange={(o) => { if (paymentState === "processing" || paymentState === "success_anim") return; if (!o) setPayTarget(null); }}>
        <DialogContent className="max-w-md">
          <AnimatePresence mode="wait">
            {paymentState === "success_anim" ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                <h2 className="text-xl font-bold">{t("payment.success")}</h2>
                <p className="text-sm text-muted-foreground">{t("payment.assigning")}</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <DialogHeader><DialogTitle>{t("payment.title")}</DialogTitle></DialogHeader>
                {payTarget && (
                  <div className="space-y-4">
                    <div className="text-center py-4 bg-muted/30 rounded-xl">
                      <p className="text-xs font-bold text-muted-foreground uppercase">{t("payment.amountDue")}</p>
                      <MoneyText value={payTarget.orderAmount} className="text-3xl font-black" />
                    </div>
                    <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-bold">{t("payment.walletBalance")}</p>
                          <p className="text-xs text-muted-foreground"><MoneyText value={wallet?.availableBalance ?? 0} /></p>
                        </div>
                      </div>
                      {insufficient && <Badge variant="destructive">{t("payment.insufficient")}</Badge>}
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setPayTarget(null)} disabled={paying}>{t("payment.cancel")}</Button>
                  <Button onClick={executePay} disabled={paying || insufficient || !wallet} className="flex-1">
                    {paying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    {t("payment.confirm")}</Button>
                </DialogFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderStateBadge({ status }: { status: RentalOrderStatus }) {
  const t = useTranslations("DashboardOrders");
  const stage = getAssetStage(status);
  if (status === RentalOrderStatus.RUNNING) {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 px-2 py-0.5 font-bold uppercase text-[10px]">
        <span className="mr-1.5 h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
        {t("status.running")}</Badge>
    );
  }
  if (status === RentalOrderStatus.PENDING_PAY) {
    return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-2 py-0.5 font-bold uppercase text-[10px]">
        {t("status.pendingPay")}</Badge>
    );
  }
  if (stage === "PENDING_DEPLOY") {
    return (
      <Badge variant="outline" className="bg-sky-500/10 text-sky-400 border-sky-500/20 px-2 py-0.5 font-bold uppercase text-[10px]">
        {t("status.pendingDeploy")}</Badge>
    );
  }
  if (stage === "DEPLOYING") {
    return (
      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 font-bold uppercase text-[10px]">
        {t("status.deploying")}</Badge>
    );
  }
  if (stage === "READY_TO_START") {
    return (
      <Badge variant="outline" className="bg-violet-500/10 text-violet-300 border-violet-500/20 px-2 py-0.5 font-bold uppercase text-[10px]">
        {t("status.readyToStart")}</Badge>
    );
  }
  if (stage === "SETTLING") {
    return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-2 py-0.5 font-bold uppercase text-[10px]">
        {t("status.settling")}</Badge>
    );
  }
  if (stage === "CANCELED") {
    return (
      <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/20 px-2 py-0.5 font-bold uppercase text-[10px]">
        {t("status.canceled")}</Badge>
    );
  }
  if (stage === "FINISHED") {
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground border-border px-2 py-0.5 font-bold uppercase text-[10px]">
        {t("status.finished")}</Badge>
    );
  }
  return (
    <StatusBadge status={status} className="px-2 py-0.5 font-bold uppercase text-[10px]" />
  );
}
