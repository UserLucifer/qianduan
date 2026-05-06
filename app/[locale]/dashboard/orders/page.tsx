"use client";

import { useCallback, useState } from "react";
import {
  Loader2,
  Zap,
  XCircle,
  Wallet,
  CheckCircle2,
  MoreHorizontal,
  LayoutDashboard,
  History,
  Info
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
import { RentalOrderStatus } from "@/types/enums";

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

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    let status: string | undefined = undefined;
    if (val === "IN_PROGRESS") status = RentalOrderStatus.RUNNING;
    if (val === "PENDING_PAY") status = RentalOrderStatus.PENDING_PAY;
    if (val === "FINISHED") status = RentalOrderStatus.SETTLED;
    updateParams({ ...initialParams, orderStatus: status });
  };

  const openDetail = async (orderNo: string) => {
    try {
      const res = await getRentalOrderDetail(orderNo);
      setDetail(res.data);
    } catch {
      // 错误由拦截器处理
    }
  };

  const openPayment = async (order: RentalOrderSummaryResponse) => {
    setPayTarget(order);
    setPaymentState("idle");
    try {
      const res = await getWalletInfo();
      setWallet(res.data);
    } catch {
      // 错误处理
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
      // 拦截器处理
    }
  };

  const detailSections: DetailSectionDef<RentalOrderDetailResponse>[] = [
    {
      title: "核心配置",
      fields: [
        { label: "订单号", render: (d) => d.orderNo },
        { label: "算力型号", render: (d) => d.gpuModelSnapshot },
        { label: "显存容量", render: (d) => `${d.gpuMemorySnapshotGb} GB` },
        { label: "部署地区", render: (d) => d.regionNameSnapshot },
        { label: "AI 模型", render: (d) => d.aiModelNameSnapshot },
      ]
    },
    {
      title: "财务统计",
      fields: [
        { label: "订单总额", render: (d) => <MoneyText value={d.orderAmount} /> },
        { label: "预计总收益", render: (d) => <MoneyText value={d.expectedTotalProfit} /> },
        { label: "日均预计收益", render: (d) => <MoneyText value={d.expectedDailyProfit} /> },
      ]
    }
  ];

  const insufficient = payTarget && wallet ? wallet.availableBalance < payTarget.orderAmount : false;

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="算力资产列表"
        description="实时监控您的租赁实例运行状态与收益数据。"
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-transparent h-auto p-0 gap-8 border-b rounded-none w-full justify-start overflow-x-auto no-scrollbar">
          {["ALL", "IN_PROGRESS", "PENDING_PAY", "FINISHED"].map((v) => (
            <TabsTrigger 
              key={v} 
              value={v} 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-bold text-muted-foreground data-[state=active]:text-foreground transition-all uppercase text-[11px] tracking-widest"
            >
              {v === "ALL" ? "全部" : v === "IN_PROGRESS" ? "运行中" : v === "PENDING_PAY" ? "待支付" : "已完成"}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[200px]">实例信息</TableHead>
              <TableHead>配置方案</TableHead>
              <TableHead>运行状态</TableHead>
              <TableHead>租赁周期</TableHead>
              <TableHead className="text-right">订单金额</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && page.records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground font-medium">同步云端实例数据...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : page.records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center text-muted-foreground text-sm">
                  暂无匹配的算力实例
                </TableCell>
              </TableRow>
            ) : (
              page.records.map((order) => (
                <TableRow key={order.orderNo} className="group hover:bg-muted/30 transition-colors">
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
                    <OrderStateBadge status={order.orderStatus as RentalOrderStatus} />
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-bold">{order.cycleDaysSnapshot} 天</div>
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
                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">操作菜单</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDetail(order.orderNo)}>
                          <Info className="mr-2 h-4 w-4" /> 详情
                        </DropdownMenuItem>
                        {order.orderStatus === RentalOrderStatus.RUNNING && (
                          <>
                            <DropdownMenuItem className="text-primary font-bold">
                              <LayoutDashboard className="mr-2 h-4 w-4" /> 控制台
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive font-bold" onClick={() => runAction(() => settleEarly(order.orderNo))}>
                              <History className="mr-2 h-4 w-4" /> 提前终止
                            </DropdownMenuItem>
                          </>
                        )}
                        {order.orderStatus === RentalOrderStatus.PENDING_PAY && (
                          <>
                            <DropdownMenuItem className="bg-primary/10 text-primary font-bold" onClick={() => openPayment(order)}>
                              <Zap className="mr-2 h-4 w-4" /> 立即支付
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive font-bold" onClick={() => runAction(() => cancelRentalOrder(order.orderNo))}>
                              <XCircle className="mr-2 h-4 w-4" /> 取消订单
                            </DropdownMenuItem>
                          </>
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
              Page {page.pageNo} / {Math.ceil(page.total / page.pageSize)}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page.pageNo <= 1} onClick={() => changePage(page.pageNo - 1)}>上一页</Button>
              <Button variant="outline" size="sm" disabled={page.pageNo >= Math.ceil(page.total / page.pageSize)} onClick={() => changePage(page.pageNo + 1)}>下一页</Button>
            </div>
          </div>
        </div>
      )}

      {/* --- Detail Drawer & Payment Modal remain logic-wise the same --- */}
      <DetailDrawer title="资产详情" open={!!detail} onClose={() => setDetail(null)} data={detail} sections={detailSections} />

      <Dialog open={!!payTarget} onOpenChange={(o) => { if (paymentState === "processing" || paymentState === "success_anim") return; if (!o) setPayTarget(null); }}>
        <DialogContent className="max-w-md">
          <AnimatePresence mode="wait">
            {paymentState === "success_anim" ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                <h2 className="text-xl font-bold">支付成功</h2>
                <p className="text-sm text-muted-foreground">正在分配算力节点...</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <DialogHeader><DialogTitle>算力收银台</DialogTitle></DialogHeader>
                {payTarget && (
                  <div className="space-y-4">
                    <div className="text-center py-4 bg-muted/30 rounded-xl">
                      <p className="text-xs font-bold text-muted-foreground uppercase">应付金额</p>
                      <MoneyText value={payTarget.orderAmount} className="text-3xl font-black" />
                    </div>
                    <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-bold">钱包余额</p>
                          <p className="text-xs text-muted-foreground"><MoneyText value={wallet?.availableBalance ?? 0} /></p>
                        </div>
                      </div>
                      {insufficient && <Badge variant="destructive">余额不足</Badge>}
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setPayTarget(null)} disabled={paying}>取消</Button>
                  <Button onClick={executePay} disabled={paying || insufficient || !wallet} className="flex-1">
                    {paying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    确认支付
                  </Button>
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
  if (status === RentalOrderStatus.RUNNING) {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 px-2 py-0.5 font-bold uppercase text-[10px]">
        <span className="mr-1.5 h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
        运行中
      </Badge>
    );
  }
  if (status === RentalOrderStatus.PENDING_PAY) {
    return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-2 py-0.5 font-bold uppercase text-[10px]">
        待支付
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="px-2 py-0.5 font-bold uppercase text-[10px]">
      已完成
    </Badge>
  );
}
