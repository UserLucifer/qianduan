"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getSettlementOrderDetail, getSettlementOrders } from "@/api/settlement";
import type { PageResult, SettlementOrderQueryRequest, SettlementOrderResponse } from "@/api/types";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

const initialParams: SettlementOrderQueryRequest = { pageNo: 1, pageSize: 10 };

export default function SettlementsPage() {
  const t = useTranslations("DashboardSettlements");
  const loader = useCallback(async (params: SettlementOrderQueryRequest): Promise<PageResult<SettlementOrderResponse>> => {
    const res = await getSettlementOrders(params);
    return res.data;
  }, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialParams);
  const [filters, setFilters] = useState<SettlementOrderQueryRequest>(initialParams);
  const [detail, setDetail] = useState<SettlementOrderResponse | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const getSettlementTypeLabel = (type: string | null | undefined) => {
    if (!type) return "-";
    const key = `settlementTypes.${type}`;
    return t.has(key) ? t(key) : type;
  };

  const openDetail = async (settlementNo: string) => {
    setActionError(null);
    try {
      const res = await getSettlementOrderDetail(settlementNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<SettlementOrderResponse>[] = [
    { key: "settlementNo", title: t("columns.settlementNo"), render: (row) => <span className="font-mono text-xs">{row.settlementNo}</span> },
    { key: "settlementType", title: t("columns.type"), render: (row) => getSettlementTypeLabel(row.settlementType) },
    { key: "orderNo", title: t("columns.orderNo"), render: (row) => <span className="font-mono text-xs">{row.orderNo}</span> },
    { key: "actualSettleAmount", title: t("columns.amount"), render: (row) => <MoneyText value={row.actualSettleAmount} signed /> },
    { key: "status", title: t("columns.status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: t("columns.time"), render: (row) => <DateTimeText value={row.createdAt} /> },
    { key: "actions", title: t("columns.actions"), className: "text-right", render: (row) => <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted" onClick={() => void openDetail(row.settlementNo)}><Eye className="h-3.5 w-3.5" />{t("actionDetail")}</Button> },
  ];

  const sections: DetailSectionDef<SettlementOrderResponse>[] = [
    {
      title: t("detail.title"),
      fields: [
        { label: t("detail.settlementNo"), render: (detail) => <span className="font-mono">{detail.settlementNo}</span> },
        { label: t("detail.orderNo"), render: (detail) => <span className="font-mono">{detail.orderNo}</span> },
        { label: t("detail.type"), render: (detail) => getSettlementTypeLabel(detail.settlementType) },
        { label: t("detail.status"), render: (detail) => <StatusBadge status={detail.status} /> },
        { label: t("detail.principal"), render: (detail) => <MoneyText value={detail.principalAmount} /> },
        { label: t("detail.profit"), render: (detail) => <MoneyText value={detail.profitAmount} signed /> },
        { label: t("detail.penalty"), render: (detail) => <MoneyText value={detail.penaltyAmount} /> },
        { label: t("detail.actual"), render: (detail) => <MoneyText value={detail.actualSettleAmount} signed /> },
        { label: t("detail.walletTx"), render: (detail) => detail.walletTxNo || "-" },
        { label: t("detail.remark"), render: (detail) => detail.remark || "-" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />
      <SearchPanel
        onSearch={() => updateParams({ ...filters, pageNo: 1 })}
        onReset={() => {
          setFilters(initialParams);
          updateParams(initialParams);
        }}
      >
        <div className="space-y-2">
          <Label>{t("filters.type")}</Label>
          <Select value={filters.settlementType} onValueChange={(val) => setFilters((current) => ({ ...current, settlementType: val === " " ? undefined : val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder={t("filters.allTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("filters.allTypes")}</SelectItem>
              <SelectItem value="EXPIRE">{t("filters.expire")}</SelectItem>
              <SelectItem value="EARLY">{t("filters.early")}</SelectItem>
              <SelectItem value="MANUAL">{t("filters.manual")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("filters.status")}</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val === " " ? undefined : val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder={t("filters.allStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("filters.allStatus")}</SelectItem>
              <SelectItem value="PENDING">{t("filters.pending")}</SelectItem>
              <SelectItem value="SETTLED">{t("filters.settled")}</SelectItem>
              <SelectItem value="CANCELLED">{t("filters.canceled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>
      <ErrorAlert message={error ?? actionError} />
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.settlementNo} loading={loading} emptyText={t("empty")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={Boolean(detail)} title={t("drawerTitle")} subtitle={(data) => data.settlementNo} sections={sections} onClose={() => setDetail(null)} />
    </div>
  );
}
