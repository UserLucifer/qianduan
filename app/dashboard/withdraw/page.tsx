"use client";

import { useCallback, useState } from "react";
import { Eye, Send, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSection } from "@/components/shared/DetailDrawer";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cancelWithdrawOrder, createWithdrawOrder, getWithdrawOrderDetail, getWithdrawOrders } from "@/api/withdraw";
import { getWalletInfo } from "@/api/wallet";
import type { PageResult, WalletMeResponse, WithdrawOrderQueryRequest, WithdrawOrderResponse } from "@/api/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { toErrorMessage } from "@/lib/format";

const initialParams: WithdrawOrderQueryRequest = { pageNo: 1, pageSize: 10 };
const networks = ["TRC20", "ERC20", "BEP20"];

export default function WithdrawPage() {
  const walletLoader = useCallback(async (): Promise<WalletMeResponse> => {
    const res = await getWalletInfo();
    return res.data;
  }, []);
  const loader = useCallback(async (params: WithdrawOrderQueryRequest): Promise<PageResult<WithdrawOrderResponse>> => {
    const res = await getWithdrawOrders(params);
    return res.data;
  }, []);
  const wallet = useAsyncResource(walletLoader);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialParams);
  const [filters, setFilters] = useState<WithdrawOrderQueryRequest>(initialParams);
  const [network, setNetwork] = useState("TRC20");
  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [detail, setDetail] = useState<WithdrawOrderResponse | null>(null);

  const submitWithdraw = async () => {
    setMessage(null);
    setActionError(null);
    try {
      const applyAmount = Number(amount);
      if (!Number.isFinite(applyAmount) || applyAmount <= 0) throw new Error("请输入有效提现金额。");
      if (wallet.data && applyAmount > wallet.data.availableBalance) throw new Error("可用余额不足。");
      if (!accountNo.trim()) throw new Error("请输入收款地址。");
      await createWithdrawOrder({ network, accountName: accountName || undefined, accountNo, applyAmount });
      setAmount("");
      setAccountNo("");
      setAccountName("");
      setMessage("提现申请已提交，等待财务审核。");
      await Promise.all([reload(), wallet.reload()]);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const openDetail = async (withdrawNo: string) => {
    setActionError(null);
    try {
      const res = await getWithdrawOrderDetail(withdrawNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const cancelOrder = async (withdrawNo: string) => {
    setActionError(null);
    try {
      await cancelWithdrawOrder(withdrawNo);
      await Promise.all([reload(), wallet.reload()]);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<WithdrawOrderResponse>[] = [
    { key: "withdrawNo", title: "提现订单", render: (row) => <span className="font-mono text-xs">{row.withdrawNo}</span> },
    { key: "applyAmount", title: "提现金额", render: (row) => <MoneyText value={row.applyAmount} /> },
    { key: "feeAmount", title: "手续费 / 到账", render: (row) => <span><MoneyText value={row.feeAmount} /> / <MoneyText value={row.actualAmount} /></span> },
    { key: "network", title: "收款信息", render: (row) => <span>{row.network} · <CopyableSecret value={row.accountNo} canReveal={false} /></span> },
    { key: "status", title: "审核状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "paidAt", title: "打款时间", render: (row) => <DateTimeText value={row.paidAt} /> },
    {
      key: "actions",
      title: "操作",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDetail(row.withdrawNo)}>
            <Eye className="h-3.5 w-3.5" />详情
          </Button>
          {row.status === "PENDING_REVIEW" ? (
            <ConfirmActionButton title="取消提现申请" description="取消后冻结资金将按后端规则释放。" confirmText="确认取消" onConfirm={() => cancelOrder(row.withdrawNo)}>
              <XCircle className="h-3.5 w-3.5" />取消
            </ConfirmActionButton>
          ) : null}
        </div>
      ),
    },
  ];

  const detailSections: DetailSection[] = detail ? [
    {
      title: "提现信息",
      fields: [
        { label: "订单号", value: <span className="font-mono">{detail.withdrawNo}</span> },
        { label: "状态", value: <StatusBadge status={detail.status} /> },
        { label: "申请金额", value: <MoneyText value={detail.applyAmount} /> },
        { label: "手续费", value: <MoneyText value={detail.feeAmount} /> },
        { label: "到账金额", value: <MoneyText value={detail.actualAmount} /> },
        { label: "网络", value: detail.network },
        { label: "账户名", value: detail.accountName || "-" },
        { label: "收款地址", value: <CopyableSecret value={detail.accountNo} canReveal={false} /> },
      ],
    },
    {
      title: "审核与打款",
      fields: [
        { label: "审核备注", value: detail.reviewRemark || "-" },
        { label: "审核时间", value: <DateTimeText value={detail.reviewedAt} /> },
        { label: "打款凭证", value: detail.payProofNo || "-" },
        { label: "打款时间", value: <DateTimeText value={detail.paidAt} /> },
      ],
    },
  ] : [];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="提现管理" title="创建提现申请" description="提交提现收款信息，查看审核状态、手续费、到账金额和打款凭证。" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatsCard title="可用余额" value={<MoneyText value={wallet.data?.availableBalance} />} description={wallet.data?.currency ?? "USDT"} icon={Send} loading={wallet.loading} />
        <StatsCard title="冻结金额" value={<MoneyText value={wallet.data?.frozenBalance} />} description="提现审核或订单锁定" icon={Send} loading={wallet.loading} />
        <StatsCard title="累计提现" value={<MoneyText value={wallet.data?.totalWithdraw} />} description="历史提现金额" icon={Send} loading={wallet.loading} />
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <Select value={network} onValueChange={setNetwork}>
            <SelectTrigger className="h-9 w-full bg-background text-foreground">
              <SelectValue placeholder="网络" />
            </SelectTrigger>
            <SelectContent>
              {networks.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="收款人（可选）" className="h-9 bg-background text-foreground" />
          <Input value={accountNo} onChange={(event) => setAccountNo(event.target.value)} placeholder="收款地址" className="h-9 bg-background text-foreground lg:col-span-2" />
          <Input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="提现金额 USDT" className="h-9 bg-background text-foreground" />
        </div>
        <Button onClick={() => void submitWithdraw()} className="mt-4 bg-[#5e6ad2] text-white hover:bg-[#7170ff]">提交提现申请</Button>
      </div>

      <SearchPanel
        onSearch={() => updateParams({ ...filters, pageNo: 1 })}
        onReset={() => {
          setFilters(initialParams);
          updateParams(initialParams);
        }}
      >
        <div className="space-y-2">
          <Label>提现状态</Label>
          <Select value={filters.status ?? "ALL"} onValueChange={(value) => setFilters((current) => ({ ...current, status: value === "ALL" ? undefined : value }))}>
            <SelectTrigger className="h-9 min-w-[140px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部状态</SelectItem>
              <SelectItem value="PENDING_REVIEW">待审核</SelectItem>
              <SelectItem value="APPROVED">已通过</SelectItem>
              <SelectItem value="REJECTED">已拒绝</SelectItem>
              <SelectItem value="PAID">已打款</SelectItem>
              <SelectItem value="CANCELLED">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>开始日期</Label>
          <Input
            type="date"
            value={filters.startTime ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value || undefined }))}
            className="h-9 w-[160px] bg-background text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label>结束日期</Label>
          <Input
            type="date"
            value={filters.endTime ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value || undefined }))}
            className="h-9 w-[160px] bg-background text-foreground"
          />
        </div>
      </SearchPanel>

      {message ? <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{message}</div> : null}
      {error || actionError ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error ?? actionError}</div> : null}
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.withdrawNo} loading={loading} emptyText="暂无提现申请。" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer open={Boolean(detail)} title="提现详情" subtitle={detail?.withdrawNo} sections={detailSections} onClose={() => setDetail(null)} />
    </div>
  );
}
