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
import { getAdminSettlementOrderDetail, getAdminSettlementOrders } from "@/api/admin";
import type { AdminSettlementOrderQuery, SettlementOrderResponse } from "@/api/types";
import { settlementTypeLabel } from "@/lib/status";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface SettlementFilters {
  userId: string;
  orderNo: string;
  settlementType: string;
  status: string;
  startTime: string;
  endTime: string;
}

const initialFilters: SettlementFilters = { userId: "", orderNo: "", settlementType: "", status: "", startTime: "", endTime: "" };
const initialQuery: AdminSettlementOrderQuery = { pageNo: 1, pageSize: 10 };

export default function AdminSettlementsPage() {
  const t = useTranslations("AdminPages.settlements");
  const [filters, setFilters] = useState<SettlementFilters>(initialFilters);
  const [detail, setDetail] = useState<SettlementOrderResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: AdminSettlementOrderQuery) => (await getAdminSettlementOrders(params)).data, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: SettlementFilters): AdminSettlementOrderQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    user_id: nextFilters.userId ? Number(nextFilters.userId) : undefined,
    order_no: nextFilters.orderNo || undefined,
    settlement_type: nextFilters.settlementType || undefined,
    status: nextFilters.status || undefined,
    start_time: nextFilters.startTime || undefined,
    end_time: nextFilters.endTime || undefined,
  });

  const openDetail = async (settlementNo: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminSettlementOrderDetail(settlementNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<SettlementOrderResponse>[] = [
    { key: "settlementNo", title: t("settlementNo"), render: (row) => <CopyableSecret value={row.settlementNo} maskedValue={row.settlementNo} canReveal={false} /> },
    { key: "orderNo", title: t("rentalOrder"), render: (row) => <CopyableSecret value={row.orderNo} maskedValue={row.orderNo} canReveal={false} /> },
    { key: "settlementType", title: t("settlementType"), render: (row) => settlementTypeLabel(row.settlementType) },
    { key: "actualSettleAmount", title: t("actualSettlementAmount"), render: (row) => <MoneyText value={row.actualSettleAmount} currency={row.currency} /> },
    { key: "profitAmount", title: t("earningsAmount"), render: (row) => <MoneyText value={row.profitAmount} currency={row.currency} /> },
    { key: "penaltyAmount", title: t("penalty"), render: (row) => <MoneyText value={row.penaltyAmount} currency={row.currency} /> },
    { key: "status", title: t("status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: t("createdAt"), render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDetail(row.settlementNo)}>
          <Eye className="h-4 w-4" />
          {t("details")}</Button>
      ),
    },
  ];

  const detailSections: DetailSectionDef<SettlementOrderResponse>[] = [
        {
          title: t("settlementInformation"),
          fields: [
            { label: t("settlementNo"), render: (detail) => <CopyableSecret value={detail.settlementNo} maskedValue={detail.settlementNo} canReveal={false} /> },
            { label: t("rentalOrder"), render: (detail) => <CopyableSecret value={detail.orderNo} maskedValue={detail.orderNo} canReveal={false} /> },
            { label: t("settlementType"), render: (detail) => settlementTypeLabel(detail.settlementType) },
            { label: t("status"), render: (detail) => <StatusBadge status={detail.status} /> },
          ],
        },
        {
          title: t("amountInformation"),
          fields: [
            { label: t("principal"), render: (detail) => <MoneyText value={detail.principalAmount} currency={detail.currency} /> },
            { label: t("earnings"), render: (detail) => <MoneyText value={detail.profitAmount} currency={detail.currency} /> },
            { label: t("penalty"), render: (detail) => <MoneyText value={detail.penaltyAmount} currency={detail.currency} /> },
            { label: t("actualSettlement"), render: (detail) => <MoneyText value={detail.actualSettleAmount} currency={detail.currency} /> },
          ],
        },
        {
          title: t("reviewAndTransactions"),
          fields: [
            { label: t("reviewer"), render: (detail) => formatEmpty(detail.reviewedBy) },
            { label: t("reviewedAt"), render: (detail) => <DateTimeText value={detail.reviewedAt} /> },
            { label: t("walletTransaction"), render: (detail) => <CopyableSecret value={detail.walletTxNo} maskedValue={detail.walletTxNo ?? "-"} canReveal={false} /> },
            { label: t("notes"), render: (detail) => formatEmpty(detail.remark) },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="SETTLEMENT OPS" title={t("settlementOrderManagement")} description={t("reviewExpiryEarlyAndManualSettlementRecords")} />
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
          <Label>{t("settlementType")}</Label>
          <Select value={filters.settlementType} onValueChange={(val) => setFilters((current) => ({ ...current, settlementType: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder={t("allTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allTypes")}</SelectItem>
              <SelectItem value="EXPIRE">{t("expirySettlement")}</SelectItem>
              <SelectItem value="EARLY_TERMINATE">{t("earlySettlement")}</SelectItem>
              <SelectItem value="MANUAL">{t("manualSettlement")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("settlementStatus")}</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allStatuses")}</SelectItem>
              <SelectItem value="PENDING">{t("pendingSettlement")}</SelectItem>
              <SelectItem value="SETTLING">{t("settling")}</SelectItem>
              <SelectItem value="SETTLED">{t("settled")}</SelectItem>
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
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.settlementNo} loading={loading} emptyText={t("noSettlementOrdersYet")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title={t("settlementOrderDetails")} subtitle={(data) => data.settlementNo} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
