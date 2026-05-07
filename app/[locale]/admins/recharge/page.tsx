"use client";

import { HasPermission } from "@/components/shared/HasPermission";
import { AdminRole } from "@/types/enums";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Eye, X } from "lucide-react";
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
import { approveRecharge, getAdminRechargeOrderDetail, getAdminRechargeOrders, rejectRecharge } from "@/api/admin";
import type { RechargeOrderQueryRequest, RechargeOrderResponse } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface RechargeFilters {
  status: string;
  startTime: string;
  endTime: string;
}

const initialFilters: RechargeFilters = { status: "", startTime: "", endTime: "" };
const initialQuery: RechargeOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function AdminRechargePage() {
  const t = useTranslations("AdminPages.recharge");
  const [filters, setFilters] = useState<RechargeFilters>(initialFilters);
  const [detail, setDetail] = useState<RechargeOrderResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Approval Dialog States
  const [actionRow, setActionRow] = useState<RechargeOrderResponse | null>(null);
  const [dialogType, setDialogType] = useState<"approve" | "reject" | null>(null);
  const [actualAmountInput, setActualAmountInput] = useState<string>("");
  const [reviewRemark, setReviewRemark] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loader = useCallback(async (params: RechargeOrderQueryRequest) => (await getAdminRechargeOrders(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: RechargeFilters): RechargeOrderQueryRequest => ({
    pageNo: 1,
    pageSize: page.pageSize,
    status: nextFilters.status || undefined,
    startTime: nextFilters.startTime || undefined,
    endTime: nextFilters.endTime || undefined,
  });

  const openDetail = async (rechargeNo: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminRechargeOrderDetail(rechargeNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const openApprove = (row: RechargeOrderResponse) => {
    setActionRow(row);
    setDialogType("approve");
    setActualAmountInput(String(row.actualAmount || row.applyAmount));
    setReviewRemark("");
    setActionError(null);
  };

  const openReject = (row: RechargeOrderResponse) => {
    setActionRow(row);
    setDialogType("reject");
    setReviewRemark("");
    setActionError(null);
  };

  const handleApprove = async () => {
    if (!actionRow) return;
    const actualAmount = Number(actualAmountInput);
    if (!Number.isFinite(actualAmount) || actualAmount <= 0) {
      setActionError(t("actualCreditedAmountMustBeANumberGreaterThan0"));
      return;
    }
    try {
      setIsSubmitting(true);
      await approveRecharge(actionRow.rechargeNo, { actualAmount, reviewRemark });
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
      setActionError(t("aRejectionReasonIsRequiredForTopUpRejection"));
      return;
    }
    try {
      setIsSubmitting(true);
      await rejectRecharge(actionRow.rechargeNo, { reviewRemark });
      setDialogType(null);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: DataTableColumn<RechargeOrderResponse>[] = [
    { key: "rechargeNo", title: t("topUpOrderNo"), render: (row) => <CopyableSecret value={row.rechargeNo} maskedValue={row.rechargeNo} canReveal={false} /> },
    { key: "userName", title: t("userName"), render: (row) => formatEmpty(row.userName) },
    { key: "channelName", title: t("paymentMethod"), render: (row) => `${formatEmpty(row.channelName)} / ${formatEmpty(row.network)}` },
    { key: "applyAmount", title: t("requestedAmount"), render: (row) => <MoneyText value={row.applyAmount} currency={row.currency} /> },
    { key: "actualAmount", title: t("creditedAmount"), render: (row) => <MoneyText value={row.actualAmount} currency={row.currency} /> },
    { key: "status", title: t("reviewStatus"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: t("createdAt"), render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="font-medium" onClick={() => void openDetail(row.rechargeNo)}>
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
        </div>
      ),
    },
  ];

  const detailSections: DetailSectionDef<RechargeOrderResponse>[] = [
        {
          title: t("orderInformation"),
          fields: [
            { label: t("topUpOrderNo"), render: (detail) => <CopyableSecret value={detail.rechargeNo} maskedValue={detail.rechargeNo} canReveal={false} /> },
            { label: t("userName"), render: (detail) => detail.userName },
            { label: t("status"), render: (detail) => <StatusBadge status={detail.status} /> },
            { label: t("requestedAmount"), render: (detail) => <MoneyText value={detail.applyAmount} currency={detail.currency} /> },
            { label: t("actualCredit"), render: (detail) => <MoneyText value={detail.actualAmount} currency={detail.currency} /> },
          ],
        },
        {
          title: t("receivingInformation"),
          fields: [
            { label: t("paymentMethod"), render: (detail) => detail.channelName },
            { label: t("network"), render: (detail) => detail.network },
            { label: t("receivingAccount"), render: (detail) => <CopyableSecret value={detail.accountNo} /> },
            { label: t("externalTransactionNo"), render: (detail) => <CopyableSecret value={detail.externalTxNo} /> },
          ],
        },
        {
          title: t("reviewInformation"),
          fields: [
            { label: t("reviewer"), render: (detail) => formatEmpty(detail.reviewedBy) },
            { label: t("reviewedAt"), render: (detail) => <DateTimeText value={detail.reviewedAt} /> },
            { label: t("reviewNotes"), render: (detail) => formatEmpty(detail.reviewRemark) },
            { label: t("walletTransaction"), render: (detail) => <CopyableSecret value={detail.walletTxNo} maskedValue={detail.walletTxNo ?? "-"} canReveal={false} /> },
          ],
        },
        {
          title: t("timeInformation"),
          fields: [
            { label: t("createdAt"), render: (detail) => <DateTimeText value={detail.createdAt} /> },
            { label: t("creditedAt"), render: (detail) => <DateTimeText value={detail.creditedAt} /> },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="FINANCE REVIEW" title={t("topUpReview")} description={t("reviewUserTopUpOrdersAndApproveOrRejectPendingRequests")} />
      <ErrorAlert message={actionError ?? error} />
      <SearchPanel
        onSearch={() => updateParams(buildQuery(filters))}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label>{t("topUpStatus")}</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allStatuses")}</SelectItem>
              <SelectItem value="SUBMITTED">{t("pendingReview")}</SelectItem>
              <SelectItem value="APPROVED">{t("approved")}</SelectItem>
              <SelectItem value="REJECTED">{t("rejected")}</SelectItem>
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
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.rechargeNo} loading={loading} emptyText={t("noTopUpOrdersYet")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title={t("topUpOrderDetails")} subtitle={(data) => data.rechargeNo} sections={detailSections} onClose={() => setDetailOpen(false)} />

      {/* Approve Dialog */}
      <Dialog open={dialogType === "approve"} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("approveTopUp")}</DialogTitle>
            <DialogDescription>
              {t("confirmTheActualCreditedAmountOnceApprovedItWillBePostedDirectlyToTheUserSWallet")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t("orderNo")}</Label>
              <span className="col-span-3 text-sm font-mono text-muted-foreground">{actionRow?.rechargeNo}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t("requestedAmount")}</Label>
              <span className="col-span-3 text-sm font-semibold">{actionRow?.applyAmount} {actionRow?.currency}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="actualAmount" className="text-right">{t("actualCredit")}</Label>
              <Input
                id="actualAmount"
                type="number"
                value={actualAmountInput}
                onChange={(e) => setActualAmountInput(e.target.value)}
                className="col-span-3"
              />
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
            <DialogTitle>{t("rejectTopUp")}</DialogTitle>
            <DialogDescription>
              {t("afterRejectionTheOrderWillBeMarkedRejectedEnterAReasonWhichMayBeShownToTheUser")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t("orderNo")}</Label>
              <span className="col-span-3 text-sm font-mono text-muted-foreground">{actionRow?.rechargeNo}</span>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="rejectRemark" className="text-right mt-2">{t("rejectionReason")}</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {[t("paymentProofIsUnclear"), t("noActualCreditFound"), t("amountDoesNotMatch")].map((reason) => (
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
    </div>
  );
}
