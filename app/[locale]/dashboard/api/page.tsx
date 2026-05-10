"use client";

import { Suspense, useCallback, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle2, Eye, History, Loader2, PackageOpen, PlayCircle, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getRentalApiManagement, getRentalDeployInfo, getRentalOrderDetail, payDeployFee, settleEarly, startOrder } from "@/api/rental";
import type { ApiDeployInfoResponse, PageResult, RentalOrderDetailResponse, RentalOrderQueryRequest, SettlementOrderResponse } from "@/api/types";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { formatEmpty, formatPercent } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { ApiDeployOrderStatus, ApiTokenStatus, RentalOrderStatus } from "@/types/enums";

const initialParams: RentalOrderQueryRequest = { pageNo: 1, pageSize: 10 };
type ApiStage = "PAY_DEPLOY" | "DEPLOYING" | "READY_TO_START" | "RUNNING" | "ENDED" | "CANCELED" | "BLOCKED";

function getApiStage(row: ApiDeployInfoResponse): ApiStage {
  if (row.orderStatus === RentalOrderStatus.CANCELED || row.tokenStatus === ApiTokenStatus.REVOKED) return "CANCELED";
  if (
    row.orderStatus === RentalOrderStatus.EXPIRED ||
    row.orderStatus === RentalOrderStatus.EARLY_CLOSED ||
    row.orderStatus === RentalOrderStatus.SETTLED ||
    row.tokenStatus === ApiTokenStatus.EXPIRED
  ) {
    return "ENDED";
  }
  if (
    row.orderStatus === RentalOrderStatus.PENDING_ACTIVATION &&
    row.tokenStatus === ApiTokenStatus.GENERATED &&
    row.deployOrderStatus !== ApiDeployOrderStatus.PAID
  ) {
    return "PAY_DEPLOY";
  }
  if (row.orderStatus === RentalOrderStatus.ACTIVATING || row.tokenStatus === ApiTokenStatus.ACTIVATING) return "DEPLOYING";
  if (row.orderStatus === RentalOrderStatus.PAUSED && row.tokenStatus === ApiTokenStatus.PAUSED) return "READY_TO_START";
  if (row.orderStatus === RentalOrderStatus.RUNNING && row.tokenStatus === ApiTokenStatus.ACTIVE) return "RUNNING";
  return "BLOCKED";
}

function canPayDeploy(row: ApiDeployInfoResponse) {
  return getApiStage(row) === "PAY_DEPLOY";
}

function canStart(row: ApiDeployInfoResponse) {
  return getApiStage(row) === "READY_TO_START";
}

export default function DashboardApiPage() {
  return (
    <Suspense fallback={null}>
      <DashboardApiContent />
    </Suspense>
  );
}

function DashboardApiContent() {
  const t = useTranslations("DashboardApi");
  const searchParams = useSearchParams();
  const focusedOrderNo = searchParams.get("orderNo")?.trim() ?? "";
  const scopedInitialParams: RentalOrderQueryRequest = focusedOrderNo ? { ...initialParams, orderNo: focusedOrderNo } : initialParams;
  const loader = useCallback(async (params: RentalOrderQueryRequest): Promise<PageResult<ApiDeployInfoResponse>> => {
    const res = await getRentalApiManagement(params);
    return res.data;
  }, []);
  const { page, loading, error, changePage, reload } = usePaginatedResource(loader, scopedInitialParams);
  const [detail, setDetail] = useState<ApiDeployInfoResponse | null>(null);
  const [settlementTarget, setSettlementTarget] = useState<ApiDeployInfoResponse | null>(null);
  const [settlementPreview, setSettlementPreview] = useState<RentalOrderDetailResponse | null>(null);
  const [settlementResult, setSettlementResult] = useState<SettlementOrderResponse | null>(null);
  const [settlementLoading, setSettlementLoading] = useState(false);
  const [settlementSubmitting, setSettlementSubmitting] = useState(false);

  const openDeployInfo = async (orderNo: string) => {
    try {
      const res = await getRentalDeployInfo(orderNo);
      setDetail(res.data);
    } catch {
      // API errors are surfaced by the request interceptor.
    }
  };

  const payDeploy = async (orderNo: string) => {
    try {
      await payDeployFee(orderNo);
      await reload();
      if (detail?.orderNo === orderNo) {
        const next = await getRentalDeployInfo(orderNo);
        setDetail(next.data);
      }
    } catch {
      // API errors are surfaced by the request interceptor.
    }
  };

  const startAsset = async (orderNo: string) => {
    try {
      await startOrder(orderNo);
      await reload();
      if (detail?.orderNo === orderNo) {
        const next = await getRentalDeployInfo(orderNo);
        setDetail(next.data);
      }
    } catch {
      // API errors are surfaced by the request interceptor.
    }
  };

  const openEarlySettlement = async (row: ApiDeployInfoResponse) => {
    setSettlementTarget(row);
    setSettlementPreview(null);
    setSettlementResult(null);
    setSettlementLoading(true);
    try {
      const res = await getRentalOrderDetail(row.orderNo);
      setSettlementPreview(res.data);
    } catch {
      setSettlementTarget(null);
    } finally {
      setSettlementLoading(false);
    }
  };

  const closeEarlySettlement = () => {
    if (settlementLoading || settlementSubmitting) return;
    setSettlementTarget(null);
    setSettlementPreview(null);
    setSettlementResult(null);
  };

  const confirmEarlySettlement = async () => {
    if (!settlementPreview) return;
    setSettlementSubmitting(true);
    try {
      const res = await settleEarly(settlementPreview.orderNo);
      setSettlementResult(res.data);
      await reload();
      if (detail?.orderNo === settlementPreview.orderNo) {
        const next = await getRentalDeployInfo(settlementPreview.orderNo);
        setDetail(next.data);
      }
    } catch {
      // API errors are surfaced by the request interceptor.
    } finally {
      setSettlementSubmitting(false);
    }
  };

  const columns: DataTableColumn<ApiDeployInfoResponse>[] = [
    { key: "orderNo", title: t("columns.order"), render: (row) => <span className="font-mono text-xs">{row.orderNo}</span> },

    {
      key: "apiName",
      title: t("columns.credential"),
      render: (row) => (
        <div className="space-y-1">
          <div className="font-medium text-foreground">{formatEmpty(row.apiName)}</div>

          <CopyableSecret value={row.tokenMasked} maskedValue={row.tokenMasked} canReveal={false} className="max-w-[180px]" />
        </div>
      ),
    },
    { key: "modelNameSnapshot", title: t("columns.model"), render: (row) => formatEmpty(row.modelNameSnapshot) },
    {
      key: "stage",
      title: t("columns.stage"),
      render: (row) => <ApiStageCell row={row} />,
    },
    {
      key: "deployFeeSnapshot",
      title: t("columns.deployCost"),
      render: (row) => (
        <div className="space-y-1">
          <MoneyText value={row.deployFeeSnapshot} className="block text-xs" />
          {row.deployOrderStatus ? <StatusBadge status={row.deployOrderStatus} /> : <span className="text-xs text-muted-foreground">{t("status.notPaid")}</span>}
        </div>
      ),
    },
    { key: "tokenStatus", title: t("columns.tokenStatus"), render: (row) => <StatusBadge status={row.tokenStatus} /> },
    { key: "paidAt", title: t("columns.paidAt"), render: (row) => <DateTimeText value={row.paidAt} /> },
    {
      key: "actions",
      title: t("columns.actions"),
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted" onClick={() => void openDeployInfo(row.orderNo)}>
            <Eye className="h-3.5 w-3.5" />
            {t("actions.view")}</Button>
          {canPayDeploy(row) ? (
            <ConfirmActionButton title={t("actions.payTitle")} description={t("actions.payDescription")} confirmText={t("actions.payConfirm")} onConfirm={() => payDeploy(row.orderNo)}>
              <ReceiptText className="h-3.5 w-3.5" />{t("actions.payButton")}</ConfirmActionButton>
          ) : null}
          {canStart(row) ? (
            <Button variant="default" size="sm" className="gap-1.5" onClick={() => void startAsset(row.orderNo)}>
              <PlayCircle className="h-3.5 w-3.5" />
              {t("actions.startButton")}
            </Button>
          ) : null}
          {(getApiStage(row) === "RUNNING" || getApiStage(row) === "READY_TO_START") ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              title={t("actions.settleHint")}
              onClick={() => void openEarlySettlement(row)}
            >
              <History className="h-3.5 w-3.5" />
              {t("actions.settleEarly")}
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<ApiDeployInfoResponse>[] = [
    {
      title: t("detail.credentialInfo"),
      fields: [
        { label: t("detail.currentStage"), render: (detail) => <ApiStageCell row={detail} /> },
        { label: t("detail.credentialNo"), render: (detail) => <span className="font-mono">{formatEmpty(detail.credentialNo)}</span> },
        { label: t("detail.tokenStatus"), render: (detail) => <StatusBadge status={detail.tokenStatus} /> },
        { label: t("detail.apiName"), render: (detail) => formatEmpty(detail.apiName) },
        { label: "API Base URL", render: (detail) => <CopyableSecret value={detail.apiBaseUrl} canReveal={false} /> },
        { label: "Token", render: (detail) => <CopyableSecret value={detail.tokenMasked} maskedValue={detail.tokenMasked} canReveal={false} /> },
        { label: t("detail.model"), render: (detail) => formatEmpty(detail.modelNameSnapshot) },
      ],
    },
    {
      title: t("detail.deploymentInfo"),
      fields: [
        { label: t("detail.order"), render: (detail) => <span className="font-mono">{detail.orderNo}</span> },
        { label: t("detail.orderStatus"), render: (detail) => <StatusBadge status={detail.orderStatus} /> },
        { label: t("detail.deployStatus"), render: (detail) => <StatusBadge status={detail.deployOrderStatus} /> },
        { label: t("detail.deployFee"), render: (detail) => <MoneyText value={detail.deployFeeSnapshot} /> },
        { label: t("detail.paidAt"), render: (detail) => <DateTimeText value={detail.paidAt} /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />
      <ErrorAlert message={error} />
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.orderNo} loading={loading} emptyText={t("empty")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
        {t("info")}</div>
      <EarlySettlementDialog
        open={Boolean(settlementTarget)}
        preview={settlementPreview}
        result={settlementResult}
        loading={settlementLoading}
        submitting={settlementSubmitting}
        onClose={closeEarlySettlement}
        onConfirm={confirmEarlySettlement}
      />
      <DetailDrawer
        data={detail}
        open={Boolean(detail)}
        title={t("drawerTitle")}
        subtitle={(data) => data.orderNo}
        sections={detailSections}
        onClose={() => setDetail(null)}
      >
        {(data) => (
          <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/orders?orderNo=${encodeURIComponent(data.orderNo)}`}>
                <PackageOpen className="mr-2 h-4 w-4" />
                {t("detail.viewAssetOrder")}
              </Link>
            </Button>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}

function EarlySettlementDialog({
  open,
  preview,
  result,
  loading,
  submitting,
  onClose,
  onConfirm,
}: {
  open: boolean;
  preview: RentalOrderDetailResponse | null;
  result: SettlementOrderResponse | null;
  loading: boolean;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("DashboardApi.earlySettlement");
  const principalAmount = preview?.orderAmount ?? 0;
  const penaltyRate = preview?.earlyPenaltyRateSnapshot ?? 0;
  const penaltyAmount = principalAmount * penaltyRate / 100;
  const estimatedRefundAmount = Math.max(0, principalAmount - penaltyAmount);
  const currency = preview?.currency ?? result?.currency ?? "USDT";

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="sm:max-w-[540px]">
        {result ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                {t("successTitle")}
              </DialogTitle>
              <DialogDescription>
                {t("successDescription", { amount: formatMoneyForMessage(result.actualSettleAmount, result.currency) })}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
              <SettlementInfoRow label={t("settlementNo")} value={<span className="font-mono">{result.settlementNo}</span>} />
              <SettlementInfoRow label={t("actualRefund")} value={<MoneyText value={result.actualSettleAmount} currency={result.currency} />} />
              <SettlementInfoRow label={t("penaltyAmount")} value={<MoneyText value={result.penaltyAmount} currency={result.currency} />} />
              <SettlementInfoRow label={t("walletTxNo")} value={formatEmpty(result.walletTxNo)} />
            </div>
            <DialogFooter>
              <Button onClick={onClose}>{t("close")}</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("title")}</DialogTitle>
              <DialogDescription>{t("description")}</DialogDescription>
            </DialogHeader>
            {loading || !preview ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("loading")}
              </div>
            ) : (
              <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
                <SettlementInfoRow label={t("principalAmount")} value={<MoneyText value={principalAmount} currency={currency} />} />
                <SettlementInfoRow label={t("penaltyRate")} value={formatPercent(penaltyRate)} />
                <SettlementInfoRow label={t("penaltyAmount")} value={<MoneyText value={penaltyAmount} currency={currency} />} />
                <SettlementInfoRow label={t("estimatedRefund")} value={<MoneyText value={estimatedRefundAmount} currency={currency} />} />
                <SettlementInfoRow label={t("deployFee")} value={t("nonRefundable")} />
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading || submitting}>
                {t("cancel")}
              </Button>
              <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading || submitting || !preview}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <History className="mr-2 h-4 w-4" />}
                {t("confirm")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SettlementInfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

function formatMoneyForMessage(value: number, currency: string) {
  return `${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

function ApiStageCell({ row }: { row: ApiDeployInfoResponse }) {
  const t = useTranslations("DashboardApi");
  const stage = getApiStage(row);
  const className = {
    PAY_DEPLOY: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    DEPLOYING: "border-primary/20 bg-primary/10 text-primary",
    READY_TO_START: "border-violet-500/20 bg-violet-500/10 text-violet-300",
    RUNNING: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    ENDED: "border-border bg-muted text-muted-foreground",
    CANCELED: "border-rose-500/20 bg-rose-500/10 text-rose-400",
    BLOCKED: "border-border bg-muted text-muted-foreground",
  }[stage];

  return (
    <div className="space-y-1">
      <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${className}`}>
        {t(`status.${stage}`)}
      </Badge>
      <p className="max-w-[220px] text-xs leading-5 text-muted-foreground">{t(`statusHelp.${stage}`)}</p>
    </div>
  );
}
