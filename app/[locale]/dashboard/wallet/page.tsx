"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BentoCard } from "@/components/shared/BentoGrid";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getTransactions, getWalletInfo } from "@/api/wallet";
import type { PageResult, WalletMeResponse, WalletTransactionQueryRequest, WalletTransactionResponse } from "@/api/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { Lock, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

const initialParams: WalletTransactionQueryRequest = { pageNo: 1, pageSize: 10 };


export default function WalletPage() {
  const t = useTranslations("DashboardWallet");
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
  const [filters, setFilters] = useState<WalletTransactionQueryRequest>(initialParams);

  const getTxTypeLabel = (type: string | null | undefined) => {
    if (!type) return "-";
    const key = `txTypes.${type}`;
    return t.has(key) ? t(key) : type;
  };
  const getBizTypeLabel = (type: string | null | undefined) => {
    if (!type) return "-";
    const key = `bizTypes.${type}`;
    return t.has(key) ? t(key) : type;
  };

  const columns: DataTableColumn<WalletTransactionResponse>[] = [
    { key: "txNo", title: t("columns.txNo"), render: (row) => <span className="font-mono text-xs">{row.txNo}</span> },
    { key: "txType", title: t("columns.txType"), render: (row) => <StatusBadge status={row.txType} label={getTxTypeLabel(row.txType)} /> },
    { key: "bizType", title: t("columns.bizType"), render: (row) => getBizTypeLabel(row.bizType) },
    { key: "amount", title: t("columns.amount"), render: (row) => <MoneyText value={row.amount} signed={row.txType === "IN" || row.txType === "UNFREEZE"} /> },
    { key: "afterAvailableBalance", title: t("columns.available"), render: (row) => <MoneyText value={row.afterAvailableBalance} /> },
    { key: "afterFrozenBalance", title: t("columns.frozen"), render: (row) => <MoneyText value={row.afterFrozenBalance} /> },
    { key: "createdAt", title: t("columns.time"), render: (row) => <DateTimeText value={row.createdAt} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <StatsCard title={t("stats.available")} value={<MoneyText value={wallet.data?.availableBalance} />} description={wallet.data?.currency ?? "USDT"} icon={Wallet} loading={wallet.loading} className="lg:col-span-1" />
        <StatsCard title={t("stats.frozen")} value={<MoneyText value={wallet.data?.frozenBalance} />} description={t("stats.frozenDesc")} icon={Lock} loading={wallet.loading} className="lg:col-span-1" />
        <StatsCard title={t("stats.income")} value={<MoneyText value={(wallet.data?.totalRecharge ?? 0) + (wallet.data?.totalProfit ?? 0) + (wallet.data?.totalCommission ?? 0)} />} description={t("stats.incomeDesc")} icon={TrendingUp} loading={wallet.loading} className="lg:col-span-1" status="good" />
        <StatsCard title={t("stats.expense")} value={<MoneyText value={wallet.data?.totalWithdraw} />} description={t("stats.expenseDesc")} icon={TrendingDown} loading={wallet.loading} className="lg:col-span-1" />
      </div>

      <BentoCard title={t("cardTitle")}>
        <div className="mb-4">
          <SearchPanel
            onSearch={() => transactions.updateParams({ ...filters, pageNo: 1 })}
            onReset={() => {
              setFilters(initialParams);
              transactions.updateParams(initialParams);
            }}
          >
            <div className="space-y-2">
              <Label>{t("filters.txType")}</Label>
              <Select value={filters.txType ?? "ALL"} onValueChange={(val) => setFilters((current) => ({ ...current, txType: val === "ALL" ? undefined : val }))}>
                <SelectTrigger className="h-9 w-[120px] bg-background text-foreground">
                  <SelectValue placeholder={t("filters.allTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t("filters.allTypes")}</SelectItem>
                  <SelectItem value="IN">{t("txTypes.IN")}</SelectItem>
                  <SelectItem value="OUT">{t("txTypes.OUT")}</SelectItem>
                  <SelectItem value="FREEZE">{t("txTypes.FREEZE")}</SelectItem>
                  <SelectItem value="UNFREEZE">{t("txTypes.UNFREEZE")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("filters.bizType")}</Label>
              <Select value={filters.bizType ?? "ALL"} onValueChange={(val) => setFilters((current) => ({ ...current, bizType: val === "ALL" ? undefined : val }))}>
                <SelectTrigger className="h-9 w-[160px] bg-background text-foreground">
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
            </div>
            <div className="space-y-2">
              <Label>{t("filters.startDate")}</Label>
              <Input type="date" value={filters.startTime ?? ""} onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value || undefined }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>{t("filters.endDate")}</Label>
              <Input type="date" value={filters.endTime ?? ""} onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value || undefined }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
          </SearchPanel>
        </div>
        <ErrorAlert message={transactions.error} />
        <DataTable columns={columns} data={transactions.page.records} rowKey={(row) => row.txNo} loading={transactions.loading} emptyText={t("empty")} pageNo={transactions.page.pageNo} pageSize={transactions.page.pageSize} total={transactions.page.total} onPageChange={transactions.changePage} />
      </BentoCard>
    </div>
  );
}
