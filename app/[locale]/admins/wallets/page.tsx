"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight, Eye, HandCoins, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MoneyText } from "@/components/shared/MoneyText";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAdminWalletByUser, getAdminWalletTransactions, getAdminWallets } from "@/api/admin";
import type { AdminWalletQuery, AdminWalletTransactionQuery, UserWallet, WalletTransactionResponse } from "@/api/types";
import { Link } from "@/i18n/navigation";
import { bizTypeLabel, txTypeLabel } from "@/lib/status";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { cn } from "@/lib/utils";
import { WalletBusinessType, WalletTransactionType } from "@/types/enums";

const walletInitial: AdminWalletQuery = { pageNo: 1, pageSize: 10 };
const txInitial: AdminWalletTransactionQuery = { pageNo: 1, pageSize: 10 };
const ALL_VALUE = "ALL";

const parseQueryUserId = (value: string | null) => {
  const next = Number(value);
  return Number.isFinite(next) && next > 0 ? next : undefined;
};

const parseQueryBizType = (value: string | null) => {
  if (!value) return ALL_VALUE;
  return Object.values(WalletBusinessType).includes(value as WalletBusinessType) ? value : ALL_VALUE;
};

const formatLocalDateStart = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} 00:00:00`;
};

const getStartTimeByDateRange = (dateRange: string) => {
  if (dateRange === ALL_VALUE) return undefined;

  const days = Number(dateRange);
  if (!Number.isFinite(days)) return undefined;

  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatLocalDateStart(d);
};

/**
 * Derive display amount with correct sign based on txType.
 * Backend always returns a positive `amount`. OUT should show negative,
 * IN positive, FREEZE/UNFREEZE neutral (absolute).
 */
function getSignedAmount(amount: number, txType: string): number {
  const abs = Math.abs(amount);
  switch (txType) {
    case WalletTransactionType.IN:
      return abs;
    case WalletTransactionType.OUT:
      return -abs;
    default:
      // FREEZE / UNFREEZE — neutral, no sign
      return abs;
  }
}

/** Whether this txType uses signed (+/-) coloring */
function isTxTypeSigned(txType: string): boolean {
  return txType === WalletTransactionType.IN || txType === WalletTransactionType.OUT;
}

/** Badge class per txType for quick visual scan */
const TX_TYPE_BADGE_CLASS: Record<string, string> = {
  [WalletTransactionType.IN]:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  [WalletTransactionType.OUT]:
    "border-rose-400/20 bg-rose-400/10 text-rose-300",
  [WalletTransactionType.FREEZE]:
    "border-amber-400/20 bg-amber-400/10 text-amber-300",
  [WalletTransactionType.UNFREEZE]:
    "border-sky-400/20 bg-sky-400/10 text-sky-300",
};

function TxTypeBadge({ txType, label }: { txType: string; label: string }) {
  const cls = TX_TYPE_BADGE_CLASS[txType] ?? "border-border bg-muted text-muted-foreground";
  return (
    <Badge
      variant="outline"
      className={cn(
        "whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-none",
        cls,
      )}
    >
      {label}
    </Badge>
  );
}

/** A cell value wrapped in a tooltip if the text may be truncated */
function TruncatedCell({ value, className }: { value: string; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("truncate", className)}>{value}</div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs break-all">
        {value}
      </TooltipContent>
    </Tooltip>
  );
}

const BalanceChange = ({
  before,
  after,
  currency,
}: {
  before: number | null | undefined;
  after: number | null | undefined;
  currency?: string;
}) => {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <MoneyText value={before} currency={currency} className="font-medium text-muted-foreground" />
      <span className="text-muted-foreground">-&gt;</span>
      <MoneyText value={after} currency={currency} />
    </span>
  );
};

export default function AdminWalletsPage() {
  const t = useTranslations("AdminPages.wallets");
  const tableT = useTranslations("DataTable");
  const statusT = useTranslations("Status");
  const searchParams = useSearchParams();
  const queryUserId = useMemo(() => parseQueryUserId(searchParams.get("user_id")), [searchParams]);
  const queryBizType = useMemo(() => parseQueryBizType(searchParams.get("biz_type")), [searchParams]);
  const walletInitialParams = useMemo<AdminWalletQuery>(() => ({
    ...walletInitial,
    user_id: queryUserId,
  }), [queryUserId]);
  const txInitialParams = useMemo<AdminWalletTransactionQuery>(() => ({
    ...txInitial,
    user_id: queryUserId,
    biz_type: queryBizType === ALL_VALUE ? undefined : queryBizType,
  }), [queryUserId, queryBizType]);
  const [walletKeyword, setWalletKeyword] = useState("");
  const [walletNo, setWalletNo] = useState("");
  const [txKeyword, setTxKeyword] = useState("");
  const [txType, setTxType] = useState(ALL_VALUE);
  const [txBizType, setTxBizType] = useState(queryBizType);
  const [txDateRange, setTxDateRange] = useState(ALL_VALUE);
  const [detail, setDetail] = useState<UserWallet | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [txDetail, setTxDetail] = useState<WalletTransactionResponse | null>(null);
  const [txDetailOpen, setTxDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const walletFiltersInitialized = useRef(false);
  const txFiltersInitialized = useRef(false);

  const walletLoader = useCallback(async (params: AdminWalletQuery) => (await getAdminWallets(params)).data, []);
  const txLoader = useCallback(async (params: AdminWalletTransactionQuery) => (await getAdminWalletTransactions(params)).data, []);
  const wallets = usePaginatedResource(walletLoader, walletInitialParams);
  const txs = usePaginatedResource(txLoader, txInitialParams);

  const walletQuery = (keyword: string, nextWalletNo: string, pageNo = 1): AdminWalletQuery => ({
    pageNo,
    pageSize: wallets.page.pageSize,
    keyword: keyword.trim() || undefined,
    user_id: queryUserId,
    wallet_no: nextWalletNo.trim() || undefined,
  });
  const txQuery = (
    keyword: string,
    type: string,
    bizType: string,
    dateRange: string,
    pageNo = 1,
  ): AdminWalletTransactionQuery => ({
    pageNo,
    pageSize: txs.page.pageSize,
    keyword: keyword.trim() || undefined,
    user_id: queryUserId,
    tx_type: type === ALL_VALUE ? undefined : type,
    biz_type: bizType === ALL_VALUE ? undefined : bizType,
    start_time: getStartTimeByDateRange(dateRange),
  });

  useEffect(() => {
    if (!walletFiltersInitialized.current) {
      walletFiltersInitialized.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      wallets.updateParams(walletQuery(walletKeyword, walletNo));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [queryUserId, walletKeyword, walletNo, wallets.page.pageSize]);

  useEffect(() => {
    if (!txFiltersInitialized.current) {
      txFiltersInitialized.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      txs.updateParams(txQuery(txKeyword, txType, txBizType, txDateRange));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [queryUserId, txKeyword, txType, txBizType, txDateRange, txs.page.pageSize]);

  const openWalletDetail = async (wallet: UserWallet) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminWalletByUser(wallet.userId);
      setDetail(res.data);
    } catch (err) {
      setDetail(wallet);
      setActionError(toErrorMessage(err));
    }
  };

  const walletColumns: DataTableColumn<UserWallet>[] = [
    { key: "walletNo", title: t("walletNo"), render: (row) => formatEmpty(row.walletNo) },
    { key: "userName", title: t("userName"), render: (row) => formatEmpty(row.userName) },
    { key: "email", title: t("email"), className: "hidden lg:table-cell", render: (row) => formatEmpty(row.email) },
    { key: "status", title: t("status"), render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" className="font-medium" onClick={() => void openWalletDetail(row)}>
            <Eye className="h-4 w-4" />
            {t("details")}
          </Button>
          <Button asChild variant="ghost" size="sm" className="font-medium">
            <Link href={`/admins/wallet-adjust?user_id=${row.userId}`}>
              <HandCoins className="h-4 w-4" />
              {t("manualAdjust")}
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<UserWallet>[] = [
    {
      title: t("walletInformation"),
      fields: [
        { label: t("walletNo"), render: (detail) => detail.walletNo },
        { label: t("userName"), render: (detail) => detail.userName },
        { label: t("email"), render: (detail) => formatEmpty(detail.email) },
        { label: t("status"), render: (detail) => <StatusBadge status={detail.status} /> },
        { label: t("currency"), render: (detail) => detail.currency },
      ],
    },
    {
      title: t("fundsInformation"),
      fields: [
        { label: t("availableBalance"), render: (detail) => <MoneyText value={detail.availableBalance} currency={detail.currency} /> },
        { label: t("frozenAmount"), render: (detail) => <MoneyText value={detail.frozenBalance} currency={detail.currency} /> },
        { label: t("totalTopUps"), render: (detail) => <MoneyText value={detail.totalRecharge} currency={detail.currency} /> },
        { label: t("totalWithdrawals"), render: (detail) => <MoneyText value={detail.totalWithdraw} currency={detail.currency} /> },
        { label: t("totalEarnings"), render: (detail) => <MoneyText value={detail.totalProfit} currency={detail.currency} /> },
        { label: t("totalCommissions"), render: (detail) => <MoneyText value={detail.totalCommission} currency={detail.currency} /> },
      ],
    },
    {
      title: t("timeInformation"),
      fields: [
        { label: t("createdAt"), render: (detail) => <DateTimeText value={detail.createdAt} /> },
        { label: t("updatedAt"), render: (detail) => <DateTimeText value={detail.updatedAt} /> },
      ],
    },
  ];

  const txDetailSections: DetailSectionDef<WalletTransactionResponse>[] = [
    {
      title: t("transactionInformation"),
      fields: [
        { label: t("transactionNo"), render: (row) => formatEmpty(row.txNo), fullWidth: true },
        { label: t("idempotencyKey"), render: (row) => formatEmpty(row.idempotencyKey), fullWidth: true },
        { label: t("userName"), render: (row) => formatEmpty(row.userName) },
        { label: t("currency"), render: (row) => formatEmpty(row.currency) },
        {
          label: t("transactionType"),
          render: (row) => <TxTypeBadge txType={row.txType} label={txTypeLabel(row.txType, statusT)} />,
        },
        {
          label: t("amount"),
          render: (row) => (
            <MoneyText
              value={getSignedAmount(row.amount, row.txType)}
              currency={row.currency}
              signed={isTxTypeSigned(row.txType)}
            />
          ),
        },
        { label: t("time"), render: (row) => <DateTimeText value={row.createdAt} /> },
      ],
    },
    {
      title: t("balanceInformation"),
      fields: [
        { label: t("availableChange"), render: (row) => <BalanceChange before={row.beforeAvailableBalance} after={row.afterAvailableBalance} currency={row.currency} />, fullWidth: true },
        { label: t("frozenChange"), render: (row) => <BalanceChange before={row.beforeFrozenBalance} after={row.afterFrozenBalance} currency={row.currency} />, fullWidth: true },
      ],
    },
    {
      title: t("businessInformation"),
      fields: [
        { label: t("businessType"), render: (row) => bizTypeLabel(row.bizType, statusT) },
        { label: t("businessNo"), render: (row) => formatEmpty(row.bizOrderNo), fullWidth: true },
        { label: t("remark"), render: (row) => <span className="whitespace-pre-wrap break-words">{formatEmpty(row.remark)}</span>, fullWidth: true },
      ],
    },
  ];

  const openTxDetail = (row: WalletTransactionResponse) => {
    setTxDetail(row);
    setTxDetailOpen(true);
  };

  const txPageCount = txs.page.pageSize && txs.page.total ? Math.max(1, Math.ceil(txs.page.total / txs.page.pageSize)) : 1;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6">
        <PageHeader eyebrow="WALLET OPS" title={t("walletManagement")} description={t("reviewUserWalletBalancesFrozenAmountsAndPlatformFundTransactions")} />
        <ErrorAlert message={actionError ?? wallets.error ?? txs.error} />

        <Tabs defaultValue={queryUserId || queryBizType !== ALL_VALUE ? "transactions" : "wallets"} className="space-y-4">
          <TabsList className="border border-border bg-muted/40">
            <TabsTrigger value="wallets">{t("userWallets")}</TabsTrigger>
            <TabsTrigger value="transactions">{t("fundTransactions")}</TabsTrigger>
          </TabsList>

          <TabsContent value="wallets" className="space-y-4">
            <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-end">
              <div className="relative w-full sm:w-[240px]">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={walletKeyword}
                  onChange={(event) => setWalletKeyword(event.target.value)}
                  placeholder={t("searchUserOrEmail")}
                  className="h-10 pl-9 border-border bg-card text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <Input
                value={walletNo}
                onChange={(event) => setWalletNo(event.target.value)}
                placeholder={t("searchWalletNo")}
                className="h-10 w-full border-border bg-card text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary sm:w-[220px]"
              />
            </div>
            <DataTable columns={walletColumns} data={wallets.page.records} rowKey={(row) => row.walletNo} loading={wallets.loading} emptyText={t("noSYet")} pageNo={wallets.page.pageNo} pageSize={wallets.page.pageSize} total={wallets.page.total} onPageChange={wallets.changePage} />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
              <Tabs value={txType} onValueChange={setTxType} className="w-full lg:w-auto overflow-x-auto">
                <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border/50">
                  <TabsTrigger value={ALL_VALUE} className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
                    {t("allTypes")}
                  </TabsTrigger>
                  <TabsTrigger value="IN" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
                    {t("credit")}
                  </TabsTrigger>
                  <TabsTrigger value="OUT" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
                    {t("debit")}
                  </TabsTrigger>
                  <TabsTrigger value="FREEZE" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
                    {t("freeze")}
                  </TabsTrigger>
                  <TabsTrigger value="UNFREEZE" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
                    {t("unfreeze")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-[240px]">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={txKeyword}
                    onChange={(event) => setTxKeyword(event.target.value)}
                    placeholder={t("searchUserOrEmail")}
                    className="h-10 pl-9 border-border bg-card text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
                <Select
                  value={txBizType}
                  onValueChange={setTxBizType}
                >
                  <SelectTrigger className="h-10 w-[150px] bg-card border-border text-xs font-medium">
                    <SelectValue placeholder={t("allBusinessTypes")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_VALUE}>{t("allBusinessTypes")}</SelectItem>
                    <SelectItem value={WalletBusinessType.RECHARGE}>{t("topUp")}</SelectItem>
                    <SelectItem value={WalletBusinessType.WITHDRAW}>{t("withdrawal")}</SelectItem>
                    <SelectItem value={WalletBusinessType.RENT_PAY}>{t("orderPayment")}</SelectItem>
                    <SelectItem value={WalletBusinessType.RENT_PROFIT}>{t("orderEarnings")}</SelectItem>
                    <SelectItem value={WalletBusinessType.COMMISSION_PROFIT}>{t("referralCommission")}</SelectItem>
                    <SelectItem value={WalletBusinessType.ADJUST}>{t("manualAdjust")}</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={txDateRange}
                  onValueChange={setTxDateRange}
                >
                  <SelectTrigger className="h-10 w-[120px] bg-card border-border text-xs font-medium">
                    <SelectValue placeholder={t("allTime")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t("allTime")}</SelectItem>
                    <SelectItem value="3">{t("last3Days")}</SelectItem>
                    <SelectItem value="7">{t("last7Days")}</SelectItem>
                    <SelectItem value="30">{t("last30Days")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              {txs.loading ? (
                <div className="flex h-40 items-center justify-center rounded-lg border bg-card text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tableT("loading")}
                </div>
              ) : txs.page.records.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed bg-card/40 text-sm text-muted-foreground">
                  {t("noFundTransactionsYet")}
                </div>
              ) : (
                txs.page.records.map((row) => (
                  <div
                    key={row.txNo}
                    role="button"
                    tabIndex={0}
                    className="group flex cursor-pointer flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:flex-row lg:items-center lg:justify-between"
                    onClick={() => openTxDetail(row)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openTxDetail(row);
                      }
                    }}
                  >
                    {/* Rebalanced grid: txNo wider, bizType & time share space proportionally */}
                    <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(200px,1.2fr)_minmax(140px,0.8fr)_minmax(90px,0.55fr)_minmax(140px,0.75fr)_minmax(120px,0.65fr)_minmax(140px,0.75fr)]">
                      {/* Transaction No — monospace, truncated with tooltip */}
                      <div className="min-w-0 space-y-1">
                        <div className="text-[11px] font-medium text-muted-foreground">{t("transactionNo")}</div>
                        <TruncatedCell
                          value={formatEmpty(row.txNo)}
                          className="font-mono text-sm font-semibold text-foreground"
                        />
                      </div>

                      {/* User Name — truncated with tooltip */}
                      <div className="min-w-0 space-y-1">
                        <div className="text-[11px] font-medium text-muted-foreground">{t("userName")}</div>
                        <TruncatedCell
                          value={formatEmpty(row.userName)}
                          className="text-sm font-medium text-foreground"
                        />
                      </div>

                      {/* Transaction Type — semantic color badge */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-medium text-muted-foreground">{t("transactionType")}</div>
                        <TxTypeBadge txType={row.txType} label={txTypeLabel(row.txType, statusT)} />
                      </div>

                      {/* Amount — right-aligned with correct sign/color */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-medium text-muted-foreground xl:text-right">{t("amount")}</div>
                        <div className="xl:text-right">
                          <MoneyText
                            value={getSignedAmount(row.amount, row.txType)}
                            currency={row.currency}
                            signed={isTxTypeSigned(row.txType)}
                          />
                        </div>
                      </div>

                      {/* Business Type */}
                      <div className="min-w-0 space-y-1">
                        <div className="text-[11px] font-medium text-muted-foreground">{t("businessType")}</div>
                        <div className="truncate text-sm font-medium text-foreground">{bizTypeLabel(row.bizType, statusT)}</div>
                      </div>

                      {/* Time */}
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="text-[11px] font-medium text-muted-foreground">{t("time")}</div>
                        <DateTimeText value={row.createdAt} />
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center justify-end gap-1 self-end rounded-md px-1 text-xs font-medium text-muted-foreground lg:self-center">
                      <span>{t("details")}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))
              )}
            </div>
            {txs.page.total > 0 ? (
              <div className="flex flex-col gap-3 border-t border-border px-1 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium">
                  {tableT("pageSummary", { pageNo: txs.page.pageNo, pageCount: txPageCount, total: txs.page.total })}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 font-medium"
                    disabled={txs.page.pageNo <= 1}
                    onClick={() => txs.changePage(txs.page.pageNo - 1)}
                  >
                    {tableT("previousPage")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 font-medium"
                    disabled={txs.page.pageNo >= txPageCount}
                    onClick={() => txs.changePage(txs.page.pageNo + 1)}
                  >
                    {tableT("nextPage")}
                  </Button>
                </div>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>

        <DetailDrawer data={detail} open={detailOpen} title={t("walletDetails")} subtitle={(data) => data.walletNo} sections={detailSections} onClose={() => setDetailOpen(false)} />
        <DetailDrawer data={txDetail} open={txDetailOpen} title={t("transactionDetails")} subtitle={(data) => data.txNo} sections={txDetailSections} onClose={() => setTxDetailOpen(false)} />
      </div>
    </TooltipProvider>
  );
}
