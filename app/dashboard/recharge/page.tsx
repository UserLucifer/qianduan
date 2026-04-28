"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Eye, XCircle } from "lucide-react";
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
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cancelRechargeOrder, createRechargeOrder, getRechargeChannels, getRechargeOrderDetail, getRechargeOrders } from "@/api/recharge";
import type { PageResult, RechargeChannelResponse, RechargeOrderQueryRequest, RechargeOrderResponse } from "@/api/types";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { toErrorMessage } from "@/lib/format";

const initialParams: RechargeOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function RechargePage() {
  const loader = useCallback(async (params: RechargeOrderQueryRequest): Promise<PageResult<RechargeOrderResponse>> => {
    const res = await getRechargeOrders(params);
    return res.data;
  }, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialParams);
  const [channels, setChannels] = useState<RechargeChannelResponse[]>([]);
  const [filters, setFilters] = useState<RechargeOrderQueryRequest>(initialParams);
  const [channelId, setChannelId] = useState("");
  const [amount, setAmount] = useState("");
  const [externalTxNo, setExternalTxNo] = useState("");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [detail, setDetail] = useState<RechargeOrderResponse | null>(null);

  useEffect(() => {
    getRechargeChannels()
      .then((res) => {
        setChannels(res.data);
        setChannelId((current) => current || String(res.data[0]?.channelId ?? ""));
      })
      .catch((err) => setActionError(toErrorMessage(err)));
  }, []);

  const selectedChannel = channels.find((channel) => String(channel.channelId) === channelId);

  const submitRecharge = async () => {
    setSubmitting(true);
    setMessage(null);
    setActionError(null);
    try {
      if (!selectedChannel) throw new Error("请选择充值渠道。");
      const applyAmount = Number(amount);
      if (!Number.isFinite(applyAmount) || applyAmount <= 0) throw new Error("请输入有效充值金额。");
      if (applyAmount < selectedChannel.minAmount) throw new Error(`当前渠道最低充值 ${selectedChannel.minAmount} USDT。`);
      await createRechargeOrder({
        channelId: selectedChannel.channelId,
        applyAmount,
        externalTxNo: externalTxNo || undefined,
        paymentProofUrl: paymentProofUrl || undefined,
      });
      setAmount("");
      setExternalTxNo("");
      setPaymentProofUrl("");
      setMessage("充值申请已提交，等待财务审核。");
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async (rechargeNo: string) => {
    setActionError(null);
    try {
      const res = await getRechargeOrderDetail(rechargeNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const cancelOrder = async (rechargeNo: string) => {
    setActionError(null);
    try {
      await cancelRechargeOrder(rechargeNo);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<RechargeOrderResponse>[] = [
    { key: "rechargeNo", title: "充值订单", render: (row) => <span className="font-mono text-xs">{row.rechargeNo}</span> },
    { key: "applyAmount", title: "申请金额", render: (row) => <MoneyText value={row.applyAmount} /> },
    { key: "channelName", title: "支付方式", render: (row) => <span>{row.channelName} / {row.network}</span> },
    { key: "status", title: "审核状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "reviewRemark", title: "审核备注", render: (row) => row.reviewRemark || "-" },
    { key: "createdAt", title: "创建时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: "操作",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-gray-100 dark:text-muted-foreground dark:hover:bg-white/5" onClick={() => void openDetail(row.rechargeNo)}>
            <Eye className="h-3.5 w-3.5" />详情
          </Button>
          {row.status === "SUBMITTED" ? (
            <ConfirmActionButton title="取消充值申请" description="仅待审核充值申请可以取消。" confirmText="确认取消" onConfirm={() => cancelOrder(row.rechargeNo)}>
              <XCircle className="h-3.5 w-3.5" />取消
            </ConfirmActionButton>
          ) : null}
        </div>
      ),
    },
  ];

  const detailSections: DetailSection[] = detail ? [
    {
      title: "充值信息",
      fields: [
        { label: "订单号", value: <span className="font-mono">{detail.rechargeNo}</span> },
        { label: "金额", value: <MoneyText value={detail.applyAmount} /> },
        { label: "实际到账", value: <MoneyText value={detail.actualAmount} /> },
        { label: "状态", value: <StatusBadge status={detail.status} /> },
        { label: "交易哈希", value: <CopyableSecret value={detail.externalTxNo} canReveal={false} /> },
        { label: "凭证 URL", value: <CopyableSecret value={detail.paymentProofUrl} canReveal={false} /> },
      ],
    },
    {
      title: "审核信息",
      fields: [
        { label: "审核备注", value: detail.reviewRemark || "-" },
        { label: "审核时间", value: <DateTimeText value={detail.reviewedAt} /> },
        { label: "入账时间", value: <DateTimeText value={detail.creditedAt} /> },
        { label: "钱包流水", value: detail.walletTxNo || "-" },
      ],
    },
  ] : [];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="充值管理" title="提交充值与查看审核" description="选择后端返回的充值渠道，提交链上交易信息并跟踪财务审核状态。" />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none xl:col-span-1">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">创建充值订单</h2>
          <div className="mt-4 space-y-3">
            <Select value={channelId} onValueChange={setChannelId}>
              <SelectTrigger className="h-9 w-full bg-background text-foreground">
                <SelectValue placeholder="选择充值渠道" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel.channelId} value={String(channel.channelId)}>
                    {channel.channelName} / {channel.network}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedChannel ? (
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-slate-500 dark:border-white/10 dark:bg-black/20 dark:text-zinc-400">
                <div className="mb-2 text-slate-400 dark:text-zinc-500">收款地址</div>
                <CopyableSecret value={selectedChannel.accountNo} canReveal={false} className="max-w-full" />
              </div>
            ) : null}
            <Input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="充值金额 USDT" className="h-9 bg-background text-foreground" />
            <Input value={externalTxNo} onChange={(event) => setExternalTxNo(event.target.value)} placeholder="交易哈希 / TXID" className="h-9 bg-background text-foreground" />
            <Input value={paymentProofUrl} onChange={(event) => setPaymentProofUrl(event.target.value)} placeholder="支付凭证 URL（如有）" className="h-9 bg-background text-foreground" />
            <Button onClick={() => void submitRecharge()} disabled={submitting} className="w-full bg-[#5e6ad2] text-white hover:bg-[#7170ff]">
              <Copy className="h-4 w-4" />
              提交充值申请
            </Button>
          </div>
        </div>

        <div className="xl:col-span-2">
          <SearchPanel
            onSearch={() => updateParams({ ...filters, pageNo: 1 })}
            onReset={() => {
              setFilters(initialParams);
              updateParams(initialParams);
            }}
          >
            <div className="space-y-2">
              <Label>充值状态</Label>
              <Select value={filters.status ?? "ALL"} onValueChange={(value) => setFilters((current) => ({ ...current, status: value === "ALL" ? undefined : value }))}>
                <SelectTrigger className="h-9 min-w-[140px] bg-background text-foreground">
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部状态</SelectItem>
                  <SelectItem value="SUBMITTED">已提交</SelectItem>
                  <SelectItem value="APPROVED">已审核</SelectItem>
                  <SelectItem value="REJECTED">已拒绝</SelectItem>
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
        </div>
      </div>

      {message ? <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{message}</div> : null}
      {error || actionError ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error ?? actionError}</div> : null}
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.rechargeNo} loading={loading} emptyText="暂无充值订单。" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer open={Boolean(detail)} title="充值订单详情" subtitle={detail?.rechargeNo} sections={detailSections} onClose={() => setDetail(null)} />
    </div>
  );
}
