"use client";

import { useCallback, useState } from "react";
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
import { bizTypeLabel, txTypeLabel } from "@/lib/status";
import { Lock, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

const initialParams: WalletTransactionQueryRequest = { pageNo: 1, pageSize: 10 };

const columns: DataTableColumn<WalletTransactionResponse>[] = [
  { key: "txNo", title: "流水号", render: (row) => <span className="font-mono text-xs">{row.txNo}</span> },
  { key: "txType", title: "交易类型", render: (row) => <StatusBadge status={row.txType} label={txTypeLabel(row.txType)} /> },
  { key: "bizType", title: "业务类型", render: (row) => bizTypeLabel(row.bizType) },
  { key: "amount", title: "金额", render: (row) => <MoneyText value={row.amount} signed={row.txType === "IN" || row.txType === "UNFREEZE"} /> },
  { key: "afterAvailableBalance", title: "可用余额", render: (row) => <MoneyText value={row.afterAvailableBalance} /> },
  { key: "afterFrozenBalance", title: "冻结余额", render: (row) => <MoneyText value={row.afterFrozenBalance} /> },
  { key: "createdAt", title: "时间", render: (row) => <DateTimeText value={row.createdAt} /> },
];

export default function WalletPage() {
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

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="钱包中心" title="钱包余额与资金流水" description="查看可用余额、冻结金额、累计收入支出，以及按交易类型和业务类型筛选资金流水。" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <StatsCard title="可用余额" value={<MoneyText value={wallet.data?.availableBalance} />} description={wallet.data?.currency ?? "USDT"} icon={Wallet} loading={wallet.loading} className="lg:col-span-1" />
        <StatsCard title="冻结金额" value={<MoneyText value={wallet.data?.frozenBalance} />} description="审核或订单锁定资金" icon={Lock} loading={wallet.loading} className="lg:col-span-1" />
        <StatsCard title="累计收入" value={<MoneyText value={(wallet.data?.totalRecharge ?? 0) + (wallet.data?.totalProfit ?? 0) + (wallet.data?.totalCommission ?? 0)} />} description="充值 + 收益 + 佣金" icon={TrendingUp} loading={wallet.loading} className="lg:col-span-1" status="good" />
        <StatsCard title="累计支出" value={<MoneyText value={wallet.data?.totalWithdraw} />} description="历史提现金额" icon={TrendingDown} loading={wallet.loading} className="lg:col-span-1" />
      </div>

      <BentoCard title="资金流水">
        <div className="mb-4">
          <SearchPanel
            onSearch={() => transactions.updateParams({ ...filters, pageNo: 1 })}
            onReset={() => {
              setFilters(initialParams);
              transactions.updateParams(initialParams);
            }}
          >
            <div className="space-y-2">
              <Label>交易类型</Label>
              <Select value={filters.txType ?? "ALL"} onValueChange={(val) => setFilters((current) => ({ ...current, txType: val === "ALL" ? undefined : val }))}>
                <SelectTrigger className="h-9 w-[120px] bg-background text-foreground">
                  <SelectValue placeholder="全部类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部类型</SelectItem>
                  <SelectItem value="IN">入账</SelectItem>
                  <SelectItem value="OUT">支出</SelectItem>
                  <SelectItem value="FREEZE">冻结</SelectItem>
                  <SelectItem value="UNFREEZE">解冻</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>业务类型</Label>
              <Select value={filters.bizType ?? "ALL"} onValueChange={(val) => setFilters((current) => ({ ...current, bizType: val === "ALL" ? undefined : val }))}>
                <SelectTrigger className="h-9 w-[160px] bg-background text-foreground">
                  <SelectValue placeholder="全部业务" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部业务</SelectItem>
                  <SelectItem value="RECHARGE">充值</SelectItem>
                  <SelectItem value="WITHDRAW">提现</SelectItem>
                  <SelectItem value="RENT_PAY">租赁支付</SelectItem>
                  <SelectItem value="API_DEPLOY_FEE">API 部署费</SelectItem>
                  <SelectItem value="RENT_PROFIT">租赁收益</SelectItem>
                  <SelectItem value="COMMISSION_PROFIT">佣金收益</SelectItem>
                  <SelectItem value="SETTLEMENT">结算</SelectItem>
                  <SelectItem value="EARLY_PENALTY">提前结算违约金</SelectItem>
                  <SelectItem value="REFUND">退款</SelectItem>
                  <SelectItem value="ADJUST">系统调账</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>开始日期</Label>
              <Input type="date" value={filters.startTime ?? ""} onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value || undefined }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <Label>结束日期</Label>
              <Input type="date" value={filters.endTime ?? ""} onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value || undefined }))} className="h-9 w-[150px] bg-background text-foreground" />
            </div>
          </SearchPanel>
        </div>
        <ErrorAlert message={transactions.error} />
        <DataTable columns={columns} data={transactions.page.records} rowKey={(row) => row.txNo} loading={transactions.loading} emptyText="暂无资金流水。" pageNo={transactions.page.pageNo} pageSize={transactions.page.pageSize} total={transactions.page.total} onPageChange={transactions.changePage} />
      </BentoCard>
    </div>
  );
}
