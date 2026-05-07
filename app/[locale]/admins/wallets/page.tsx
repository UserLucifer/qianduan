"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MoneyText } from "@/components/shared/MoneyText";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAdminWalletByUser, getAdminWalletTransactions, getAdminWallets } from "@/api/admin";
import type { AdminWalletQuery, AdminWalletTransactionQuery, UserWallet, WalletTransactionResponse } from "@/api/types";
import { bizTypeLabel, txTypeLabel } from "@/lib/status";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface WalletFilters {
  userId: string;
  walletNo: string;
}

interface TxFilters extends WalletFilters {
  txType: string;
  bizType: string;
  startTime: string;
  endTime: string;
}

const walletInitial: AdminWalletQuery = { pageNo: 1, pageSize: 10 };
const txInitial: AdminWalletTransactionQuery = { pageNo: 1, pageSize: 10 };
const walletFiltersInitial: WalletFilters = { userId: "", walletNo: "" };
const txFiltersInitial: TxFilters = { userId: "", walletNo: "", txType: "", bizType: "", startTime: "", endTime: "" };

export default function AdminWalletsPage() {
  const t = useTranslations("AdminPages.wallets");
  const [walletFilters, setWalletFilters] = useState<WalletFilters>(walletFiltersInitial);
  const [txFilters, setTxFilters] = useState<TxFilters>(txFiltersInitial);
  const [detail, setDetail] = useState<UserWallet | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const walletLoader = useCallback(async (params: AdminWalletQuery) => (await getAdminWallets(params)).data, []);
  const txLoader = useCallback(async (params: AdminWalletTransactionQuery) => (await getAdminWalletTransactions(params)).data, []);
  const wallets = usePaginatedResource(walletLoader, walletInitial);
  const txs = usePaginatedResource(txLoader, txInitial);

  const walletQuery = (filters: WalletFilters, pageNo = 1): AdminWalletQuery => ({
    pageNo,
    pageSize: wallets.page.pageSize,
    user_id: filters.userId ? Number(filters.userId) : undefined,
    wallet_no: filters.walletNo || undefined,
  });
  const txQuery = (filters: TxFilters, pageNo = 1): AdminWalletTransactionQuery => ({
    pageNo,
    pageSize: txs.page.pageSize,
    user_id: filters.userId ? Number(filters.userId) : undefined,
    wallet_no: filters.walletNo || undefined,
    tx_type: filters.txType || undefined,
    biz_type: filters.bizType || undefined,
    start_time: filters.startTime || undefined,
    end_time: filters.endTime || undefined,
  });

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
    { key: "availableBalance", title: t("availableBalance"), render: (row) => <MoneyText value={row.availableBalance} currency={row.currency} /> },
    { key: "frozenBalance", title: t("frozenAmount"), render: (row) => <MoneyText value={row.frozenBalance} currency={row.currency} /> },
    { key: "totalRecharge", title: t("totalTopUps"), render: (row) => <MoneyText value={row.totalRecharge} currency={row.currency} /> },
    { key: "totalWithdraw", title: t("totalWithdrawals"), render: (row) => <MoneyText value={row.totalWithdraw} currency={row.currency} /> },
    { key: "status", title: t("status"), render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <Button variant="ghost" size="sm" className="font-medium" onClick={() => void openWalletDetail(row)}>
          <Eye className="h-4 w-4" />
          {t("details")}</Button>
      ),
    },
  ];

  const txColumns: DataTableColumn<WalletTransactionResponse>[] = [
    { key: "txNo", title: t("transactionNo"), render: (row) => formatEmpty(row.txNo) },
    { key: "txType", title: t("transactionType"), render: (row) => txTypeLabel(row.txType) },
    { key: "bizType", title: t("businessType"), render: (row) => bizTypeLabel(row.bizType) },
    { key: "amount", title: t("amount"), render: (row) => <MoneyText value={row.amount} signed /> },
    { key: "bizOrderNo", title: t("businessNo"), render: (row) => formatEmpty(row.bizOrderNo) },
    { key: "createdAt", title: t("time"), render: (row) => <DateTimeText value={row.createdAt} /> },
  ];

  const detailSections: DetailSectionDef<UserWallet>[] = [
    {
      title: t("walletInformation"),
      fields: [
        { label: t("walletNo"), render: (detail) => detail.walletNo },
        { label: t("userName"), render: (detail) => detail.userName },
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

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="WALLET OPS" title={t("walletManagement")} description={t("reviewUserWalletBalancesFrozenAmountsAndPlatformFundTransactions")} />
      <ErrorAlert message={actionError ?? wallets.error ?? txs.error} />

      <Tabs defaultValue="wallets" className="space-y-4">
        <TabsList className="border border-border bg-muted/40">
          <TabsTrigger value="wallets">{t("userWallets")}</TabsTrigger>
          <TabsTrigger value="transactions">{t("fundTransactions")}</TabsTrigger>
        </TabsList>

        <TabsContent value="wallets" className="space-y-4">
          <SearchPanel
            onSearch={() => wallets.updateParams(walletQuery(walletFilters))}
            onReset={() => {
              setWalletFilters(walletFiltersInitial);
              wallets.updateParams(walletInitial);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="w_userId">{t("userID")}</Label>
              <Input id="w_userId" placeholder={t("enterID")} value={walletFilters.userId} onChange={(event) => setWalletFilters((current) => ({ ...current, userId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="walletNo">{t("walletNo")}</Label>
              <Input id="walletNo" placeholder={t("enterNumber")} value={walletFilters.walletNo} onChange={(event) => setWalletFilters((current) => ({ ...current, walletNo: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
            </div>
          </SearchPanel>
          <DataTable columns={walletColumns} data={wallets.page.records} rowKey={(row) => row.walletNo} loading={wallets.loading} emptyText={t("noSYet")} pageNo={wallets.page.pageNo} pageSize={wallets.page.pageSize} total={wallets.page.total} onPageChange={wallets.changePage} />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <SearchPanel
            onSearch={() => txs.updateParams(txQuery(txFilters))}
            onReset={() => {
              setTxFilters(txFiltersInitial);
              txs.updateParams(txInitial);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="t_userId">{t("userID")}</Label>
              <Input id="t_userId" placeholder={t("enterID")} value={txFilters.userId} onChange={(event) => setTxFilters((current) => ({ ...current, userId: event.target.value }))} className="h-9 w-[100px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t_walletNo">{t("walletNo")}</Label>
              <Input id="t_walletNo" placeholder={t("enterNumber")} value={txFilters.walletNo} onChange={(event) => setTxFilters((current) => ({ ...current, walletNo: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>{t("direction")}</Label>
              <Select value={txFilters.txType} onValueChange={(val) => setTxFilters((current) => ({ ...current, txType: val }))}>
                <SelectTrigger className="h-9 w-[120px] bg-background text-foreground">
                  <SelectValue placeholder={t("allTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">{t("allTypes")}</SelectItem>
                  <SelectItem value="IN">{t("credit")}</SelectItem>
                  <SelectItem value="OUT">{t("debit")}</SelectItem>
                  <SelectItem value="FREEZE">{t("freeze")}</SelectItem>
                  <SelectItem value="UNFREEZE">{t("unfreeze")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("businessType")}</Label>
              <Select value={txFilters.bizType} onValueChange={(val) => setTxFilters((current) => ({ ...current, bizType: val }))}>
                <SelectTrigger className="h-9 w-[140px] bg-background text-foreground">
                  <SelectValue placeholder={t("allBusinessTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">{t("allBusinessTypes")}</SelectItem>
                  <SelectItem value="RECHARGE">{t("topUp")}</SelectItem>
                  <SelectItem value="WITHDRAW">{t("withdrawal")}</SelectItem>
                  <SelectItem value="ORDER_PAY">{t("orderPayment")}</SelectItem>
                  <SelectItem value="ORDER_PROFIT">{t("orderEarnings")}</SelectItem>
                  <SelectItem value="ORDER_SETTLE">{t("orderSettlement")}</SelectItem>
                  <SelectItem value="COMMISSION">{t("referralCommission")}</SelectItem>
                  <SelectItem value="PENALTY">{t("penaltyDeduction")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("startDate")}</Label>
              <Input type="date" value={txFilters.startTime} onChange={(event) => setTxFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>{t("endDate")}</Label>
              <Input type="date" value={txFilters.endTime} onChange={(event) => setTxFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
          </SearchPanel>
          <DataTable columns={txColumns} data={txs.page.records} rowKey={(row) => row.txNo} loading={txs.loading} emptyText={t("noFundTransactionsYet")} pageNo={txs.page.pageNo} pageSize={txs.page.pageSize} total={txs.page.total} onPageChange={txs.changePage} />
        </TabsContent>
      </Tabs>

      <DetailDrawer data={detail} open={detailOpen} title={t("walletDetails")} subtitle={(data) => data.walletNo} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
