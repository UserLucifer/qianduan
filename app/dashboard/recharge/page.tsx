"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Copy, Eye, Loader2, Wallet, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cancelRechargeOrder, createRechargeOrder, getRechargeChannels, getRechargeOrderDetail, getRechargeOrders } from "@/api/recharge";
import type { PageResult, RechargeChannelResponse, RechargeOrderQueryRequest, RechargeOrderResponse } from "@/api/types";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { toErrorMessage } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ───────── constants ───────── */
const QUICK_AMOUNTS = [50, 100, 500, 1000];
const initialParams: RechargeOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function RechargePage() {
  /* ── order list ── */
  const loader = useCallback(async (params: RechargeOrderQueryRequest): Promise<PageResult<RechargeOrderResponse>> => {
    const res = await getRechargeOrders(params);
    return res.data;
  }, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialParams);

  /* ── channels ── */
  const [channels, setChannels] = useState<RechargeChannelResponse[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(true);

  /* ── form state ── */
  const [filters, setFilters] = useState<RechargeOrderQueryRequest>(initialParams);
  const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [externalTxNo, setExternalTxNo] = useState("");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [detail, setDetail] = useState<RechargeOrderResponse | null>(null);

  /* ── load channels ── */
  useEffect(() => {
    setChannelsLoading(true);
    getRechargeChannels()
      .then((res) => {
        setChannels(res.data);
        if (res.data.length > 0) {
          setSelectedChannelId((c) => c ?? res.data[0].channelId);
        }
      })
      .catch((err) => setActionError(toErrorMessage(err)))
      .finally(() => setChannelsLoading(false));
  }, []);

  const selectedChannel = channels.find((ch) => ch.channelId === selectedChannelId) ?? null;

  /* ── derived: fee calculation ── */
  const parsedAmount = Number(amount);
  const validAmount = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 0;
  const feeRate = selectedChannel?.feeRate ?? 0;
  const feeAmount = useMemo(() => {
    return Math.round(validAmount * feeRate * 100) / 100;
  }, [validAmount, feeRate]);
  const totalPay = useMemo(() => {
    return Math.round((validAmount + feeAmount) * 100) / 100;
  }, [validAmount, feeAmount]);

  /* ── handlers ── */
  const handleQuickAmount = (val: number) => {
    setAmount(String(val));
  };

  const submitRecharge = async () => {
    setSubmitting(true);
    setMessage(null);
    setActionError(null);
    try {
      if (!selectedChannel) throw new Error("请选择充值渠道。");
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) throw new Error("请输入有效充值金额。");
      if (parsedAmount < selectedChannel.minAmount) throw new Error(`当前渠道最低充值 ${selectedChannel.minAmount} USDT。`);
      if (selectedChannel.maxAmount > 0 && parsedAmount > selectedChannel.maxAmount) throw new Error(`当前渠道最高充值 ${selectedChannel.maxAmount} USDT。`);
      await createRechargeOrder({
        channelId: selectedChannel.channelId,
        applyAmount: parsedAmount,
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

  /* ── table columns ── */
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

  const detailSections: DetailSectionDef<RechargeOrderResponse>[] = [
    {
      title: "充值信息",
      fields: [
        { label: "订单号", render: (d) => <span className="font-mono">{d.rechargeNo}</span> },
        { label: "金额", render: (d) => <MoneyText value={d.applyAmount} /> },
        { label: "实际到账", render: (d) => <MoneyText value={d.actualAmount} /> },
        { label: "状态", render: (d) => <StatusBadge status={d.status} /> },
        { label: "交易哈希", render: (d) => <CopyableSecret value={d.externalTxNo} canReveal={false} /> },
        { label: "凭证 URL", render: (d) => <CopyableSecret value={d.paymentProofUrl} canReveal={false} /> },
      ],
    },
    {
      title: "审核信息",
      fields: [
        { label: "审核备注", render: (d) => d.reviewRemark || "-" },
        { label: "审核时间", render: (d) => <DateTimeText value={d.reviewedAt} /> },
        { label: "入账时间", render: (d) => <DateTimeText value={d.creditedAt} /> },
        { label: "钱包流水", render: (d) => d.walletTxNo || "-" },
      ],
    },
  ];

  /* ────────────────────── JSX ────────────────────── */
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="充值管理" title="账户充值" description="选择充值渠道与金额，提交链上交易信息并跟踪财务审核状态。" />

      {/* ═══════ 现代化收银台 ═══════ */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ── 左侧: 金额 + 渠道 ── */}
        <div className="space-y-5 xl:col-span-2">

          {/* 区域 A: 充值金额输入 */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Wallet className="h-4 w-4 text-[#5e6ad2]" />
              充值金额
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">选择快捷金额或输入自定义金额</p>

            {/* 快捷金额 Chips */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className={cn(
                    "relative rounded-lg border px-4 py-3 text-center text-sm font-medium transition-all duration-150",
                    "hover:border-[#5e6ad2]/50 hover:bg-[#5e6ad2]/5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]/50",
                    amount === String(val)
                      ? "border-[#5e6ad2] bg-[#5e6ad2]/10 text-[#5e6ad2] ring-1 ring-[#5e6ad2]/30 dark:bg-[#5e6ad2]/15"
                      : "border-gray-200 bg-gray-50 text-foreground dark:border-white/10 dark:bg-white/[0.04]",
                  )}
                >
                  <span className="text-base font-semibold tabular-nums">{val}</span>
                  <span className="ml-1 text-xs text-muted-foreground">USDT</span>
                </button>
              ))}
            </div>

            {/* 自定义输入 */}
            <div className="relative mt-4">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">$</span>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="输入自定义金额"
                className="h-11 bg-background pl-7 text-base text-foreground tabular-nums"
              />
            </div>
          </div>

          {/* 区域 B: 渠道选择 */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Copy className="h-4 w-4 text-[#5e6ad2]" />
              选择充值渠道
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">点击选择支付渠道，不同渠道手续费可能不同</p>

            {channelsLoading ? (
              <div className="mt-4 flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">加载渠道中…</span>
              </div>
            ) : channels.length === 0 ? (
              <div className="mt-4 rounded-lg border border-dashed border-gray-200 py-8 text-center text-sm text-muted-foreground dark:border-white/10">
                暂无可用充值渠道
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {channels.map((ch) => {
                  const isSelected = ch.channelId === selectedChannelId;
                  return (
                    <button
                      key={ch.channelId}
                      type="button"
                      onClick={() => setSelectedChannelId(ch.channelId)}
                      className={cn(
                        "relative rounded-xl border p-4 text-left transition-all duration-150",
                        "hover:border-[#5e6ad2]/50 hover:shadow-sm",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]/50",
                        isSelected
                          ? "border-[#5e6ad2] bg-[#5e6ad2]/5 ring-2 ring-[#5e6ad2]/30 dark:bg-[#5e6ad2]/10"
                          : "border-gray-200 bg-gray-50/50 dark:border-white/10 dark:bg-white/[0.02]",
                      )}
                    >
                      {/* 对勾 */}
                      {isSelected && (
                        <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-[#5e6ad2]" />
                      )}

                      <div className="text-sm font-semibold text-foreground">{ch.channelName}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] dark:bg-white/10">{ch.channelCode}</span>
                        <span>·</span>
                        <span>{ch.network}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          手续费 {(ch.feeRate * 100).toFixed(2)}%
                        </span>
                        <span className="text-muted-foreground">
                          限额 {ch.minAmount}–{ch.maxAmount > 0 ? ch.maxAmount : "∞"} USDT
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 选中渠道的收款地址 */}
            {selectedChannel && (
              <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-white/10 dark:bg-black/20">
                <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">收款地址</div>
                <CopyableSecret value={selectedChannel.accountNo} canReveal={false} className="max-w-full" />
              </div>
            )}
          </div>
        </div>

        {/* ── 右侧: 结算摘要 + 提交 ── */}
        <div className="xl:col-span-1">
          <div className="sticky top-6 space-y-5">
            {/* 区域 C: 订单结算摘要 */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
              <h2 className="text-sm font-semibold text-foreground">订单摘要</h2>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">充值金额</span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {validAmount > 0 ? `${validAmount.toFixed(2)} USDT` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    手续费{feeRate > 0 ? ` (${(feeRate * 100).toFixed(2)}%)` : ""}
                  </span>
                  <span className="tabular-nums text-foreground">
                    {validAmount > 0 ? `${feeAmount.toFixed(2)} USDT` : "—"}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">实际支付</span>
                    <span className="text-lg font-bold tabular-nums text-[#5e6ad2]">
                      {validAmount > 0 ? `${totalPay.toFixed(2)} USDT` : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 渠道信息 */}
              {selectedChannel && (
                <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-muted-foreground dark:bg-white/[0.04]">
                  渠道：{selectedChannel.channelName} · {selectedChannel.network}
                </div>
              )}
            </div>

            {/* 附加信息 */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
              <h2 className="text-sm font-semibold text-foreground">支付凭证</h2>
              <p className="mt-1 text-xs text-muted-foreground">提交链上交易哈希或付款截图以加速审核</p>
              <div className="mt-3 space-y-3">
                <Input
                  value={externalTxNo}
                  onChange={(e) => setExternalTxNo(e.target.value)}
                  placeholder="交易哈希 / TXID"
                  className="h-9 bg-background text-foreground"
                />
                <Input
                  value={paymentProofUrl}
                  onChange={(e) => setPaymentProofUrl(e.target.value)}
                  placeholder="支付凭证 URL（如有）"
                  className="h-9 bg-background text-foreground"
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <Button
              onClick={() => void submitRecharge()}
              disabled={submitting || !selectedChannel || validAmount <= 0}
              className="h-12 w-full bg-[#5e6ad2] text-base font-semibold text-white shadow-md hover:bg-[#7170ff] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  提交中…
                </>
              ) : (
                "确认充值"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════ 消息反馈 ═══════ */}
      {message ? (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-200">
          {message}
        </div>
      ) : null}
      {error || actionError ? (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-200">
          {error ?? actionError}
        </div>
      ) : null}

      {/* ═══════ 充值记录 ═══════ */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">充值记录</h2>
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
        <DataTable columns={columns} data={page.records} rowKey={(row) => row.rechargeNo} loading={loading} emptyText="暂无充值订单。" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      </div>

      <DetailDrawer data={detail} open={Boolean(detail)} title="充值订单详情" subtitle={(data) => data.rechargeNo} sections={detailSections} onClose={() => setDetail(null)} />
    </div>
  );
}
