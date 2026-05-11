"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, Loader2, Send, XCircle } from "lucide-react";
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
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cancelWithdrawOrder, createWithdrawOrder, getWithdrawOrderDetail, getWithdrawOrders } from "@/api/withdraw";
import { getWalletInfo } from "@/api/wallet";
import type { PageResult, WalletMeResponse, WithdrawOrderQueryRequest, WithdrawOrderResponse } from "@/api/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { createClientRequestId } from "@/lib/client-request-id";

const initialParams: WithdrawOrderQueryRequest = { pageNo: 1, pageSize: 10 };
const networks = ["TRC20", "ERC20", "BEP20"];

export default function WithdrawPage() {
  const t = useTranslations("DashboardWithdraw");
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
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [detail, setDetail] = useState<WithdrawOrderResponse | null>(null);
  const requestIdRef = useRef<{ key: string; id: string } | null>(null);

  const submitWithdraw = async () => {
    if (submitting) return;
    setSubmitting(true);
    setMessage(null);
    setActionError(null);
    try {
      const applyAmount = Number(amount);
      if (!Number.isFinite(applyAmount) || applyAmount <= 0) throw new Error(t("errors.invalidAmount"));
      if (wallet.data && applyAmount > wallet.data.availableBalance) throw new Error(t("errors.insufficient"));
      if (!accountNo.trim()) throw new Error(t("errors.accountRequired"));
      const requestKey = JSON.stringify([
        network,
        accountName.trim(),
        accountNo.trim(),
        applyAmount,
      ]);
      const clientRequestId =
        requestIdRef.current?.key === requestKey
          ? requestIdRef.current.id
          : createClientRequestId("withdraw");
      requestIdRef.current = { key: requestKey, id: clientRequestId };
      await createWithdrawOrder({
        network,
        accountName: accountName.trim() || undefined,
        accountNo: accountNo.trim(),
        applyAmount,
        clientRequestId,
      });
      requestIdRef.current = null;
      setAmount("");
      setAccountNo("");
      setAccountName("");
      setMessage(t("messages.submitted"));
      await Promise.all([reload(), wallet.reload()]);
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setSubmitting(false);
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
    { key: "withdrawNo", title: t("columns.withdrawNo"), render: (row) => <span className="font-mono text-xs">{row.withdrawNo}</span> },
    { key: "applyAmount", title: t("columns.amount"), render: (row) => <MoneyText value={row.applyAmount} /> },
    { key: "feeAmount", title: t("columns.feeActual"), render: (row) => <span><MoneyText value={row.feeAmount} /> / <MoneyText value={row.actualAmount} /></span> },
    { key: "network", title: t("columns.account"), render: (row) => <span>{row.network} · <CopyableSecret value={row.accountNo} canReveal={false} /></span> },
    { key: "status", title: t("columns.status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "paidAt", title: t("columns.paidAt"), render: (row) => <DateTimeText value={row.paidAt} /> },
    {
      key: "actions",
      title: t("columns.actions"),
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted" onClick={() => void openDetail(row.withdrawNo)}>
            <Eye className="h-3.5 w-3.5" />{t("actions.detail")}</Button>
          {row.status === "PENDING_REVIEW" ? (
            <ConfirmActionButton title={t("actions.cancelTitle")} description={t("actions.cancelDescription")} confirmText={t("actions.cancelConfirm")} onConfirm={() => cancelOrder(row.withdrawNo)}>
              <XCircle className="h-3.5 w-3.5" />{t("actions.cancel")}</ConfirmActionButton>
          ) : null}
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<WithdrawOrderResponse>[] = [
    {
      title: t("detail.withdrawInfo"),
      fields: [
        { label: t("detail.orderNo"), render: (detail) => <span className="font-mono">{detail.withdrawNo}</span> },
        { label: t("detail.status"), render: (detail) => <StatusBadge status={detail.status} /> },
        { label: t("detail.applyAmount"), render: (detail) => <MoneyText value={detail.applyAmount} /> },
        { label: t("detail.fee"), render: (detail) => <MoneyText value={detail.feeAmount} /> },
        { label: t("detail.actualAmount"), render: (detail) => <MoneyText value={detail.actualAmount} /> },
        { label: t("detail.network"), render: (detail) => detail.network },
        { label: t("detail.accountName"), render: (detail) => detail.accountName || "-" },
        { label: t("detail.accountNo"), render: (detail) => <CopyableSecret value={detail.accountNo} canReveal={false} /> },
      ],
    },
    {
      title: t("detail.reviewPay"),
      fields: [
        { label: t("detail.reviewRemark"), render: (detail) => detail.reviewRemark || "-" },
        { label: t("detail.reviewedAt"), render: (detail) => <DateTimeText value={detail.reviewedAt} /> },
        { label: t("detail.payProof"), render: (detail) => detail.payProofNo || "-" },
        { label: t("detail.paidAt"), render: (detail) => <DateTimeText value={detail.paidAt} /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatsCard title={t("stats.available")} value={<MoneyText value={wallet.data?.availableBalance} />} description={wallet.data?.currency ?? "USDT"} icon={Send} loading={wallet.loading} />
        <StatsCard title={t("stats.frozen")} value={<MoneyText value={wallet.data?.frozenBalance} />} description={t("stats.frozenDesc")} icon={Send} loading={wallet.loading} />
        <StatsCard title={t("stats.total")} value={<MoneyText value={wallet.data?.totalWithdraw} />} description={t("stats.totalDesc")} icon={Send} loading={wallet.loading} />
      </div>

      <div className="rounded-lg border border-border bg-card p-5 text-card-foreground">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <Select value={network} onValueChange={setNetwork}>
            <SelectTrigger className="h-9 w-full bg-background text-foreground">
              <SelectValue placeholder={t("form.network")} />
            </SelectTrigger>
            <SelectContent>
              {networks.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder={t("form.accountName")} className="h-9 bg-background text-foreground" />
          <Input value={accountNo} onChange={(event) => setAccountNo(event.target.value)} placeholder={t("form.accountNo")} className="h-9 bg-background text-foreground lg:col-span-2" />
          <Input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder={t("form.amount")} className="h-9 bg-background text-foreground" />
        </div>
        <Button onClick={() => void submitWithdraw()} disabled={submitting} className="mt-4">
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {t("form.submit")}
        </Button>
      </div>

      <SearchPanel
        onSearch={() => updateParams({ ...filters, pageNo: 1 })}
        onReset={() => {
          setFilters(initialParams);
          updateParams(initialParams);
        }}
      >
        <div className="space-y-2">
          <Label>{t("filters.status")}</Label>
          <Select value={filters.status ?? "ALL"} onValueChange={(value) => setFilters((current) => ({ ...current, status: value === "ALL" ? undefined : value }))}>
            <SelectTrigger className="h-9 min-w-[140px] bg-background text-foreground">
              <SelectValue placeholder={t("filters.allStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("filters.allStatus")}</SelectItem>
              <SelectItem value="PENDING_REVIEW">{t("filters.pending")}</SelectItem>
              <SelectItem value="APPROVED">{t("filters.approved")}</SelectItem>
              <SelectItem value="REJECTED">{t("filters.rejected")}</SelectItem>
              <SelectItem value="PAID">{t("filters.paid")}</SelectItem>
              <SelectItem value="CANCELLED">{t("filters.cancelled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("filters.startDate")}</Label>
          <Input
            type="date"
            value={filters.startTime ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value || undefined }))}
            className="h-9 w-[160px] bg-background text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label>{t("filters.endDate")}</Label>
          <Input
            type="date"
            value={filters.endTime ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value || undefined }))}
            className="h-9 w-[160px] bg-background text-foreground"
          />
        </div>
      </SearchPanel>

      {message ? <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{message}</div> : null}
      <ErrorAlert message={error ?? actionError} />
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.withdrawNo} loading={loading} emptyText={t("empty")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={Boolean(detail)} title={t("drawerTitle")} subtitle={(data) => data.withdrawNo} sections={detailSections} onClose={() => setDetail(null)} />
    </div>
  );
}
