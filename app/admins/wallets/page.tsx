"use client";

import { useCallback, useState } from "react";
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
    { key: "walletNo", title: "钱包编号", render: (row) => formatEmpty(row.walletNo) },
    { key: "userName", title: "用户名称", render: (row) => formatEmpty(row.userName) },
    { key: "availableBalance", title: "可用余额", render: (row) => <MoneyText value={row.availableBalance} currency={row.currency} /> },
    { key: "frozenBalance", title: "冻结金额", render: (row) => <MoneyText value={row.frozenBalance} currency={row.currency} /> },
    { key: "totalRecharge", title: "累计充值", render: (row) => <MoneyText value={row.totalRecharge} currency={row.currency} /> },
    { key: "totalWithdraw", title: "累计提现", render: (row) => <MoneyText value={row.totalWithdraw} currency={row.currency} /> },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <Button variant="ghost" size="sm" className="font-medium" onClick={() => void openWalletDetail(row)}>
          <Eye className="h-4 w-4" />
          详情
        </Button>
      ),
    },
  ];

  const txColumns: DataTableColumn<WalletTransactionResponse>[] = [
    { key: "txNo", title: "流水号", render: (row) => formatEmpty(row.txNo) },
    { key: "txType", title: "交易类型", render: (row) => txTypeLabel(row.txType) },
    { key: "bizType", title: "业务类型", render: (row) => bizTypeLabel(row.bizType) },
    { key: "amount", title: "金额", render: (row) => <MoneyText value={row.amount} signed /> },
    { key: "bizOrderNo", title: "业务单号", render: (row) => formatEmpty(row.bizOrderNo) },
    { key: "createdAt", title: "时间", render: (row) => <DateTimeText value={row.createdAt} /> },
  ];

  const detailSections: DetailSectionDef<UserWallet>[] = [
    {
      title: "钱包信息",
      fields: [
        { label: "钱包编号", render: (detail) => detail.walletNo },
        { label: "用户名称", render: (detail) => detail.userName },
        { label: "状态", render: (detail) => <StatusBadge status={detail.status} /> },
        { label: "币种", render: (detail) => detail.currency },
      ],
    },
    {
      title: "资金信息",
      fields: [
        { label: "可用余额", render: (detail) => <MoneyText value={detail.availableBalance} currency={detail.currency} /> },
        { label: "冻结金额", render: (detail) => <MoneyText value={detail.frozenBalance} currency={detail.currency} /> },
        { label: "累计充值", render: (detail) => <MoneyText value={detail.totalRecharge} currency={detail.currency} /> },
        { label: "累计提现", render: (detail) => <MoneyText value={detail.totalWithdraw} currency={detail.currency} /> },
        { label: "累计收益", render: (detail) => <MoneyText value={detail.totalProfit} currency={detail.currency} /> },
        { label: "累计佣金", render: (detail) => <MoneyText value={detail.totalCommission} currency={detail.currency} /> },
      ],
    },
    {
      title: "时间信息",
      fields: [
        { label: "创建时间", render: (detail) => <DateTimeText value={detail.createdAt} /> },
        { label: "更新时间", render: (detail) => <DateTimeText value={detail.updatedAt} /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="WALLET OPS" title="钱包管理" description="查看用户钱包余额、冻结金额和平台资金流水。" />
      <ErrorAlert message={actionError ?? wallets.error ?? txs.error} />

      <Tabs defaultValue="wallets" className="space-y-4">
        <TabsList className="border border-border bg-muted/40">
          <TabsTrigger value="wallets">用户钱包</TabsTrigger>
          <TabsTrigger value="transactions">资金流水</TabsTrigger>
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
              <Label htmlFor="w_userId">用户 ID</Label>
              <Input id="w_userId" placeholder="输入 ID" value={walletFilters.userId} onChange={(event) => setWalletFilters((current) => ({ ...current, userId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="walletNo">钱包编号</Label>
              <Input id="walletNo" placeholder="输入编号" value={walletFilters.walletNo} onChange={(event) => setWalletFilters((current) => ({ ...current, walletNo: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
            </div>
          </SearchPanel>
          <DataTable columns={walletColumns} data={wallets.page.records} rowKey={(row) => row.walletNo} loading={wallets.loading} emptyText="暂无钱包数据" pageNo={wallets.page.pageNo} pageSize={wallets.page.pageSize} total={wallets.page.total} onPageChange={wallets.changePage} />
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
              <Label htmlFor="t_userId">用户 ID</Label>
              <Input id="t_userId" placeholder="输入 ID" value={txFilters.userId} onChange={(event) => setTxFilters((current) => ({ ...current, userId: event.target.value }))} className="h-9 w-[100px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t_walletNo">钱包编号</Label>
              <Input id="t_walletNo" placeholder="输入编号" value={txFilters.walletNo} onChange={(event) => setTxFilters((current) => ({ ...current, walletNo: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>收支类型</Label>
              <Select value={txFilters.txType} onValueChange={(val) => setTxFilters((current) => ({ ...current, txType: val }))}>
                <SelectTrigger className="h-9 w-[120px] bg-background text-foreground">
                  <SelectValue placeholder="全部类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">全部类型</SelectItem>
                  <SelectItem value="IN">入账 (+)</SelectItem>
                  <SelectItem value="OUT">出账 (-)</SelectItem>
                  <SelectItem value="FREEZE">冻结</SelectItem>
                  <SelectItem value="UNFREEZE">解冻</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>业务类型</Label>
              <Select value={txFilters.bizType} onValueChange={(val) => setTxFilters((current) => ({ ...current, bizType: val }))}>
                <SelectTrigger className="h-9 w-[140px] bg-background text-foreground">
                  <SelectValue placeholder="全部业务" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">全部业务</SelectItem>
                  <SelectItem value="RECHARGE">充值</SelectItem>
                  <SelectItem value="WITHDRAW">提现</SelectItem>
                  <SelectItem value="ORDER_PAY">订单支付</SelectItem>
                  <SelectItem value="ORDER_PROFIT">订单收益</SelectItem>
                  <SelectItem value="ORDER_SETTLE">订单结算</SelectItem>
                  <SelectItem value="COMMISSION">分销佣金</SelectItem>
                  <SelectItem value="PENALTY">违约扣款</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>开始日期</Label>
              <Input type="date" value={txFilters.startTime} onChange={(event) => setTxFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>结束日期</Label>
              <Input type="date" value={txFilters.endTime} onChange={(event) => setTxFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
          </SearchPanel>
          <DataTable columns={txColumns} data={txs.page.records} rowKey={(row) => row.txNo} loading={txs.loading} emptyText="暂无资金流水" pageNo={txs.page.pageNo} pageSize={txs.page.pageSize} total={txs.page.total} onPageChange={txs.changePage} />
        </TabsContent>
      </Tabs>

      <DetailDrawer data={detail} open={detailOpen} title="钱包详情" subtitle={(data) => data.walletNo} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
