"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { CircleDollarSign, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getCommissionRecords, getCommissionSummary } from "@/api/commission";
import type { CommissionRecordQueryRequest, CommissionRecordResponse, CommissionSummaryResponse, PageResult } from "@/api/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

const initialParams: CommissionRecordQueryRequest = { pageNo: 1, pageSize: 10 };

export default function CommissionsPage() {
  const t = useTranslations("DashboardCommissions");
  const summaryLoader = useCallback(async (): Promise<CommissionSummaryResponse> => {
    const res = await getCommissionSummary();
    return res.data;
  }, []);
  const loader = useCallback(async (params: CommissionRecordQueryRequest): Promise<PageResult<CommissionRecordResponse>> => {
    const res = await getCommissionRecords(params);
    return res.data;
  }, []);
  const summary = useAsyncResource(summaryLoader);
  const records = usePaginatedResource(loader, initialParams);
  const [filters, setFilters] = useState<CommissionRecordQueryRequest>(initialParams);

  const columns: DataTableColumn<CommissionRecordResponse>[] = [
    { key: "commissionNo", title: t("columns.commissionNo"), render: (row) => <span className="font-mono text-xs">{row.commissionNo}</span> },
    { key: "sourceUserId", title: t("columns.sourceUser"), render: (row) => t("columns.sourceUserValue", { id: row.sourceUserId }) },
    { key: "sourceOrderId", title: t("columns.order"), render: (row) => <span className="font-mono text-xs">{row.sourceOrderId}</span> },
    { key: "levelNo", title: t("columns.level"), render: (row) => t("columns.levelValue", { level: row.levelNo }) },
    { key: "commissionRateSnapshot", title: t("columns.rate"), render: (row) => `${(row.commissionRateSnapshot * 100).toFixed(2)}%` },
    { key: "commissionAmount", title: t("columns.amount"), render: (row) => <MoneyText value={row.commissionAmount} signed /> },
    { key: "status", title: t("columns.status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: t("columns.createdAt"), render: (row) => <DateTimeText value={row.createdAt} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <StatsCard title={t("stats.total")} value={<MoneyText value={summary.data?.totalCommission} />} description={t("stats.totalDesc")} icon={CircleDollarSign} loading={summary.loading} status="good" />
        <StatsCard title={t("stats.today")} value={<MoneyText value={summary.data?.todayCommission} />} description={t("stats.todayDesc")} icon={CircleDollarSign} loading={summary.loading} />
        <StatsCard title={t("stats.level1")} value={<MoneyText value={summary.data?.level1Commission} />} description={t("stats.level1Desc")} icon={Users} loading={summary.loading} />
        <StatsCard title={t("stats.level23")} value={<MoneyText value={(summary.data?.level2Commission ?? 0) + (summary.data?.level3Commission ?? 0)} />} description={t("stats.level23Desc")} icon={Users} loading={summary.loading} />
      </div>
      <SearchPanel
        onSearch={() => records.updateParams({ ...filters, pageNo: 1 })}
        onReset={() => {
          setFilters(initialParams);
          records.updateParams(initialParams);
        }}
      >
        <div className="space-y-2">
          <Label>{t("filters.level")}</Label>
          <Select value={filters.levelNo?.toString()} onValueChange={(val) => setFilters((current) => ({ ...current, levelNo: val === " " ? undefined : Number(val) }))}>
            <SelectTrigger className="h-9 w-[150px] bg-background text-foreground">
              <SelectValue placeholder={t("filters.allLevels")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("filters.allLevels")}</SelectItem>
              <SelectItem value="1">{t("filters.level1")}</SelectItem>
              <SelectItem value="2">{t("filters.level2")}</SelectItem>
              <SelectItem value="3">{t("filters.level3")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("filters.status")}</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val === " " ? undefined : val }))}>
            <SelectTrigger className="h-9 w-[150px] bg-background text-foreground">
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
        <div className="space-y-2">
          <Label>{t("filters.startDate")}</Label>
          <Input type="date" value={filters.startTime ?? ""} onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value || undefined }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>{t("filters.endDate")}</Label>
          <Input type="date" value={filters.endTime ?? ""} onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value || undefined }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
      </SearchPanel>
      <ErrorAlert message={records.error} />
      <DataTable columns={columns} data={records.page.records} rowKey={(row) => row.commissionNo} loading={records.loading} emptyText={t("empty")} pageNo={records.page.pageNo} pageSize={records.page.pageSize} total={records.page.total} onPageChange={records.changePage} />
    </div>
  );
}
