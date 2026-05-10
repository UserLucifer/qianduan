"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { getAdminRentalOrderDetail, getAdminRentalOrders } from "@/api/admin";
import type { AdminRentalOrderQuery, RentalOrderDetailResponse } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { RentalOrderStatus } from "@/types/enums";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface OrderFilters {
  userId: string;
  orderNo: string;
  orderStatus: string;
  profitStatus: string;
  settlementStatus: string;
  startTime: string;
  endTime: string;
}

const initialFilters: OrderFilters = {
  userId: "",
  orderNo: "",
  orderStatus: "",
  profitStatus: "",
  settlementStatus: "",
  startTime: "",
  endTime: "",
};
const initialQuery: AdminRentalOrderQuery = { pageNo: 1, pageSize: 10 };

const parseQueryUserId = (value: string | null) => {
  const next = Number(value);
  return Number.isFinite(next) && next > 0 ? String(next) : "";
};

export default function AdminOrdersPage() {
  const t = useTranslations("AdminPages.orders");
  const searchParams = useSearchParams();
  const initialFiltersFromUrl = useMemo<OrderFilters>(() => ({
    ...initialFilters,
    userId: parseQueryUserId(searchParams.get("user_id")),
    orderNo: searchParams.get("order_no")?.trim() ?? "",
  }), [searchParams]);
  const initialQueryFromUrl = useMemo<AdminRentalOrderQuery>(() => ({
    ...initialQuery,
    user_id: initialFiltersFromUrl.userId ? Number(initialFiltersFromUrl.userId) : undefined,
    order_no: initialFiltersFromUrl.orderNo || undefined,
  }), [initialFiltersFromUrl]);
  const [filters, setFilters] = useState<OrderFilters>(initialFiltersFromUrl);
  const [detail, setDetail] = useState<RentalOrderDetailResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: AdminRentalOrderQuery) => (await getAdminRentalOrders(params)).data, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQueryFromUrl);

  const buildQuery = (nextFilters: OrderFilters): AdminRentalOrderQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    user_id: nextFilters.userId ? Number(nextFilters.userId) : undefined,
    order_no: nextFilters.orderNo || undefined,
    order_status: nextFilters.orderStatus || undefined,
    profit_status: nextFilters.profitStatus || undefined,
    settlement_status: nextFilters.settlementStatus || undefined,
    start_time: nextFilters.startTime || undefined,
    end_time: nextFilters.endTime || undefined,
  });

  const openDetail = async (orderNo: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminRentalOrderDetail(orderNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };



  const columns: DataTableColumn<RentalOrderDetailResponse>[] = [
    { key: "orderNo", title: t("rentalOrderNo"), render: (row) => <CopyableSecret value={row.orderNo} maskedValue={row.orderNo} canReveal={false} /> },
    { key: "userName", title: t("userName"), render: (row) => formatEmpty(row.userName) },
    { key: "productNameSnapshot", title: t("computeProduct"), render: (row) => formatEmpty(row.productNameSnapshot) },
    { key: "gpuModelSnapshot", title: t("gpuModel"), render: (row) => formatEmpty(row.gpuModelSnapshot) },
    { key: "regionNameSnapshot", title: t("region"), render: (row) => formatEmpty(row.regionNameSnapshot) },
    { key: "orderAmount", title: t("orderAmount"), render: (row) => <MoneyText value={row.orderAmount} currency={row.currency} /> },
    { key: "orderStatus", title: t("orderStatus"), render: (row) => <StatusBadge status={row.orderStatus} /> },
    { key: "profitStatus", title: t("earningsStatus"), render: (row) => <StatusBadge status={row.profitStatus} /> },
    { key: "settlementStatus", title: t("settlementStatus"), render: (row) => <StatusBadge status={row.settlementStatus} /> },
    { key: "createdAt", title: t("createdAt"), render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <Button variant="ghost" size="sm" className="font-medium" onClick={() => void openDetail(row.orderNo)}>
          <Eye className="h-4 w-4" />
          {t("details")}</Button>
      ),
    },
  ];

  const detailSections: DetailSectionDef<RentalOrderDetailResponse>[] = [
    {
      title: t("orderInformation"),
      fields: [
        { label: t("orderNo"), render: (detail) => <CopyableSecret value={detail.orderNo} maskedValue={detail.orderNo} canReveal={false} /> },
        { label: t("userName"), render: (detail) => formatEmpty(detail.userName) },
        { label: t("orderStatus"), render: (detail) => <StatusBadge status={detail.orderStatus} /> },
        { label: t("paidAmount"), render: (detail) => <MoneyText value={detail.orderAmount} currency={detail.currency} /> },
      ],
    },
    {
      title: t("productInformation"),
      fields: [
        { label: t("productName"), render: (detail) => formatEmpty(detail.productNameSnapshot) },
        { label: t("productCode"), render: (detail) => formatEmpty(detail.productCodeSnapshot) },
        { label: t("gpuModel"), render: (detail) => formatEmpty(detail.gpuModelSnapshot) },
        { label: t("region"), render: (detail) => formatEmpty(detail.regionNameSnapshot) },
      ],
    },
    {
      title: t("earningsAndSettlement"),
      fields: [
        { label: t("estimatedDailyEarnings"), render: (detail) => <MoneyText value={detail.expectedDailyProfit} currency={detail.currency} /> },
        { label: t("estimatedTotalEarnings"), render: (detail) => <MoneyText value={detail.expectedTotalProfit} currency={detail.currency} /> },
        { label: t("earningsStatus"), render: (detail) => <StatusBadge status={detail.profitStatus} /> },
        { label: t("settlementStatus"), render: (detail) => <StatusBadge status={detail.settlementStatus} /> },
      ],
    },
    {
      title: t("apiInformation"),
      fields: [
        { label: t("credentialNo"), render: (detail) => <CopyableSecret value={detail.credentialNo} maskedValue={detail.credentialNo} canReveal={false} /> },
        { label: t("apiStatus"), render: (detail) => <StatusBadge status={detail.tokenStatus} /> },
        { label: t("deploymentStatus"), render: (detail) => <StatusBadge status={detail.deployOrderStatus} /> },
        { label: t("apiURL"), render: (detail) => formatEmpty(detail.apiBaseUrl) },
      ],
    },
    {
      title: t("timeInformation"),
      fields: [
        { label: t("createdAt"), render: (detail) => <DateTimeText value={detail.createdAt} /> },
        { label: t("paidAt"), render: (detail) => <DateTimeText value={detail.paidAt} /> },
        { label: t("activatedAt"), render: (detail) => <DateTimeText value={detail.activatedAt} /> },
        { label: t("expiresAt"), render: (detail) => <DateTimeText value={detail.expiredAt} /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="RENTAL OPS" title={t("rentalOrderManagement")} description={t("auditAllGpuComputeRentalOrdersAndTracePaymentEarningsSettlementAndApiDeploymentFlows")} />
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
          <Label>{t("orderStatus")}</Label>
          <Select value={filters.orderStatus} onValueChange={(val) => setFilters((current) => ({ ...current, orderStatus: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allStatuses")}</SelectItem>
              <SelectItem value={RentalOrderStatus.PENDING_PAY}>{t("awaitingPayment")}</SelectItem>
              <SelectItem value={RentalOrderStatus.RUNNING}>{t("running")}</SelectItem>
              <SelectItem value={RentalOrderStatus.PAUSED}>{t("paused")}</SelectItem>
              <SelectItem value={RentalOrderStatus.SETTLED}>{t("settled")}</SelectItem>
              <SelectItem value={RentalOrderStatus.CANCELED}>{t("cancelled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("earningsStatus")}</Label>
          <Select value={filters.profitStatus} onValueChange={(val) => setFilters((current) => ({ ...current, profitStatus: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allStatuses")}</SelectItem>
              <SelectItem value="PENDING">{t("pending")}</SelectItem>
              <SelectItem value={RentalOrderStatus.RUNNING}>{t("inProgress")}</SelectItem>
              <SelectItem value="SUCCESS">{t("succeeded")}</SelectItem>
              <SelectItem value="FAILED">{t("failed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("settlementStatus")}</Label>
          <Select value={filters.settlementStatus} onValueChange={(val) => setFilters((current) => ({ ...current, settlementStatus: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allStatuses")}</SelectItem>
              <SelectItem value="PENDING">{t("pendingSettlement")}</SelectItem>
              <SelectItem value={RentalOrderStatus.SETTLING}>{t("settling")}</SelectItem>
              <SelectItem value={RentalOrderStatus.SETTLED}>{t("settled")}</SelectItem>
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
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.orderNo} loading={loading} emptyText={t("noRentalOrdersYet")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title={t("rentalOrderDetails")} subtitle={(data) => data.orderNo} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
