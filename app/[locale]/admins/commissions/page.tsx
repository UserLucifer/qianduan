"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MoneyText } from "@/components/shared/MoneyText";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAdminCommissionRecordDetail, getAdminCommissionRecords } from "@/api/admin";
import type { AdminCommissionRecordQuery, CommissionRecordResponse } from "@/api/types";
import { formatEmpty, formatPercent, toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface CommissionFilters {
  userId: string;
  orderNo: string;
  levelNo: string;
  status: string;
  startTime: string;
  endTime: string;
}

const initialFilters: CommissionFilters = { userId: "", orderNo: "", levelNo: "", status: "", startTime: "", endTime: "" };
const initialQuery: AdminCommissionRecordQuery = { pageNo: 1, pageSize: 10 };

export default function AdminCommissionsPage() {
  const t = useTranslations("AdminPages.commissions");
  const [filters, setFilters] = useState<CommissionFilters>(initialFilters);
  const [detail, setDetail] = useState<CommissionRecordResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: AdminCommissionRecordQuery) => (await getAdminCommissionRecords(params)).data, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: CommissionFilters): AdminCommissionRecordQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    user_id: nextFilters.userId ? Number(nextFilters.userId) : undefined,
    order_no: nextFilters.orderNo || undefined,
    level_no: nextFilters.levelNo ? Number(nextFilters.levelNo) : undefined,
    status: nextFilters.status || undefined,
    start_time: nextFilters.startTime || undefined,
    end_time: nextFilters.endTime || undefined,
  });

  const openDetail = async (commissionNo: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminCommissionRecordDetail(commissionNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<CommissionRecordResponse>[] = [
    { key: "commissionNo", title: t("commissionNo"), render: (row) => <CopyableSecret value={row.commissionNo} maskedValue={row.commissionNo} canReveal={false} /> },
    { key: "sourceUserId", title: t("sourceUser"), render: (row) => formatEmpty(row.sourceUserId) },
    { key: "levelNo", title: t("level"), render: (row) => `L${row.levelNo}` },
    { key: "sourceProfitAmount", title: t("sourceEarnings"), render: (row) => <MoneyText value={row.sourceProfitAmount} /> },
    { key: "commissionRateSnapshot", title: t("commissionRate"), render: (row) => formatPercent(row.commissionRateSnapshot) },
    { key: "commissionAmount", title: t("commissionAmount"), render: (row) => <MoneyText value={row.commissionAmount} /> },
    { key: "status", title: t("status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: t("createdAt"), render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDetail(row.commissionNo)}>
          <Eye className="h-4 w-4" />
          {t("details")}</Button>
      ),
    },
  ];

  const detailSections: DetailSectionDef<CommissionRecordResponse>[] = [
        {
          title: t("commissionInformation"),
          fields: [
            { label: t("commissionNo"), render: (detail) => <CopyableSecret value={detail.commissionNo} maskedValue={detail.commissionNo} canReveal={false} /> },
            { label: t("status"), render: (detail) => <StatusBadge status={detail.status} /> },
            { label: t("level"), render: (detail) => `L${detail.levelNo}` },
            { label: t("commissionAmount"), render: (detail) => <MoneyText value={detail.commissionAmount} /> },
          ],
        },
        {
          title: t("sourceInformation"),
          fields: [
            { label: t("sourceUser"), render: (detail) => detail.sourceUserId },
            { label: t("sourceOrderID"), render: (detail) => detail.sourceOrderId },
            { label: t("sourceEarningsID"), render: (detail) => detail.sourceProfitId },
            { label: t("sourceEarnings"), render: (detail) => <MoneyText value={detail.sourceProfitAmount} /> },
          ],
        },
        {
          title: t("settlementInformation"),
          fields: [
            { label: t("commissionRate"), render: (detail) => formatPercent(detail.commissionRateSnapshot) },
            { label: t("walletTransaction"), render: (detail) => <CopyableSecret value={detail.walletTxNo} maskedValue={detail.walletTxNo ?? "-"} canReveal={false} /> },
            { label: t("settledAt"), render: (detail) => <DateTimeText value={detail.settledAt} /> },
            { label: t("createdAt"), render: (detail) => <DateTimeText value={detail.createdAt} /> },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="COMMISSION OPS" title={t("commissionRecordManagement")} description={t("auditReferralCommissionsByUserOrderLevelAndStatus")} />
      <ErrorAlert message={actionError ?? error} />
      <SearchPanel
        onSearch={() => updateParams(buildQuery(filters))}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="userId">{t("userID")}</Label>
          <Input id="userId" placeholder={t("enterID")} value={filters.userId} onChange={(event) => setFilters((current) => ({ ...current, userId: event.target.value }))} className="h-9 w-[100px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="orderNo">{t("orderNo")}</Label>
          <Input id="orderNo" placeholder={t("enterOrderNumber")} value={filters.orderNo} onChange={(event) => setFilters((current) => ({ ...current, orderNo: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>{t("commissionLevel")}</Label>
          <Select value={filters.levelNo} onValueChange={(val) => setFilters((current) => ({ ...current, levelNo: val }))}>
            <SelectTrigger className="h-9 w-[120px] bg-background text-foreground">
              <SelectValue placeholder={t("allLevels")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allLevels")}</SelectItem>
              <SelectItem value="1">{t("level1")}</SelectItem>
              <SelectItem value="2">{t("level2")}</SelectItem>
              <SelectItem value="3">{t("level3")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("settlementStatus")}</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[120px] bg-background text-foreground">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allStatuses")}</SelectItem>
              <SelectItem value="PENDING">{t("pendingSettlement")}</SelectItem>
              <SelectItem value="SETTLED">{t("settled")}</SelectItem>
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
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.commissionNo} loading={loading} emptyText={t("noCommissionRecordsYet")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title={t("commissionRecordDetails")} subtitle={(data) => data.commissionNo} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
