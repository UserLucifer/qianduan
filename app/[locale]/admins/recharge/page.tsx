"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Eye,
  Loader2,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { HasPermission } from "@/components/shared/HasPermission";
import { AdminRole } from "@/types/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MoneyText } from "@/components/shared/MoneyText";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { approveRecharge, getAdminRechargeOrderDetail, getAdminRechargeOrders, rejectRecharge } from "@/api/admin";
import type { RechargeOrderQueryRequest, RechargeOrderResponse } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { cn } from "@/lib/utils";

interface RechargeFilters {
  keyword: string;
  status: string;
  dateRange: string;
}

type ReviewDecision = "approve" | "reject";

const ALL_STATUS = "ALL";
const ALL_TIME = "ALL";
const initialFilters: RechargeFilters = { keyword: "", status: ALL_STATUS, dateRange: ALL_TIME };
const initialQuery: RechargeOrderQueryRequest = { pageNo: 1, pageSize: 10 };

function formatStartOfDay(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} 00:00:00`;
}

function hasText(value: string | null | undefined) {
  return Boolean(value && value.trim());
}

function canReviewOrder(row: RechargeOrderResponse) {
  return row.status === "SUBMITTED" || row.status === "PENDING_REVIEW";
}

function ReviewField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 space-y-1", className)}>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}

export default function AdminRechargePage() {
  const t = useTranslations("AdminPages.recharge");
  const ts = useTranslations("DashboardSettlements");
  const [filters, setFilters] = useState<RechargeFilters>(initialFilters);
  const [selectedOrder, setSelectedOrder] = useState<RechargeOrderResponse | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<ReviewDecision>("approve");
  const [actualAmountInput, setActualAmountInput] = useState("");
  const [reviewRemark, setReviewRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const queryTimer = useRef<number | null>(null);

  const loader = useCallback(async (params: RechargeOrderQueryRequest) => (await getAdminRechargeOrders(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = useCallback((nextFilters: RechargeFilters): RechargeOrderQueryRequest => {
    let startTime: string | undefined;
    if (nextFilters.dateRange !== ALL_TIME) {
      const d = new Date();
      d.setDate(d.getDate() - Number(nextFilters.dateRange));
      startTime = formatStartOfDay(d);
    }

    return {
      pageNo: 1,
      pageSize: page.pageSize,
      keyword: nextFilters.keyword.trim() || undefined,
      status: nextFilters.status === ALL_STATUS ? undefined : nextFilters.status,
      startTime,
    };
  }, [page.pageSize]);

  const applyFilters = useCallback((nextFilters: RechargeFilters, delay = 0) => {
    if (queryTimer.current) {
      window.clearTimeout(queryTimer.current);
      queryTimer.current = null;
    }

    if (delay <= 0) {
      updateParams(buildQuery(nextFilters));
      return;
    }

    queryTimer.current = window.setTimeout(() => {
      updateParams(buildQuery(nextFilters));
      queryTimer.current = null;
    }, delay);
  }, [buildQuery, updateParams]);

  useEffect(() => {
    return () => {
      if (queryTimer.current) {
        window.clearTimeout(queryTimer.current);
      }
    };
  }, []);

  const pageStats = useMemo(() => {
    const pending = page.records.filter(canReviewOrder).length;
    const approved = page.records.filter((row) => row.status === "APPROVED").length;
    const rejected = page.records.filter((row) => row.status === "REJECTED").length;
    return { pending, approved, rejected };
  }, [page.records]);

  const renderProofLink = (url: string | null | undefined, compact = false) => {
    const proofUrl = url?.trim();
    if (!proofUrl) {
      return <span className="text-xs text-muted-foreground">{t("noPaymentProof")}</span>;
    }

    return (
      <Button asChild variant="outline" size="sm" className={cn("h-8 px-2.5 text-xs", compact && "h-7")}>
        <a href={proofUrl} target="_blank" rel="noreferrer">
          <ExternalLink className="h-3.5 w-3.5" />
          {t("viewPaymentProof")}
        </a>
      </Button>
    );
  };

  const openWorkspace = async (row: RechargeOrderResponse) => {
    setSelectedOrder(row);
    setReviewDecision(canReviewOrder(row) ? "approve" : "reject");
    setActualAmountInput(String(row.actualAmount || row.applyAmount || ""));
    setReviewRemark("");
    setActionError(null);
    setSelectedLoading(true);

    try {
      const res = await getAdminRechargeOrderDetail(row.rechargeNo);
      setSelectedOrder(res.data);
      setActualAmountInput(String(res.data.actualAmount || res.data.applyAmount || ""));
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setSelectedLoading(false);
    }
  };

  const closeWorkspace = () => {
    setSelectedOrder(null);
    setActionError(null);
    setReviewRemark("");
    setActualAmountInput("");
  };

  const handleApprove = async () => {
    if (!selectedOrder) return;

    const actualAmount = Number(actualAmountInput);
    if (!Number.isFinite(actualAmount) || actualAmount <= 0) {
      setActionError(t("actualCreditedAmountMustBeANumberGreaterThan0"));
      return;
    }

    setIsSubmitting(true);
    setActionError(null);
    try {
      await approveRecharge(selectedOrder.rechargeNo, {
        actualAmount,
        reviewRemark: reviewRemark.trim() || undefined,
      });
      toast.success(t("approveSuccess"));
      closeWorkspace();
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedOrder) return;

    if (!reviewRemark.trim()) {
      setActionError(t("aRejectionReasonIsRequiredForTopUpRejection"));
      return;
    }

    setIsSubmitting(true);
    setActionError(null);
    try {
      await rejectRecharge(selectedOrder.rechargeNo, { reviewRemark: reviewRemark.trim() });
      toast.success(t("rejectSuccess"));
      closeWorkspace();
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: DataTableColumn<RechargeOrderResponse>[] = [
    {
      key: "rechargeNo",
      title: t("topUpOrderNo"),
      className: "min-w-[220px]",
      render: (row) => (
        <div className="space-y-2">
          <CopyableSecret value={row.rechargeNo} maskedValue={row.rechargeNo} canReveal={false} />
          <div className="text-xs text-muted-foreground">
            <DateTimeText value={row.createdAt} />
          </div>
        </div>
      ),
    },
    {
      key: "userName",
      title: t("rechargeUser"),
      className: "min-w-[180px]",
      render: (row) => (
        <div className="min-w-0 space-y-1">
          <div className="truncate text-sm font-medium">{formatEmpty(row.userName)}</div>
          {"email" in row ? <div className="truncate text-xs text-muted-foreground">{formatEmpty(row.email)}</div> : null}
        </div>
      ),
    },
    {
      key: "channelName",
      title: t("paymentMethod"),
      className: "min-w-[160px]",
      render: (row) => (
        <div className="space-y-1">
          <div className="text-sm font-medium">{formatEmpty(row.channelName)}</div>
          <Badge variant="secondary" className="rounded-md text-[11px]">{formatEmpty(row.network)}</Badge>
        </div>
      ),
    },
    {
      key: "applyAmount",
      title: t("amountCheck"),
      className: "min-w-[180px]",
      render: (row) => (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{t("requestedAmount")}</span>
            <MoneyText value={row.applyAmount} currency={row.currency} />
          </div>
          {row.status === "APPROVED" || row.actualAmount !== row.applyAmount ? (
            <div className="flex items-center justify-between gap-3 border-t pt-1.5">
              <span className="text-xs text-muted-foreground">{t("creditedAmount")}</span>
              <MoneyText value={row.actualAmount} currency={row.currency} className="text-emerald-500" />
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: "externalTxNo",
      title: t("paymentEvidence"),
      className: "min-w-[260px]",
      render: (row) => (
        <div className="space-y-2">
          <CopyableSecret value={row.externalTxNo} maskedValue={row.externalTxNo || "-"} canReveal={false} className="max-w-[200px]" />
          {hasText(row.userRemark) ? (
            <div className="line-clamp-2 max-w-[260px] text-xs leading-5 text-muted-foreground">
              {row.userRemark}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: "status",
      title: t("reviewStatus"),
      className: "w-[120px]",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      title: t("actions"),
      className: "w-[120px] text-right",
      render: (row) => (
        <div className="flex justify-end">
          {canReviewOrder(row) ? (
            <HasPermission role={[AdminRole.SUPER_ADMIN, AdminRole.ADMIN]}>
              <Button size="sm" onClick={() => void openWorkspace(row)}>
                <ClipboardCheck className="h-4 w-4" />
                {t("process")}
              </Button>
            </HasPermission>
          ) : (
            <Button variant="outline" size="sm" onClick={() => void openWorkspace(row)}>
              <Eye className="h-4 w-4" />
              {t("details")}
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleStatusChange = (value: string) => {
    const nextFilters = { ...filters, status: value };
    setFilters(nextFilters);
    applyFilters(nextFilters);
  };

  const handleDateRangeChange = (value: string) => {
    const nextFilters = { ...filters, dateRange: value };
    setFilters(nextFilters);
    applyFilters(nextFilters);
  };

  if (selectedOrder) {
    return (
      <RechargeReviewWorkspace
        order={selectedOrder}
        loading={selectedLoading}
        actionError={actionError}
        decision={reviewDecision}
        actualAmountInput={actualAmountInput}
        reviewRemark={reviewRemark}
        isSubmitting={isSubmitting}
        canReview={canReviewOrder(selectedOrder)}
        renderProofLink={renderProofLink}
        onBack={closeWorkspace}
        onDecisionChange={setReviewDecision}
        onActualAmountChange={setActualAmountInput}
        onRemarkChange={setReviewRemark}
        onApprove={() => void handleApprove()}
        onReject={() => void handleReject()}
        t={t}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        eyebrow={t("headerEyebrow")}
        title={t("topUpReview")}
        description={t("reviewUserTopUpOrdersAndApproveOrRejectPendingRequests")}
      />

      <ErrorAlert message={actionError ?? error} />

      <div className="grid gap-3 md:grid-cols-3">
        <ReviewMetric title={t("pendingReview")} value={pageStats.pending} icon={<ClipboardCheck className="h-4 w-4" />} />
        <ReviewMetric title={t("approved")} value={pageStats.approved} icon={<CheckCircle2 className="h-4 w-4" />} />
        <ReviewMetric title={t("rejected")} value={pageStats.rejected} icon={<XCircle className="h-4 w-4" />} />
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <Tabs value={filters.status} onValueChange={handleStatusChange} className="w-full xl:w-auto">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-muted/50 p-1 sm:grid-cols-4 xl:w-auto">
                <TabsTrigger value={ALL_STATUS}>{t("allStatuses")}</TabsTrigger>
                <TabsTrigger value="SUBMITTED">{t("pendingReview")}</TabsTrigger>
                <TabsTrigger value="APPROVED">{t("approved")}</TabsTrigger>
                <TabsTrigger value="REJECTED">{t("rejected")}</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[240px]">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={filters.keyword}
                  onChange={(event) => {
                    const nextFilters = { ...filters, keyword: event.target.value };
                    setFilters(nextFilters);
                    applyFilters(nextFilters, 300);
                  }}
                  placeholder={t("searchEmailOrUsername")}
                  className="h-10 pl-9"
                />
              </div>

              <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger className="h-10 w-full sm:w-[140px]">
                  <SelectValue placeholder={ts("filters.allTime")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_TIME}>{ts("filters.allTime")}</SelectItem>
                  <SelectItem value="3">{ts("filters.last3Days")}</SelectItem>
                  <SelectItem value="7">{ts("filters.last7Days")}</SelectItem>
                  <SelectItem value="30">{ts("filters.last30Days")}</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={page.records}
        rowKey={(row) => row.rechargeNo}
        loading={loading}
        emptyText={t("noTopUpOrdersYet")}
        pageNo={page.pageNo}
        pageSize={page.pageSize}
        total={page.total}
        onPageChange={changePage}
      />
    </div>
  );
}

function ReviewMetric({ title, value, icon }: { title: string; value: number; icon: ReactNode }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function RechargeReviewWorkspace({
  order,
  loading,
  actionError,
  decision,
  actualAmountInput,
  reviewRemark,
  isSubmitting,
  canReview,
  renderProofLink,
  onBack,
  onDecisionChange,
  onActualAmountChange,
  onRemarkChange,
  onApprove,
  onReject,
  t,
}: {
  order: RechargeOrderResponse;
  loading: boolean;
  actionError: string | null;
  decision: ReviewDecision;
  actualAmountInput: string;
  reviewRemark: string;
  isSubmitting: boolean;
  canReview: boolean;
  renderProofLink: (url: string | null | undefined, compact?: boolean) => ReactNode;
  onBack: () => void;
  onDecisionChange: (decision: ReviewDecision) => void;
  onActualAmountChange: (value: string) => void;
  onRemarkChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Button variant="ghost" size="sm" className="-ml-2" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            {t("backToList")}
          </Button>
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t("reviewWorkspace")}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("topUpOrderDetails")}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <CopyableSecret value={order.rechargeNo} maskedValue={order.rechargeNo} canReveal={false} />
              <StatusBadge status={order.status} />
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
            </div>
          </div>
        </div>
        <Card className="w-full shadow-sm lg:w-[320px]">
          <CardContent className="p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("requestedAmount")}</div>
            <div className="mt-2 text-2xl font-semibold">
              <MoneyText value={order.applyAmount} currency={order.currency} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {t("createdAt")}: <DateTimeText value={order.createdAt} />
            </div>
          </CardContent>
        </Card>
      </div>

      <ErrorAlert message={actionError} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("orderInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <ReviewField label={t("rechargeUser")}>
                <div className="min-w-0">
                  <div className="truncate">{formatEmpty(order.userName)}</div>
                  {"email" in order ? <div className="truncate text-xs text-muted-foreground">{formatEmpty(order.email)}</div> : null}
                </div>
              </ReviewField>
              <ReviewField label={t("status")}><StatusBadge status={order.status} /></ReviewField>
              <ReviewField label={t("paymentMethod")}>{formatEmpty(order.channelName)}</ReviewField>
              <ReviewField label={t("network")}><Badge variant="secondary">{formatEmpty(order.network)}</Badge></ReviewField>
              <ReviewField label={t("receivingAccount")} className="sm:col-span-2">
                <CopyableSecret value={order.accountNo} />
              </ReviewField>
              {hasText(order.displayUrl) ? (
                <ReviewField label={t("paymentQueryUrl")} className="sm:col-span-2">
                  <Button asChild variant="outline" size="sm">
                    <a href={order.displayUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      {order.displayUrl}
                    </a>
                  </Button>
                </ReviewField>
              ) : null}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("paymentEvidence")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <ReviewField label={t("externalTransactionNo")} className="sm:col-span-2">
                <CopyableSecret value={order.externalTxNo} maskedValue={order.externalTxNo || "-"} canReveal={false} />
              </ReviewField>
              <ReviewField label={t("paymentProof")} className="sm:col-span-2">
                {renderProofLink(order.paymentProofUrl)}
              </ReviewField>
              <ReviewField label={t("userRemark")} className="sm:col-span-2">
                <div className="rounded-lg border bg-muted/30 p-3 text-sm font-normal leading-6 text-muted-foreground">
                  {formatEmpty(order.userRemark)}
                </div>
              </ReviewField>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("reviewInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <ReviewField label={t("reviewer")}>{formatEmpty(order.reviewedBy)}</ReviewField>
              <ReviewField label={t("reviewedAt")}><DateTimeText value={order.reviewedAt} /></ReviewField>
              <ReviewField label={t("reviewNotes")} className="sm:col-span-2">{formatEmpty(order.reviewRemark)}</ReviewField>
              <ReviewField label={t("creditedAt")}><DateTimeText value={order.creditedAt} /></ReviewField>
              <ReviewField label={t("walletTransaction")}><CopyableSecret value={order.walletTxNo} maskedValue={order.walletTxNo ?? "-"} canReveal={false} /></ReviewField>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {canReview ? t("reviewAction") : t("reviewResult")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {canReview ? t("reviewGuardDescription") : t("completedOrderHint")}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {canReview ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={decision === "approve" ? "default" : "outline"}
                    onClick={() => onDecisionChange("approve")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {t("approve")}
                  </Button>
                  <Button
                    type="button"
                    variant={decision === "reject" ? "destructive" : "outline"}
                    onClick={() => onDecisionChange("reject")}
                  >
                    <XCircle className="h-4 w-4" />
                    {t("reject")}
                  </Button>
                </div>

                {decision === "approve" ? (
                  <div className="space-y-2">
                    <Label htmlFor="actualAmount">{t("actualCredit")}</Label>
                    <div className="relative">
                      <Input
                        id="actualAmount"
                        type="number"
                        value={actualAmountInput}
                        onChange={(event) => onActualAmountChange(event.target.value)}
                        className="h-11 pr-16 text-base font-semibold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        {order.currency}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("requestedAmount")}: {order.applyAmount} {order.currency}
                    </div>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="reviewRemark">
                    {decision === "reject" ? t("rejectionReason") : t("reviewNotes")}
                  </Label>
                  {decision === "reject" ? (
                    <div className="flex flex-wrap gap-2">
                      {[t("paymentProofIsUnclear"), t("noActualCreditFound"), t("amountDoesNotMatch")].map((reason) => (
                        <Button
                          key={reason}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onRemarkChange(reason)}
                          className={cn(reviewRemark === reason && "border-primary bg-primary/10 text-primary")}
                        >
                          {reason}
                        </Button>
                      ))}
                    </div>
                  ) : null}
                  <Textarea
                    id="reviewRemark"
                    value={reviewRemark}
                    onChange={(event) => onRemarkChange(event.target.value)}
                    placeholder={decision === "reject" ? t("requiredEnterTheRejectionReason") : t("optionalNotes")}
                    className="min-h-[120px]"
                  />
                </div>

                <Button
                  className={cn("h-11 w-full", decision === "reject" && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
                  onClick={decision === "approve" ? onApprove : onReject}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : decision === "approve" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {decision === "approve" ? t("confirmApproval") : t("confirmRejection")}
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <ReviewField label={t("actualCredit")}><MoneyText value={order.actualAmount} currency={order.currency} /></ReviewField>
                <ReviewField label={t("reviewer")}>{formatEmpty(order.reviewedBy)}</ReviewField>
                <ReviewField label={t("reviewedAt")}><DateTimeText value={order.reviewedAt} /></ReviewField>
                <ReviewField label={t("reviewNotes")}>{formatEmpty(order.reviewRemark)}</ReviewField>
              </div>
            )}

            {actionError ? (
              <div className="flex gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-500">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
