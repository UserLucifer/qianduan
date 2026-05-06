"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, Copy, Eye, Loader2, ShieldCheck, Wallet, XCircle } from "lucide-react";
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
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { normalizeLocale } from "@/i18n/locales";

/* ───────── constants ───────── */
const QUICK_AMOUNTS = [50, 100, 500, 1000];
const initialParams: RechargeOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function RechargePage() {
  const locale = normalizeLocale(useLocale());
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
  const [successState, setSuccessState] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [detail, setDetail] = useState<RechargeOrderResponse | null>(null);

  /* ── load channels ── */
  useEffect(() => {
    setChannelsLoading(true);
    getRechargeChannels({ language: locale })
      .then((res) => {
        setChannels(res.data);
        if (res.data.length > 0) {
          setSelectedChannelId((c) => c ?? res.data[0].channelId);
        }
      })
      .catch((err) => setActionError(toErrorMessage(err)))
      .finally(() => setChannelsLoading(false));
  }, [locale]);

  const selectedChannel = channels.find((ch) => ch.channelId === selectedChannelId) ?? null;

  /* ── derived: fee calculation ── */
  const parsedAmount = Number(amount);
  const validAmount = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 0;
  const feeRate = selectedChannel?.feeRate ?? 0;
  const feeAmount = useMemo(() => Math.round(validAmount * feeRate * 100) / 100, [validAmount, feeRate]);
  const totalPay = useMemo(() => Math.round((validAmount + feeAmount) * 100) / 100, [validAmount, feeAmount]);

  /* ── handlers ── */
  const resetForm = () => {
    setAmount("");
    setExternalTxNo("");
    setPaymentProofUrl("");
    setSuccessState(false);
    setActionError(null);
  };

  const submitRecharge = async () => {
    setSubmitting(true);
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
      setSuccessState(true);
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
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted" onClick={() => void openDetail(row.rechargeNo)}>
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

  /* ── detail drawer sections (100% DTO mapping) ── */
  const detailSections: DetailSectionDef<RechargeOrderResponse>[] = [
    {
      title: "交易金额",
      fields: [
        { label: "充值金额", render: (d) => <MoneyText value={d.applyAmount} /> },
        { label: "币种", render: (d) => d.currency || "USDT" },
        {
          label: "实际到账",
          render: (d) => {
            const hasAmount = Number.isFinite(d.actualAmount) && d.actualAmount > 0;
            return (
              <span className={cn(
                "text-lg font-bold tabular-nums",
                hasAmount ? "text-emerald-600 dark:text-emerald-500" : "text-muted-foreground font-medium text-sm"
              )}>
                {hasAmount ? `${d.actualAmount.toFixed(2)} ${d.currency || "USDT"}` : "待审核确认"}
              </span>
            );
          },
        },
      ],
    },
    {
      title: "订单信息",
      fields: [
        { label: "订单号", render: (d) => <CopyableSecret value={d.rechargeNo} canReveal={false} /> },
        { label: "充值渠道", render: (d) => <span>{d.channelName} · {d.network}</span> },
        { label: "收款地址", render: (d) => <CopyableSecret value={d.accountNo} canReveal={false} /> },
        { label: "当前状态", render: (d) => <StatusBadge status={d.status} /> },
        { label: "用户备注", render: (d) => d.userRemark || "-" },
      ],
    },
    {
      title: "时间追踪",
      fields: [
        { label: "提交时间", render: (d) => <DateTimeText value={d.createdAt} /> },
        { label: "审核时间", render: (d) => <DateTimeText value={d.reviewedAt} /> },
        { label: "入账时间", render: (d) => <DateTimeText value={d.creditedAt} /> },
      ],
    },
    {
      title: "凭证与备注",
      fields: [
        { label: "交易哈希", render: (d) => <CopyableSecret value={d.externalTxNo} canReveal={false} /> },
        {
          label: "支付凭证",
          render: (d) => {
            if (!d.paymentProofUrl) return <span className="text-muted-foreground">-</span>;
            const isImage = /\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(d.paymentProofUrl);
            if (isImage) {
              return (
                <a href={d.paymentProofUrl} target="_blank" rel="noopener noreferrer" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.paymentProofUrl} alt="支付凭证" className="h-24 w-auto rounded-lg border border-gray-200 object-cover dark:border-white/10" />
                </a>
              );
            }
            return <CopyableSecret value={d.paymentProofUrl} canReveal={false} />;
          },
        },
        {
          label: "审核备注",
          render: (d) => {
            if (!d.reviewRemark) return <span className="text-muted-foreground">-</span>;
            if (d.status === "REJECTED") {
              return <span className="font-medium text-rose-500">{d.reviewRemark}</span>;
            }
            return <span>{d.reviewRemark}</span>;
          },
        },
        { label: "钱包流水号", render: (d) => d.walletTxNo ? <CopyableSecret value={d.walletTxNo} canReveal={false} /> : <span className="text-muted-foreground">-</span> },
      ],
    },
  ];

  /* ────────────────────── JSX ────────────────────── */
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="充值管理" title="账户充值" description="选择充值渠道与金额，提交链上交易信息并跟踪财务审核状态。" />

      {/* ═══════ 成功状态视图 / 收银台 ═══════ */}
      {successState ? (
        <div className="flex flex-col items-center rounded-xl border border-border bg-card px-6 py-16 text-card-foreground shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-9 w-9 text-emerald-500" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-foreground">充值申请已成功提交！</h2>
          <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
            您的充值订单已经进入系统，财务人员将会在 10&nbsp;–&nbsp;30 分钟内完成审核与入账。请耐心等待。
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Button asChild>
              <Link href="/dashboard/recharge/history">查看充值记录</Link>
            </Button>
            <Button variant="outline" onClick={resetForm}>
              继续充值
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* ── 左侧: 金额 + 渠道 ── */}
          <div className="space-y-5 xl:col-span-2">
            {/* 区域 A: 充值金额输入 */}
            <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Wallet className="h-4 w-4 text-primary" />
                充值金额
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">选择快捷金额或输入自定义金额</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {QUICK_AMOUNTS.map((val) => (
                  <Button
                    key={val}
                    type="button"
                    variant={amount === String(val) ? "default" : "outline"}
                    onClick={() => setAmount(String(val))}
                    className={cn(
                      "relative h-auto rounded-lg px-4 py-3 text-center text-sm font-medium transition-all duration-150",
                      amount === String(val)
                        ? "ring-1 ring-primary/30"
                        : "bg-background hover:bg-muted/50",
                    )}
                  >
                    <span className="text-base font-semibold tabular-nums">{val}</span>
                    <span className={cn("ml-1 text-xs", amount === String(val) ? "text-primary-foreground/80" : "text-muted-foreground")}>USDT</span>
                  </Button>
                ))}
              </div>
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
            <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Copy className="h-4 w-4 text-primary" />
                选择充值渠道
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">点击选择支付渠道，不同渠道手续费可能不同</p>
              {channelsLoading ? (
                <div className="mt-4 flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">加载渠道中…</span>
                </div>
              ) : channels.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                  暂无可用充值渠道
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {channels.map((ch) => {
                    const isSelected = ch.channelId === selectedChannelId;
                    return (
                      <Button
                        key={ch.channelId}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => setSelectedChannelId(ch.channelId)}
                        className={cn(
                          "relative h-auto justify-start rounded-xl p-4 text-left transition-all duration-150",
                          isSelected
                            ? "ring-2 ring-primary/30"
                            : "bg-background hover:bg-muted/50",
                        )}
                      >
                        {isSelected && <CheckCircle2 className="absolute right-3 top-3 h-5 w-5" />}
                        <div className="w-full pr-7">
                          <div className="text-sm font-semibold">{ch.channelName}</div>
                          <div className="mt-1 flex items-center gap-2 text-xs opacity-80">
                            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{ch.channelCode}</span>
                            <span>·</span>
                            <span>{ch.network}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-3 text-xs opacity-80">
                            <span>手续费 {(ch.feeRate * 100).toFixed(2)}%</span>
                            <span>限额 {ch.minAmount}–{ch.maxAmount > 0 ? ch.maxAmount : "∞"} USDT</span>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}
              {selectedChannel && (
                <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3">
                  <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">收款地址</div>
                  <CopyableSecret value={selectedChannel.accountNo} canReveal={false} className="max-w-full" />
                </div>
              )}
            </div>
          </div>

          {/* ── 右侧: 结算摘要 + 提交 ── */}
          <div className="xl:col-span-1">
            <div className="sticky top-6 space-y-5">
              <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
                <h2 className="text-sm font-semibold text-foreground">订单摘要</h2>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">充值金额</span>
                    <span className="font-semibold tabular-nums text-foreground">{validAmount > 0 ? `${validAmount.toFixed(2)} USDT` : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">手续费{feeRate > 0 ? ` (${(feeRate * 100).toFixed(2)}%)` : ""}</span>
                    <span className="tabular-nums text-foreground">{validAmount > 0 ? `${feeAmount.toFixed(2)} USDT` : "—"}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">实际支付</span>
                      <span className="text-lg font-bold tabular-nums text-primary">{validAmount > 0 ? `${totalPay.toFixed(2)} USDT` : "—"}</span>
                    </div>
                  </div>
                </div>
                {selectedChannel && (
                  <div className="mt-4 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                    渠道：{selectedChannel.channelName} · {selectedChannel.network}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
                <h2 className="text-sm font-semibold text-foreground">支付凭证</h2>
                <p className="mt-1 text-xs text-muted-foreground">提交链上交易哈希或付款截图以加速审核</p>
                <div className="mt-3 space-y-3">
                  <Input value={externalTxNo} onChange={(e) => setExternalTxNo(e.target.value)} placeholder="交易哈希 / TXID" className="h-9 bg-background text-foreground" />
                  <Input value={paymentProofUrl} onChange={(e) => setPaymentProofUrl(e.target.value)} placeholder="支付凭证 URL（如有）" className="h-9 bg-background text-foreground" />
                </div>
              </div>

              <Button
                onClick={() => void submitRecharge()}
                disabled={submitting || !selectedChannel || validAmount <= 0}
                className="h-12 w-full text-base font-semibold shadow-md disabled:opacity-50"
              >
                {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />提交中…</>) : "确认充值"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ 错误反馈 ═══════ */}
      <ErrorAlert message={error ?? actionError} />

      {/* ═══════ 充值记录 ═══════ */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">充值记录</h2>
        <SearchPanel
          onSearch={() => updateParams({ ...filters, pageNo: 1 })}
          onReset={() => { setFilters(initialParams); updateParams(initialParams); }}
        >
          <div className="space-y-2">
            <Label>充值状态</Label>
            <Select value={filters.status ?? "ALL"} onValueChange={(value) => setFilters((current) => ({ ...current, status: value === "ALL" ? undefined : value }))}>
              <SelectTrigger className="h-9 min-w-[140px] bg-background text-foreground"><SelectValue placeholder="全部状态" /></SelectTrigger>
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
            <Input type="date" value={filters.startTime ?? ""} onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value || undefined }))} className="h-9 w-[160px] bg-background text-foreground" />
          </div>
          <div className="space-y-2">
            <Label>结束日期</Label>
            <Input type="date" value={filters.endTime ?? ""} onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value || undefined }))} className="h-9 w-[160px] bg-background text-foreground" />
          </div>
        </SearchPanel>
        <DataTable columns={columns} data={page.records} rowKey={(row) => row.rechargeNo} loading={loading} emptyText="暂无充值订单。" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      </div>

      {/* ═══════ 详情抽屉 ═══════ */}
      <DetailDrawer data={detail} open={Boolean(detail)} title="充值订单详情" subtitle={(data) => data.rechargeNo} sections={detailSections} onClose={() => setDetail(null)}>
        {() => (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>平台采用冷热钱包隔离技术，保障您的资金安全。</span>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
