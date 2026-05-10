"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { 
  Lock, 
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Snowflake,
  Unlock,
  FileText,
  Loader2,
  Receipt,
  ArrowDown,
  ArrowUp,
  History
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { getTransactions, getWalletInfo } from "@/api/wallet";
import type { PageResult, WalletMeResponse, WalletTransactionQueryRequest, WalletTransactionResponse } from "@/api/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { cn } from "@/lib/utils";

const initialParams: WalletTransactionQueryRequest = { pageNo: 1, pageSize: 12 };

const walletBizTypeAliases: Record<string, string> = {
  TOP_UP: "RECHARGE",
  TOP_UPS: "RECHARGE",
  TOPUP: "RECHARGE",
  TOPUPS: "RECHARGE",
  WITHDRAWAL: "WITHDRAW",
  WITHDRAWALS: "WITHDRAW",
  RENTAL_PAYMENT: "RENT_PAY",
  RENT_PAYMENT: "RENT_PAY",
  API_DEPLOY: "API_DEPLOY_FEE",
  API_DEPLOYMENT: "API_DEPLOY_FEE",
  API_DEPLOYMENT_FEE: "API_DEPLOY_FEE",
  RENTAL_EARNINGS: "RENT_PROFIT",
  RENT_EARNINGS: "RENT_PROFIT",
  RENTAL_PROFIT: "RENT_PROFIT",
  COMMISSION_EARNINGS: "COMMISSION_PROFIT",
  COMMISSION_PROFIT: "COMMISSION_PROFIT",
  EARLY_SETTLEMENT_PENALTY: "EARLY_PENALTY",
  BALANCE_ADJUSTMENT: "ADJUST",
  SYSTEM_ADJUSTMENT: "ADJUST",
  ADJUSTMENT: "ADJUST",
  ACTIVATION_TIMEOUT_REFUND: "ACTIVATE_TIMEOUT_REFUND",
  ACTIVATE_TIMEOUT_REFUND: "ACTIVATE_TIMEOUT_REFUND",
  API_ACTIVATION_TIMEOUT_REFUND: "ACTIVATE_TIMEOUT_REFUND",
};

const walletTxTypeAliases: Record<string, string> = {
  CREDIT: "IN",
  DEBIT: "OUT",
  FROZEN: "FREEZE",
  UNFROZEN: "UNFREEZE",
};

const walletRemarkKeys: Record<string, string> = {
  API_DEPLOY_FEE_PAID: "apiDeployFeePaid",
  RENTAL_ORDER_CANCELED_REFUND: "rentalOrderCanceledRefund",
  RENTAL_ORDER_CANCELLED_REFUND: "rentalOrderCanceledRefund",
  RENTAL_MACHINE_FEE_PAID: "rentalMachineFeePaid",
  RENTAL_MACHINE_FEE_PAYMENT: "rentalMachineFeePaid",
  RENTAL_MACHINE_PAYMENT: "rentalMachineFeePaid",
  MACHINE_RENTAL_FEE_PAID: "rentalMachineFeePaid",
  MACHINE_RENTAL_FEE_PAYMENT: "rentalMachineFeePaid",
  ACTIVATION_TIMEOUT_REFUND: "activationTimeoutRefund",
  ACTIVATE_TIMEOUT_REFUND: "activationTimeoutRefund",
  DAILY_RENTAL_PROFIT: "dailyRentalProfit",
  COMMISSION_PROFIT: "commissionProfit",
  RECHARGE_APPROVED: "rechargeApproved",
  WITHDRAW_FREEZE: "withdrawFreeze",
  WITHDRAW_CANCELED: "withdrawCanceled",
  WITHDRAW_CANCELLED: "withdrawCanceled",
  WITHDRAW_REJECTED: "withdrawRejected",
  WITHDRAW_PAID: "withdrawPaid",
  EARLY_SETTLEMENT_PENALTY_RETAINED_FROM_PRINCIPAL: "earlySettlementPenaltyRetainedFromPrincipal",
  EARLY_SETTLEMENT_PRINCIPAL_RETURNED: "earlySettlementPrincipalReturned",
  EXPIRED_RENTAL_PRINCIPAL_RETURNED: "expiredRentalPrincipalReturned",
};

const walletRemarkExactKeys: Record<string, string> = {
  "API 部署费已支付": "apiDeployFeePaid",
  "API部署费已支付": "apiDeployFeePaid",
  "租赁订单取消退款": "rentalOrderCanceledRefund",
  "租赁机器费用支付": "rentalMachineFeePaid",
  "租赁机器费支付": "rentalMachineFeePaid",
  "租赁机器费用已支付": "rentalMachineFeePaid",
  "激活超时退款": "activationTimeoutRefund",
  "每日租赁收益": "dailyRentalProfit",
  "佣金收益": "commissionProfit",
  "充值审核通过": "rechargeApproved",
  "提现冻结": "withdrawFreeze",
  "提现已取消": "withdrawCanceled",
  "提现取消": "withdrawCanceled",
  "提现已拒绝": "withdrawRejected",
  "提现拒绝": "withdrawRejected",
  "提现已打款": "withdrawPaid",
  "提现打款": "withdrawPaid",
  "提前结算违约金从本金中扣留": "earlySettlementPenaltyRetainedFromPrincipal",
  "提前结算本金返还": "earlySettlementPrincipalReturned",
  "到期租赁本金返还": "expiredRentalPrincipalReturned",
};

function normalizeDisplayKey(value: string): string {
  return value
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}

function formatStartOfDay(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} 00:00:00`;
}

export default function WalletPage() {
  return (
    <Suspense fallback={null}>
      <WalletPageContent />
    </Suspense>
  );
}

function WalletPageContent() {
  const t = useTranslations("DashboardWallet");
  const dt = useTranslations("DataTable");
  const hasWalletMessage = t.has as unknown as (key: string) => boolean;
  const translateWalletMessage = t as unknown as (key: string) => string;
  const searchParams = useSearchParams();
  const highlightedTxNo = searchParams.get("txNo")?.trim() ?? "";
  const txRowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const walletLoader = useCallback(async (): Promise<WalletMeResponse> => {
    const res = await getWalletInfo();
    return res.data;
  }, []);

  const txLoader = useCallback(async (params: WalletTransactionQueryRequest): Promise<PageResult<WalletTransactionResponse>> => {
    const res = await getTransactions(params);
    return res.data;
  }, []);

  const wallet = useAsyncResource(walletLoader);
  const transactions = usePaginatedResource(txLoader, initialParams);
  
  const [activeTab, setActiveTab] = useState("ALL");
  const [bizType, setBizType] = useState("ALL");
  const [dateRange, setDateRange] = useState("ALL");

  useEffect(() => {
    if (wallet.error) toast.error(wallet.error);
    if (transactions.error) toast.error(transactions.error);
  }, [wallet.error, transactions.error]);

  useEffect(() => {
    if (!highlightedTxNo || transactions.loading) return;

    const target = txRowRefs.current[highlightedTxNo];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightedTxNo, transactions.loading, transactions.page.records]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    triggerSearch(val, bizType, dateRange);
  };

  const handleBizTypeChange = (val: string) => {
    setBizType(val);
    triggerSearch(activeTab, val, dateRange);
  };

  const handleDateRangeChange = (val: string) => {
    setDateRange(val);
    triggerSearch(activeTab, bizType, val);
  };

  const triggerSearch = (txTypeOpt: string, bizTypeOpt: string, dateOption: string) => {
    const txType = txTypeOpt === "ALL" ? undefined : txTypeOpt;
    const currentBizType = bizTypeOpt === "ALL" ? undefined : bizTypeOpt;
    
    // Calculate start date based on dateOption (3D, 7D, 30D)
    let startTime: string | undefined = undefined;
    if (dateOption !== "ALL") {
       const d = new Date();
       const days = parseInt(dateOption);
       d.setDate(d.getDate() - days);
       startTime = formatStartOfDay(d);
    }

    transactions.updateParams({ 
      ...transactions.page, 
      pageNo: 1, 
      txType,
      bizType: currentBizType,
      startTime
    });
  };

  const getBizTypeLabel = (type: string | null | undefined) => {
    if (!type) return "-";
    const normalized = normalizeDisplayKey(type);
    const bizTypeKey = walletBizTypeAliases[normalized] ?? normalized;
    const key = `bizTypes.${bizTypeKey}`;
    return hasWalletMessage(key) ? translateWalletMessage(key) : type;
  };

  const getRemarkLabel = (remark: string | null | undefined) => {
    if (!remark) return "";
    const trimmedRemark = remark.trim();
    const exactRemarkKey = walletRemarkExactKeys[trimmedRemark];
    if (exactRemarkKey) {
      const key = `remarks.${exactRemarkKey}`;
      if (hasWalletMessage(key)) return translateWalletMessage(key);
    }

    const normalized = normalizeDisplayKey(trimmedRemark);
    const remarkKey = walletRemarkKeys[normalized];
    if (remarkKey) {
      const key = `remarks.${remarkKey}`;
      if (hasWalletMessage(key)) return translateWalletMessage(key);
    }

    const bizTypeKey = walletBizTypeAliases[normalized] ?? normalized;
    const bizKey = `bizTypes.${bizTypeKey}`;
    if (hasWalletMessage(bizKey)) return translateWalletMessage(bizKey);

    const txTypeKey = walletTxTypeAliases[normalized] ?? normalized;
    const txKey = `txTypes.${txTypeKey}`;
    if (hasWalletMessage(txKey)) return translateWalletMessage(txKey);

    return remark;
  };

  const getTxIcon = (type: string) => {
    switch (type) {
      case "IN":
        return <ArrowDownLeft className="h-5 w-5 text-emerald-500" strokeWidth={2} />;
      case "OUT":
        return <ArrowUpRight className="h-5 w-5 text-rose-500" strokeWidth={2} />;
      case "FREEZE":
        return <Snowflake className="h-5 w-5 text-blue-500" strokeWidth={2} />;
      case "UNFREEZE":
        return <Unlock className="h-5 w-5 text-amber-500" strokeWidth={2} />;
      default:
        return <Receipt className="h-5 w-5 text-muted-foreground" strokeWidth={2} />;
    }
  };

  const getTxColorClass = (type: string) => {
    switch (type) {
      case "IN":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "OUT":
        return "bg-rose-500/10 border-rose-500/20";
      case "FREEZE":
        return "bg-blue-500/10 border-blue-500/20";
      case "UNFREEZE":
        return "bg-amber-500/10 border-amber-500/20";
      default:
        return "bg-muted border-border";
    }
  };

  const getAmountColorClass = (type: string) => {
    switch (type) {
      case "IN":
      case "UNFREEZE":
        return "text-emerald-500 dark:text-emerald-400";
      case "OUT":
      case "FREEZE":
        return "text-rose-500 dark:text-rose-400";
      default:
        return "text-foreground";
    }
  };

  const getDisplayAmount = (row: WalletTransactionResponse) => {
    const amount = Math.abs(Number(row.amount) || 0);
    if (row.txType === "OUT" || row.txType === "FREEZE") {
      return -amount;
    }
    return amount;
  };

  const totalIncome = (wallet.data?.totalRecharge ?? 0) + (wallet.data?.totalProfit ?? 0) + (wallet.data?.totalCommission ?? 0);
  const totalSpending = wallet.data 
    ? (totalIncome - (wallet.data.availableBalance + wallet.data.frozenBalance) - (wallet.data.totalWithdraw ?? 0))
    : 0;
  const highlightedTxFound = Boolean(
    highlightedTxNo && transactions.page.records.some((row) => row.txNo === highlightedTxNo),
  );

  return (
    <div className="space-y-6 pb-20">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />

      {/* Premium 5-Card Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Available Balance Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
          <div className="flex items-center justify-between mb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
              <Wallet className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("stats.available")}</span>
          </div>
          <div className="space-y-1">
            {wallet.loading ? (
              <div className="h-10 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <MoneyText value={wallet.data?.availableBalance} className="text-3xl font-black tracking-tight" />
            )}
          </div>
        </div>

        {/* Frozen Balance Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:border-blue-500/30">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl transition-all group-hover:bg-blue-500/10" />
          <div className="flex items-center justify-between mb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-inner">
              <Lock className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("stats.frozen")}</span>
          </div>
          <div className="space-y-1">
            {wallet.loading ? (
              <div className="h-10 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <MoneyText value={wallet.data?.frozenBalance} className="text-3xl font-black tracking-tight" />
            )}
          </div>
        </div>

        {/* Total Income Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:border-emerald-500/30">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl transition-all group-hover:bg-emerald-500/10" />
          <div className="flex items-center justify-between mb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-inner">
              <ArrowDownLeft className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("stats.income")}</span>
          </div>
          <div className="space-y-1">
            {wallet.loading ? (
              <div className="h-10 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <MoneyText value={totalIncome} className="text-3xl font-black tracking-tight text-emerald-500" />
            )}
          </div>
        </div>

        {/* Total Consumption Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:border-rose-500/30">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/5 blur-3xl transition-all group-hover:bg-rose-500/10" />
          <div className="flex items-center justify-between mb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-inner">
              <ArrowUpRight className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("stats.expense")}</span>
          </div>
          <div className="space-y-1">
            {wallet.loading ? (
              <div className="h-10 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <MoneyText value={totalSpending} className="text-3xl font-black tracking-tight text-rose-500" />
            )}
          </div>
        </div>

        {/* Total Withdrawal Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:border-amber-500/30">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl transition-all group-hover:bg-amber-500/10" />
          <div className="flex items-center justify-between mb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner">
              <ArrowUp className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("stats.withdraw")}</span>
          </div>
          <div className="space-y-1">
            {wallet.loading ? (
              <div className="h-10 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <MoneyText value={wallet.data?.totalWithdraw} className="text-3xl font-black tracking-tight" />
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full lg:w-auto overflow-x-auto">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border/50">
            <TabsTrigger value="ALL" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("filters.allTypes")}
            </TabsTrigger>
            <TabsTrigger value="IN" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("txTypes.IN")}
            </TabsTrigger>
            <TabsTrigger value="OUT" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("txTypes.OUT")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={bizType} onValueChange={handleBizTypeChange}>
            <SelectTrigger className="h-10 w-[160px] bg-card border-border text-xs font-medium">
              <SelectValue placeholder={t("filters.allBiz")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("filters.allBiz")}</SelectItem>
              <SelectItem value="RECHARGE">{t("bizTypes.RECHARGE")}</SelectItem>
              <SelectItem value="WITHDRAW">{t("bizTypes.WITHDRAW")}</SelectItem>
              <SelectItem value="RENT_PAY">{t("bizTypes.RENT_PAY")}</SelectItem>
              <SelectItem value="API_DEPLOY_FEE">{t("bizTypes.API_DEPLOY_FEE")}</SelectItem>
              <SelectItem value="RENT_PROFIT">{t("bizTypes.RENT_PROFIT")}</SelectItem>
              <SelectItem value="COMMISSION_PROFIT">{t("bizTypes.COMMISSION_PROFIT")}</SelectItem>
              <SelectItem value="SETTLEMENT">{t("bizTypes.SETTLEMENT")}</SelectItem>
              <SelectItem value="EARLY_PENALTY">{t("bizTypes.EARLY_PENALTY")}</SelectItem>
              <SelectItem value="REFUND">{t("bizTypes.REFUND")}</SelectItem>
              <SelectItem value="ADJUST">{t("bizTypes.ADJUST")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="h-10 w-[140px] bg-card border-border text-xs font-medium">
              <SelectValue placeholder={t("filters.allTime")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("filters.allTime")}</SelectItem>
              <SelectItem value="3">{t("filters.last3Days")}</SelectItem>
              <SelectItem value="7">{t("filters.last7Days")}</SelectItem>
              <SelectItem value="30">{t("filters.last30Days")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {highlightedTxNo ? (
        <div className="flex flex-col gap-1 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            {t("linkage.target")}{" "}
            <span className="font-mono text-xs font-semibold text-primary">{highlightedTxNo}</span>
          </span>
          {!transactions.loading && !highlightedTxFound ? (
            <span className="text-xs text-muted-foreground">{t("linkage.notFound")}</span>
          ) : null}
        </div>
      ) : null}

      {/* Transactions List */}
      <div className="min-h-[400px]">
        {transactions.loading && transactions.page.records.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{dt("loading")}</span>
          </div>
        ) : transactions.page.records.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/30">
            <FileText className="h-10 w-10 text-muted-foreground/40" />
            <span className="text-sm font-medium text-muted-foreground">{t("empty")}</span>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.page.records.map((row) => (
              <div
                key={row.txNo}
                ref={(node) => {
                  txRowRefs.current[row.txNo] = node;
                }}
                className={cn(
                  "group flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:bg-muted/10 gap-4",
                  row.txNo === highlightedTxNo && "border-primary/50 bg-primary/5 shadow-md ring-2 ring-primary/15",
                )}
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-background shadow-inner transition-colors", getTxColorClass(row.txType))}>
                    {getTxIcon(row.txType)}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {getBizTypeLabel(row.bizType)}
                      </span>
                      {row.bizOrderNo && (
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                          {t("columns.bizOrderNo")}: {row.bizOrderNo}
                        </span>
                      )}
                    </div>
                    {row.remark && (
                      <span className="text-xs text-muted-foreground line-clamp-1 max-w-[280px]">
                        {getRemarkLabel(row.remark)}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground/70 flex items-center gap-2">
                      <DateTimeText value={row.createdAt} />
                      <span className="font-mono text-[10px] opacity-70">TXID: {row.txNo.slice(-12)}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end pl-16 sm:pl-0 mt-2 sm:mt-0 bg-muted/20 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none">
                  <MoneyText 
                    value={getDisplayAmount(row)}
                    signed={row.txType === "IN" || row.txType === "UNFREEZE" || row.txType === "OUT" || row.txType === "FREEZE"} 
                    className={cn("text-lg font-black tracking-tight drop-shadow-sm", getAmountColorClass(row.txType))} 
                  />
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[11px] text-muted-foreground">
                     <span className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-emerald-500/50"></span>
                        {t("columns.available")}: <MoneyText value={row.afterAvailableBalance} className="font-medium text-foreground/80" />
                     </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {transactions.page.total > transactions.page.pageSize && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-border pt-6 gap-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {dt("pageSummary", {
              pageNo: transactions.page.pageNo,
              pageCount: Math.ceil(transactions.page.total / transactions.page.pageSize),
              total: transactions.page.total
            })}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={transactions.page.pageNo <= 1}
              onClick={() => transactions.changePage(transactions.page.pageNo - 1)}
            >
              {dt("previousPage")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={transactions.page.pageNo >= Math.ceil(transactions.page.total / transactions.page.pageSize)}
              onClick={() => transactions.changePage(transactions.page.pageNo + 1)}
            >
              {dt("nextPage")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
