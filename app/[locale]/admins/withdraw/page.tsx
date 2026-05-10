"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Loader2,
  Search,
  Send,
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
import { approveWithdraw, getAdminWithdrawOrderDetail, getAdminWithdrawOrders, markWithdrawPaid, rejectWithdraw } from "@/api/admin";
import type { WithdrawOrderQueryRequest, WithdrawOrderResponse } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { cn } from "@/lib/utils";

interface WithdrawFilters {
  keyword: string;
  status: string;
  dateRange: string;
}

type ReviewDecision = "approve" | "reject";

const ALL_STATUS = "ALL";
const ALL_TIME = "ALL";
const initialFilters: WithdrawFilters = { keyword: "", status: ALL_STATUS, dateRange: ALL_TIME };
const initialQuery: WithdrawOrderQueryRequest = { pageNo: 1, pageSize: 10 };

function formatStartOfDay(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} 00:00:00`;
}

function canReviewOrder(row: WithdrawOrderResponse) {
  return row.status === "PENDING_REVIEW";
}

function canPayOrder(row: WithdrawOrderResponse) {
  return row.status === "APPROVED";
}

function canProcessOrder(row: WithdrawOrderResponse) {
  return canReviewOrder(row) || canPayOrder(row);
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

export default function AdminWithdrawPage() {
  const t = useTranslations("AdminPages.withdraw");
  const [filters, setFilters] = useState<WithdrawFilters>(initialFilters);
  const [selectedOrder, setSelectedOrder] = useState<WithdrawOrderResponse | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<ReviewDecision>("approve");
  const [reviewRemark, setReviewRemark] = useState("");
  const [payProofNo, setPayProofNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const queryTimer = useRef<number | null>(null);

  const loader = useCallback(async (params: WithdrawOrderQueryRequest) => (await getAdminWithdrawOrders(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = useCallback((nextFilters: WithdrawFilters): WithdrawOrderQueryRequest => {
    let startTime: string | undefined = undefined;
    if (nextFilters.dateRange !== ALL_TIME) {
      const d = new Date();
      const days = Number(nextFilters.dateRange);
      if (Number.isFinite(days)) {
        d.setDate(d.getDate() - days);
        startTime = formatStartOfDay(d);
      }
    }

    return {
      pageNo: 1,
      pageSize: page.pageSize,
      keyword: nextFilters.keyword.trim() || undefined,
      status: nextFilters.status === ALL_STATUS ? undefined : nextFilters.status || undefined,
      startTime,
    };
  }, [page.pageSize]);

  const applyFilters = useCallback((nextFilters: WithdrawFilters, delay = 0) => {
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
    const awaitingPayment = page.records.filter(canPayOrder).length;
    const paid = page.records.filter((row) => row.status === "PAID").length;
    return { pending, awaitingPayment, paid };
  }, [page.records]);

  const openWorkspace = async (row: WithdrawOrderResponse) => {
    setSelectedOrder(row);
    setReviewDecision("approve");
    setReviewRemark("");
    setPayProofNo(row.payProofNo ?? "");
    setActionError(null);

    setSelectedLoading(true);
    try {
      const res = await getAdminWithdrawOrderDetail(row.withdrawNo);
      setSelectedOrder(res.data);
      setPayProofNo(res.data.payProofNo ?? "");
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setSelectedLoading(false);
    }
  };

  const closeWorkspace = () => {
    setSelectedOrder(null);
    setSelectedLoading(false);
    setActionError(null);
    setReviewRemark("");
    setPayProofNo("");
  };

  const handleApprove = async () => {
    if (!selectedOrder) return;

    setIsSubmitting(true);
    setActionError(null);
    try {
      await approveWithdraw(selectedOrder.withdrawNo, { reviewRemark: reviewRemark.trim() || undefined });
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
      setActionError(t("aRejectionReasonIsRequiredForWithdrawalRejection"));
      return;
    }

    setIsSubmitting(true);
    setActionError(null);
    try {
      await rejectWithdraw(selectedOrder.withdrawNo, { reviewRemark: reviewRemark.trim() });
      toast.success(t("rejectSuccess"));
      closeWorkspace();
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaid = async () => {
    if (!selectedOrder) return;

    if (!payProofNo.trim()) {
      setActionError(t("aPaymentProofNumberIsRequiredBeforeMarkingTheWithdrawalAsPaid"));
      return;
    }

    setIsSubmitting(true);
    setActionError(null);
    try {
      await markWithdrawPaid(selectedOrder.withdrawNo, { payProofNo: payProofNo.trim() });
      toast.success(t("markPaidSuccess"));
      closeWorkspace();
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (value: string) => {
    const nextFilters = { ...filters, status: value };
    setFilters(nextFilters);
    applyFilters(nextFilters);
  };

  const handleKeywordChange = (value: string) => {
    const nextFilters = { ...filters, keyword: value };
    setFilters(nextFilters);
    applyFilters(nextFilters, 300);
  };

  const handleDateRangeChange = (value: string) => {
    const nextFilters = { ...filters, dateRange: value };
    setFilters(nextFilters);
    applyFilters(nextFilters);
  };

  const columns: DataTableColumn<WithdrawOrderResponse>[] = [
    {
      key: "withdrawNo",
      title: t("withdrawalOrderNo"),
      className: "min-w-[220px]",
      render: (row) => (
        <div className="space-y-2">
          <CopyableSecret value={row.withdrawNo} maskedValue={row.withdrawNo} canReveal={false} />
          <div className="text-xs text-muted-foreground">
            <DateTimeText value={row.createdAt} />
          </div>
        </div>
      ),
    },
    {
      key: "withdrawUser",
      title: t("withdrawUser"),
      className: "min-w-[180px]",
      render: (row) => (
        <div className="min-w-0 space-y-1">
          <div className="truncate text-sm font-medium">{formatEmpty(row.userName)}</div>
        </div>
      ),
    },
    {
      key: "applyAmount",
      title: t("amountCheck"),
      className: "min-w-[190px]",
      render: (row) => (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{t("withdrawalAmount")}</span>
            <MoneyText value={row.applyAmount} currency={row.currency} />
          </div>
          <div className="flex items-center justify-between gap-3 border-t pt-1.5">
            <span className="text-xs text-muted-foreground">{t("creditedAmount")}</span>
            <MoneyText value={row.actualAmount} currency={row.currency} className="text-emerald-500" />
          </div>
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
          {canProcessOrder(row) ? (
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

  if (selectedOrder) {
    return (
      <WithdrawReviewWorkspace
        order={selectedOrder}
        loading={selectedLoading}
        actionError={actionError}
        decision={reviewDecision}
        reviewRemark={reviewRemark}
        payProofNo={payProofNo}
        isSubmitting={isSubmitting}
        canReview={canReviewOrder(selectedOrder)}
        canPay={canPayOrder(selectedOrder)}
        onBack={closeWorkspace}
        onDecisionChange={setReviewDecision}
        onRemarkChange={setReviewRemark}
        onPayProofNoChange={setPayProofNo}
        onApprove={() => void handleApprove()}
        onReject={() => void handleReject()}
        onPaid={() => void handlePaid()}
        t={t}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        eyebrow={t("headerEyebrow")}
        title={t("withdrawalReview")}
        description={t("reviewWithdrawalRequestsVerifyReceivingInformationAndRecordPaymentResults")}
      />

      <ErrorAlert message={actionError ?? error} />

      <div className="grid gap-3 md:grid-cols-3">
        <ReviewMetric title={t("pendingReview")} value={pageStats.pending} icon={<ClipboardCheck className="h-4 w-4" />} />
        <ReviewMetric title={t("awaitingPayment")} value={pageStats.awaitingPayment} icon={<Send className="h-4 w-4" />} />
        <ReviewMetric title={t("paid")} value={pageStats.paid} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={filters.status} onValueChange={handleStatusChange} className="w-full lg:w-auto overflow-x-auto">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border/50">
            <TabsTrigger value={ALL_STATUS} className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("allStatuses")}
            </TabsTrigger>
            <TabsTrigger value="PENDING_REVIEW" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("pendingReview")}
            </TabsTrigger>
            <TabsTrigger value="APPROVED" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("awaitingPayment")}
            </TabsTrigger>
            <TabsTrigger value="PAID" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("paid")}
            </TabsTrigger>
            <TabsTrigger value="REJECTED" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("rejected")}
            </TabsTrigger>
            <TabsTrigger value="CANCELED" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("cancelled")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-[220px]">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("searchEmailOrUsername")}
              value={filters.keyword}
              onChange={(event) => handleKeywordChange(event.target.value)}
              className="h-10 pl-9 border-border bg-card text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="h-10 w-[120px] bg-card border-border text-xs font-medium">
              <SelectValue placeholder={t("allTime")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TIME}>{t("allTime")}</SelectItem>
              <SelectItem value="3">{t("last3Days")}</SelectItem>
              <SelectItem value="7">{t("last7Days")}</SelectItem>
              <SelectItem value="30">{t("last30Days")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={page.records}
        rowKey={(row) => row.withdrawNo}
        loading={loading}
        emptyText={t("noWithdrawalOrdersYet")}
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

function WithdrawReviewWorkspace({
  order,
  loading,
  actionError,
  decision,
  reviewRemark,
  payProofNo,
  isSubmitting,
  canReview,
  canPay,
  onBack,
  onDecisionChange,
  onRemarkChange,
  onPayProofNoChange,
  onApprove,
  onReject,
  onPaid,
  t,
}: {
  order: WithdrawOrderResponse;
  loading: boolean;
  actionError: string | null;
  decision: ReviewDecision;
  reviewRemark: string;
  payProofNo: string;
  isSubmitting: boolean;
  canReview: boolean;
  canPay: boolean;
  onBack: () => void;
  onDecisionChange: (decision: ReviewDecision) => void;
  onRemarkChange: (value: string) => void;
  onPayProofNoChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onPaid: () => void;
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
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("withdrawalOrderDetails")}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <CopyableSecret value={order.withdrawNo} maskedValue={order.withdrawNo} canReveal={false} />
              <StatusBadge status={order.status} />
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
            </div>
          </div>
        </div>
        <Card className="w-full shadow-sm lg:w-[320px]">
          <CardContent className="p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("amountToPay")}</div>
            <div className="mt-2 text-2xl font-semibold">
              <MoneyText value={order.actualAmount} currency={order.currency} />
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
              <ReviewField label={t("withdrawUser")}>
                <div className="min-w-0">
                  <div className="truncate">{formatEmpty(order.userName)}</div>
                </div>
              </ReviewField>
              <ReviewField label={t("status")}><StatusBadge status={order.status} /></ReviewField>
              <ReviewField label={t("withdrawalMethod")}>{formatEmpty(order.withdrawMethod)}</ReviewField>
              <ReviewField label={t("network")}><Badge variant="secondary">{formatEmpty(order.network)}</Badge></ReviewField>
              <ReviewField label={t("withdrawalAmount")}><MoneyText value={order.applyAmount} currency={order.currency} /></ReviewField>
              <ReviewField label={t("fee")}><MoneyText value={order.feeAmount} currency={order.currency} /></ReviewField>
              <ReviewField label={t("creditedAmount")}><MoneyText value={order.actualAmount} currency={order.currency} /></ReviewField>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("receivingInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <ReviewField label={t("recipient")}>{formatEmpty(order.accountName)}</ReviewField>
              <ReviewField label={t("network")}><Badge variant="secondary">{formatEmpty(order.network)}</Badge></ReviewField>
              <ReviewField label={t("receivingAccount")} className="sm:col-span-2">
                <CopyableSecret value={order.accountNo} />
              </ReviewField>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("transactionInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <ReviewField label={t("freezeTransaction")}><CopyableSecret value={order.freezeTxNo} maskedValue={order.freezeTxNo ?? "-"} canReveal={false} /></ReviewField>
              <ReviewField label={t("releaseTransaction")}><CopyableSecret value={order.unfreezeTxNo} maskedValue={order.unfreezeTxNo ?? "-"} canReveal={false} /></ReviewField>
              <ReviewField label={t("paymentProof")}><CopyableSecret value={order.payProofNo} maskedValue={order.payProofNo ?? "-"} canReveal={false} /></ReviewField>
              <ReviewField label={t("paymentTransaction")}><CopyableSecret value={order.paidTxNo} maskedValue={order.paidTxNo ?? "-"} canReveal={false} /></ReviewField>
              <ReviewField label={t("paidAt")}><DateTimeText value={order.paidAt} /></ReviewField>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("reviewAndPayment")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <ReviewField label={t("reviewer")}>{formatEmpty(order.reviewedBy)}</ReviewField>
              <ReviewField label={t("reviewedAt")}><DateTimeText value={order.reviewedAt} /></ReviewField>
              <ReviewField label={t("reviewNotes")} className="sm:col-span-2">{formatEmpty(order.reviewRemark)}</ReviewField>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {canReview || canPay ? t("reviewAction") : t("reviewResult")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {canReview ? t("reviewGuardDescription") : canPay ? t("paymentGuardDescription") : t("completedOrderHint")}
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

                <div className="space-y-2">
                  <Label htmlFor="reviewRemark">
                    {decision === "reject" ? t("rejectionReason") : t("reviewNotes")}
                  </Label>
                  {decision === "reject" ? (
                    <div className="flex flex-wrap gap-2">
                      {[t("recipientAccountInformationIsIncorrect"), t("suspectedPolicyViolation"), t("doesNotMeetWithdrawalRules"), t("systemRiskCheckDetectedAnAnomaly")].map((reason) => (
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
            ) : null}

            {canPay ? (
              <>
                <ReviewField label={t("amountToPay")}><MoneyText value={order.actualAmount} currency={order.currency} /></ReviewField>
                <div className="space-y-2">
                  <Label htmlFor="payProofNo">{t("paymentProof")}</Label>
                  <Input
                    id="payProofNo"
                    value={payProofNo}
                    onChange={(event) => onPayProofNoChange(event.target.value)}
                    placeholder={t("requiredOnChainTxidOrOfflineReferenceNumber")}
                    className="h-11"
                  />
                </div>
                <Button className="h-11 w-full" onClick={onPaid} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {t("confirmPayment")}
                </Button>
              </>
            ) : null}

            {!canReview && !canPay ? (
              <div className="space-y-4">
                <ReviewField label={t("status")}><StatusBadge status={order.status} /></ReviewField>
                <ReviewField label={t("reviewer")}>{formatEmpty(order.reviewedBy)}</ReviewField>
                <ReviewField label={t("reviewedAt")}><DateTimeText value={order.reviewedAt} /></ReviewField>
                <ReviewField label={t("reviewNotes")}>{formatEmpty(order.reviewRemark)}</ReviewField>
                <ReviewField label={t("paymentProof")}><CopyableSecret value={order.payProofNo} maskedValue={order.payProofNo ?? "-"} canReveal={false} /></ReviewField>
                <ReviewField label={t("paidAt")}><DateTimeText value={order.paidAt} /></ReviewField>
              </div>
            ) : null}

            <ErrorAlert message={actionError} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
