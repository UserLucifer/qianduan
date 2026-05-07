"use client";

import { useCallback, useEffect, useState } from "react";
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

function normalizeDisplayKey(value: string): string {
  return value
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}

export default function WalletPage() {
  const t = useTranslations("DashboardWallet");
  const dt = useTranslations("DataTable");

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
       startTime = d.toISOString().split("T")[0];
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
    return t.has(key as any) ? t(key as any) : type;
  };

  const getRemarkLabel = (remark: string | null | undefined) => {
    if (!remark) return "";
    const normalized = normalizeDisplayKey(remark);
    const bizTypeKey = walletBizTypeAliases[normalized] ?? normalized;
    const bizKey = `bizTypes.${bizTypeKey}`;
    if (t.has(bizKey as any)) return t(bizKey as any);

    const txTypeKey = walletTxTypeAliases[normalized] ?? normalized;
    const txKey = `txTypes.${txTypeKey}`;
    if (t.has(txKey as any)) return t(txKey as any);

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
        return "text-foreground"; // Keep out/freeze neutral or default color
      default:
        return "text-foreground";
    }
  };

  const totalIncome = (wallet.data?.totalRecharge ?? 0) + (wallet.data?.totalProfit ?? 0) + (wallet.data?.totalCommission ?? 0);

  return (
    <div className="space-y-6 pb-20">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />

      {/* Hero Asset Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Available Balance Card */}
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm flex flex-col justify-between">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-[60px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-primary/10 p-2">
                <Wallet className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <h2 className="text-sm font-medium text-muted-foreground">{t("stats.available")}</h2>
            </div>
            
            <div className="mt-6 flex items-baseline gap-2">
              {wallet.loading ? (
                <div className="h-12 w-48 animate-pulse rounded bg-muted" />
              ) : (
                <>
                  <MoneyText value={wallet.data?.availableBalance} className="text-5xl font-black tracking-tighter" />
                  <span className="text-lg font-semibold text-muted-foreground">{wallet.data?.currency ?? "USDT"}</span>
                </>
              )}
            </div>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 border-t border-border/50 pt-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <ArrowDown className="h-3 w-3 text-emerald-500" strokeWidth={2} />
                {t("stats.income")}
              </p>
              {wallet.loading ? (
                <div className="h-6 w-24 animate-pulse rounded bg-muted" />
              ) : (
                <MoneyText value={totalIncome} className="text-lg font-bold" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <ArrowUp className="h-3 w-3 text-rose-500" strokeWidth={2} />
                {t("stats.expense")}
              </p>
              {wallet.loading ? (
                <div className="h-6 w-24 animate-pulse rounded bg-muted" />
              ) : (
                <MoneyText value={wallet.data?.totalWithdraw} className="text-lg font-bold" />
              )}
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-full bg-blue-500/10 p-2">
                <Lock className="h-4 w-4 text-blue-500" strokeWidth={2} />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">{t("stats.frozen")}</h3>
            </div>
            {wallet.loading ? (
              <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <MoneyText value={wallet.data?.frozenBalance} className="text-2xl font-bold" />
            )}
            <p className="text-xs text-muted-foreground mt-2">{t("stats.frozenDesc")}</p>
          </div>
          
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 flex-1 flex flex-col items-center justify-center text-center">
             <div className="rounded-full bg-muted p-3 mb-3">
               <History className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
             </div>
             <p className="text-sm font-medium text-foreground">{t("cardTitle")}</p>
             <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">
                {t("stats.historyDesc")}
             </p>
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
            <TabsTrigger value="FREEZE" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("txTypes.FREEZE")}
            </TabsTrigger>
            <TabsTrigger value="UNFREEZE" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("txTypes.UNFREEZE")}
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
              <SelectItem value="ACTIVATE_TIMEOUT_REFUND">{t("bizTypes.ACTIVATE_TIMEOUT_REFUND")}</SelectItem>
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
                className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:bg-muted/10 gap-4"
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
                          {row.bizOrderNo}
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
                      <span className="font-mono text-[9px] opacity-50">#{row.txNo}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end pl-16 sm:pl-0 mt-2 sm:mt-0 bg-muted/20 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none">
                  <MoneyText 
                    value={row.amount} 
                    signed={row.txType === "IN" || row.txType === "UNFREEZE" || row.txType === "OUT" || row.txType === "FREEZE"} 
                    className={cn("text-lg font-black tracking-tight drop-shadow-sm", getAmountColorClass(row.txType))} 
                  />
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[11px] text-muted-foreground">
                     <span className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-emerald-500/50"></span>
                        {t("columns.available")}: <MoneyText value={row.afterAvailableBalance} className="font-medium text-foreground/80" />
                     </span>
                     <span className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-blue-500/50"></span>
                        {t("columns.frozen")}: <MoneyText value={row.afterFrozenBalance} className="font-medium text-foreground/80" />
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
