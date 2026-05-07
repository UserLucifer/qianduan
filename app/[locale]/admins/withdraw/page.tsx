"use client";

import { HasPermission } from "@/components/shared/HasPermission";
import { AdminRole } from "@/types/enums";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Eye, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MoneyText } from "@/components/shared/MoneyText";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { approveWithdraw, getAdminWithdrawOrderDetail, getAdminWithdrawOrders, markWithdrawPaid, rejectWithdraw } from "@/api/admin";
import type { WithdrawOrderQueryRequest, WithdrawOrderResponse } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface WithdrawFilters {
  status: string;
  startTime: string;
  endTime: string;
}

const initialFilters: WithdrawFilters = { status: "", startTime: "", endTime: "" };
const initialQuery: WithdrawOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function AdminWithdrawPage() {
  const t = useTranslations("AdminPages.withdraw");
  const [filters, setFilters] = useState<WithdrawFilters>(initialFilters);
  const [detail, setDetail] = useState<WithdrawOrderResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Approval Dialog States
  const [actionRow, setActionRow] = useState<WithdrawOrderResponse | null>(null);
  const [dialogType, setDialogType] = useState<"approve" | "reject" | "paid" | null>(null);
  const [reviewRemark, setReviewRemark] = useState<string>("");
  const [payProofNo, setPayProofNo] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loader = useCallback(async (params: WithdrawOrderQueryRequest) => (await getAdminWithdrawOrders(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: WithdrawFilters): WithdrawOrderQueryRequest => ({
    pageNo: 1,
    pageSize: page.pageSize,
    status: nextFilters.status || undefined,
    startTime: nextFilters.startTime || undefined,
    endTime: nextFilters.endTime || undefined,
  });

  const openDetail = async (withdrawNo: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminWithdrawOrderDetail(withdrawNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const openApprove = (row: WithdrawOrderResponse) => {
    setActionRow(row);
    setDialogType("approve");
    setReviewRemark("");
    setActionError(null);
  };

  const openReject = (row: WithdrawOrderResponse) => {
    setActionRow(row);
    setDialogType("reject");
    setReviewRemark("");
    setActionError(null);
  };

  const openPaid = (row: WithdrawOrderResponse) => {
    setActionRow(row);
    setDialogType("paid");
    setPayProofNo("");
    setActionError(null);
  };

  const handleApprove = async () => {
    if (!actionRow) return;
    try {
      setIsSubmitting(true);
      await approveWithdraw(actionRow.withdrawNo, { reviewRemark });
      setDialogType(null);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!actionRow) return;
    if (!reviewRemark || !reviewRemark.trim()) {
      setActionError(t("aRejectionReasonIsRequiredForWithdrawalRejection"));
      return;
    }
    try {
      setIsSubmitting(true);
      await rejectWithdraw(actionRow.withdrawNo, { reviewRemark });
      setDialogType(null);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaid = async () => {
    if (!actionRow) return;
    if (!payProofNo || !payProofNo.trim()) {
      setActionError(t("aPaymentProofNumberIsRequiredBeforeMarkingTheWithdrawalAsPaid"));
      return;
    }
    try {
      setIsSubmitting(true);
      await markWithdrawPaid(actionRow.withdrawNo, { payProofNo });
      setDialogType(null);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: DataTableColumn<WithdrawOrderResponse>[] = [
    { key: "withdrawNo", title: t("withdrawalOrderNo"), render: (row) => <CopyableSecret value={row.withdrawNo} maskedValue={row.withdrawNo} canReveal={false} /> },
    { key: "userName", title: t("userName"), render: (row) => formatEmpty(row.userName) },
    { key: "applyAmount", title: t("withdrawalAmount"), render: (row) => <MoneyText value={row.applyAmount} currency={row.currency} /> },
    { key: "feeAmount", title: t("fee"), render: (row) => <MoneyText value={row.feeAmount} currency={row.currency} /> },
    { key: "actualAmount", title: t("creditedAmount"), render: (row) => <MoneyText value={row.actualAmount} currency={row.currency} /> },
    { key: "network", title: t("receivingNetwork"), render: (row) => formatEmpty(row.network) },
    { key: "status", title: t("status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: t("createdAt"), render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDetail(row.withdrawNo)}>
            <Eye className="h-4 w-4" />
            {t("details")}</Button>
          {row.status === "SUBMITTED" || row.status === "PENDING_REVIEW" ? (
            <>
              <HasPermission role={[AdminRole.SUPER_ADMIN, AdminRole.ADMIN]}>
                <Button variant="ghost" size="sm" className="font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10" onClick={() => openApprove(row)}>
                  <Check className="h-4 w-4 mr-1" />
                  {t("approve")}</Button>
                <Button variant="ghost" size="sm" className="font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10" onClick={() => openReject(row)}>
                  <X className="h-4 w-4 mr-1" />
                  {t("reject")}</Button>
              </HasPermission>
            </>
          ) : null}
          {row.status === "APPROVED" ? (
            <HasPermission role={[AdminRole.SUPER_ADMIN, AdminRole.ADMIN]}>
              <Button variant="ghost" size="sm" className="font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10" onClick={() => openPaid(row)}>
                <Send className="h-4 w-4 mr-1" />
                {t("paid")}</Button>
            </HasPermission>
          ) : null}
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<WithdrawOrderResponse>[] = [
        {
          title: t("orderInformation"),
          fields: [
            { label: t("withdrawalOrderNo"), render: (detail) => <CopyableSecret value={detail.withdrawNo} maskedValue={detail.withdrawNo} canReveal={false} /> },
            { label: t("userName"), render: (detail) => detail.userName },
            { label: t("status"), render: (detail) => <StatusBadge status={detail.status} /> },
            { label: t("withdrawalAmount"), render: (detail) => <MoneyText value={detail.applyAmount} currency={detail.currency} /> },
            { label: t("creditedAmount"), render: (detail) => <MoneyText value={detail.actualAmount} currency={detail.currency} /> },
          ],
        },
        {
          title: t("receivingInformation"),
          fields: [
            { label: t("withdrawalMethod"), render: (detail) => formatEmpty(detail.withdrawMethod) },
            { label: t("network"), render: (detail) => formatEmpty(detail.network) },
            { label: t("recipient"), render: (detail) => formatEmpty(detail.accountName) },
            { label: t("receivingAccount"), render: (detail) => <CopyableSecret value={detail.accountNo} /> },
          ],
        },
        {
          title: t("reviewAndPayment"),
          fields: [
            { label: t("fee"), render: (detail) => <MoneyText value={detail.feeAmount} currency={detail.currency} /> },
            { label: t("reviewNotes"), render: (detail) => formatEmpty(detail.reviewRemark) },
            { label: t("paymentProof"), render: (detail) => <CopyableSecret value={detail.payProofNo} maskedValue={detail.payProofNo ?? "-"} canReveal={false} /> },
            { label: t("paidAt"), render: (detail) => <DateTimeText value={detail.paidAt} /> },
          ],
        },
        {
          title: t("transactionInformation"),
          fields: [
            { label: t("freezeTransaction"), render: (detail) => <CopyableSecret value={detail.freezeTxNo} maskedValue={detail.freezeTxNo ?? "-"} canReveal={false} /> },
            { label: t("releaseTransaction"), render: (detail) => <CopyableSecret value={detail.unfreezeTxNo} maskedValue={detail.unfreezeTxNo ?? "-"} canReveal={false} /> },
            { label: t("paymentTransaction"), render: (detail) => <CopyableSecret value={detail.paidTxNo} maskedValue={detail.paidTxNo ?? "-"} canReveal={false} /> },
            { label: t("createdAt"), render: (detail) => <DateTimeText value={detail.createdAt} /> },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="FINANCE REVIEW" title={t("withdrawalReview")} description={t("reviewWithdrawalRequestsVerifyReceivingInformationAndRecordPaymentResults")} />
      <ErrorAlert message={actionError ?? error} />
      <SearchPanel
        onSearch={() => updateParams(buildQuery(filters))}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label>{t("withdrawalStatus")}</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allStatuses")}</SelectItem>
              <SelectItem value="SUBMITTED">{t("pendingReview")}</SelectItem>
              <SelectItem value="APPROVED">{t("awaitingPayment")}</SelectItem>
              <SelectItem value="REJECTED">{t("rejected")}</SelectItem>
              <SelectItem value="PAID">{t("paid")}</SelectItem>
              <SelectItem value="CANCELLED">{t("cancelled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("startDate")}</Label>
          <Input type="date" value={filters.startTime} onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>{t("endDate")}</Label>
          <Input type="date" value={filters.endTime} onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
      </SearchPanel>
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.withdrawNo} loading={loading} emptyText={t("noWithdrawalOrdersYet")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title={t("withdrawalOrderDetails")} subtitle={(data) => data.withdrawNo} sections={detailSections} onClose={() => setDetailOpen(false)} />

      {/* Approve Dialog */}
      <Dialog open={dialogType === "approve"} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("approveWithdrawal")}</DialogTitle>
            <DialogDescription>
              {t("afterApprovalTheOrderEntersAwaitingPaymentCarefullyVerifyTheRecipientInformationFirst")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t("orderNo")}</Label>
              <span className="col-span-3 text-sm font-mono text-muted-foreground">{actionRow?.withdrawNo}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t("withdrawalAmount")}</Label>
              <span className="col-span-3 text-sm font-semibold">{actionRow?.applyAmount} {actionRow?.currency}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t("amountToPay")}</Label>
              <span className="col-span-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">{actionRow?.actualAmount} {actionRow?.currency}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="approveRemark" className="text-right">{t("reviewNotes")}</Label>
              <Input
                id="approveRemark"
                placeholder={t("optionalNotes")}
                value={reviewRemark}
                onChange={(e) => setReviewRemark(e.target.value)}
                className="col-span-3"
              />
            </div>
            {actionError && (
              <div className="text-sm text-rose-500 col-span-4 mt-2">
                {actionError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)} disabled={isSubmitting}>{t("cancel")}</Button>
            <Button onClick={handleApprove} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {t("confirmApproval")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={dialogType === "reject"} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("rejectWithdrawal")}</DialogTitle>
            <DialogDescription>
              {t("afterRejectionTheOrderWillBeCancelledAndTheFrozenUserFundsWillBeReleased")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t("orderNo")}</Label>
              <span className="col-span-3 text-sm font-mono text-muted-foreground">{actionRow?.withdrawNo}</span>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="rejectRemark" className="text-right mt-2">{t("rejectionReason")}</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {[t("recipientAccountInformationIsIncorrect"), t("suspectedPolicyViolation"), t("doesNotMeetWithdrawalRules"), t("systemRiskCheckDetectedAnAnomaly")].map((reason) => (
                    <Button
                      key={reason}
                      variant="outline"
                      size="sm"
                      onClick={() => setReviewRemark(reason)}
                      className="text-xs h-7"
                    >
                      {reason}
                    </Button>
                  ))}
                </div>
                <Textarea
                  id="rejectRemark"
                  className="min-h-[80px]"
                  placeholder={t("requiredEnterTheRejectionReason")}
                  value={reviewRemark}
                  onChange={(e) => setReviewRemark(e.target.value)}
                />
              </div>
            </div>
            {actionError && (
              <div className="text-sm text-rose-500 col-span-4 mt-2">
                {actionError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)} disabled={isSubmitting}>{t("cancel")}</Button>
            <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>
              {t("confirmRejection")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Paid Dialog */}
      <Dialog open={dialogType === "paid"} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("markAsPaid")}</DialogTitle>
            <DialogDescription>
              {t("onlyContinueAfterTheOnChainOrOfflinePaymentHasBeenCompleted")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t("amountToPay")}</Label>
              <span className="col-span-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">{actionRow?.actualAmount} {actionRow?.currency}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payProofNo" className="text-right">{t("paymentProof")}</Label>
              <Input
                id="payProofNo"
                placeholder={t("requiredOnChainTxidOrOfflineReferenceNumber")}
                value={payProofNo}
                onChange={(e) => setPayProofNo(e.target.value)}
                className="col-span-3"
              />
            </div>
            {actionError && (
              <div className="text-sm text-rose-500 col-span-4 mt-2">
                {actionError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)} disabled={isSubmitting}>{t("cancel")}</Button>
            <Button onClick={handlePaid} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {t("confirmPayment")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
