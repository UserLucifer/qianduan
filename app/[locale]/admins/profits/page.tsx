"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, Search } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MoneyText } from "@/components/shared/MoneyText";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { CopyableSecret } from "@/components/shared/CopyableSecret";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAdminProfitRecordDetail, getAdminProfitRecords } from "@/api/admin";
import type { AdminProfitRecordQuery, ProfitRecordResponse } from "@/api/types";
import { formatDate, formatEmpty, toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface ProfitFilters {
  keyword: string;
  orderNo: string;
  status: string;
  dateRange: string;
}

const ALL_STATUS = "ALL";
const ALL_TIME = "ALL";
const initialFilters: ProfitFilters = { keyword: "", orderNo: "", status: ALL_STATUS, dateRange: ALL_TIME };
const initialQuery: AdminProfitRecordQuery = { pageNo: 1, pageSize: 10 };

function formatStartOfDay(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} 00:00:00`;
}

export default function AdminProfitsPage() {
  const t = useTranslations("AdminPages.profits");
  const [chartReady, setChartReady] = useState(false);
  const [filters, setFilters] = useState<ProfitFilters>(initialFilters);
  const [detail, setDetail] = useState<ProfitRecordResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const queryTimer = useRef<number | null>(null);

  const loader = useCallback(async (params: AdminProfitRecordQuery) => (await getAdminProfitRecords(params)).data, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQuery);

  const buildQuery = useCallback((nextFilters: ProfitFilters): AdminProfitRecordQuery => {
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
      order_no: nextFilters.orderNo.trim() || undefined,
      status: nextFilters.status === ALL_STATUS ? undefined : nextFilters.status || undefined,
      start_time: startTime,
    };
  }, [page.pageSize]);

  const applyFilters = useCallback((nextFilters: ProfitFilters, delay = 0) => {
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

  const trendData = useMemo(() => {
    const bucket = new Map<string, number>();
    page.records.forEach((record) => {
      const key = formatDate(record.profitDate);
      bucket.set(key, (bucket.get(key) ?? 0) + record.finalProfitAmount);
    });
  // The backend has no admin earnings trend endpoint yet, so this aggregates the current page by earnings date.
    return Array.from(bucket.entries()).map(([date, amount]) => ({ date, amount }));
  }, [page.records]);

  const openDetail = async (profitNo: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminProfitRecordDetail(profitNo);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<ProfitRecordResponse>[] = [
    { key: "profitNo", title: t("earningsNo"), render: (row) => <CopyableSecret value={row.profitNo} maskedValue={row.profitNo} canReveal={false} /> },
    { key: "orderNo", title: t("rentalOrder"), render: (row) => <CopyableSecret value={row.orderNo} maskedValue={row.orderNo} canReveal={false} /> },
    { key: "productNameSnapshot", title: t("computeProduct"), render: (row) => formatEmpty(row.productNameSnapshot) },
    { key: "aiModelNameSnapshot", title: t("aIModel"), render: (row) => formatEmpty(row.aiModelNameSnapshot) },
    { key: "profitDate", title: t("earningsDate"), render: (row) => formatDate(row.profitDate) },
    { key: "finalProfitAmount", title: t("finalEarnings"), render: (row) => <MoneyText value={row.finalProfitAmount} /> },
    { key: "status", title: t("status"), render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDetail(row.profitNo)}>
          <Eye className="h-4 w-4" />
          {t("details")}</Button>
      ),
    },
  ];

  const detailSections: DetailSectionDef<ProfitRecordResponse>[] = [
        {
          title: t("earningsInformation"),
          fields: [
            { label: t("earningsNo"), render: (detail) => <CopyableSecret value={detail.profitNo} maskedValue={detail.profitNo} canReveal={false} /> },
            { label: t("orderNo"), render: (detail) => <CopyableSecret value={detail.orderNo} maskedValue={detail.orderNo} canReveal={false} /> },
            { label: t("status"), render: (detail) => <StatusBadge status={detail.status} /> },
            { label: t("earningsDate"), render: (detail) => formatDate(detail.profitDate) },
          ],
        },
        {
          title: t("calculationSnapshot"),
          fields: [
            { label: t("baseEarnings"), render: (detail) => <MoneyText value={detail.baseProfitAmount} /> },
            { label: t("finalEarnings"), render: (detail) => <MoneyText value={detail.finalProfitAmount} /> },
            { label: t("tokenPrice"), render: (detail) => formatEmpty(detail.tokenPriceSnapshot) },
            { label: t("earningsMultiplier"), render: (detail) => formatEmpty(detail.yieldMultiplierSnapshot) },
          ],
        },
        {
          title: t("linkedInformation"),
          fields: [
            { label: t("product"), render: (detail) => detail.productNameSnapshot },
            { label: t("aIModel"), render: (detail) => detail.aiModelNameSnapshot },
            { label: t("walletTransaction"), render: (detail) => <CopyableSecret value={detail.walletTxNo} maskedValue={detail.walletTxNo ?? "-"} canReveal={false} /> },
            { label: t("settledAt"), render: (detail) => <DateTimeText value={detail.settledAt} /> },
          ],
        },
  ];

  useEffect(() => {
    setChartReady(true);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("headerEyebrow")} title={t("earningsRecordManagement")} description={t("reviewUserRentalEarningsEarningStatusAndLinkedSettlementTransactions")} />
      <ErrorAlert message={actionError ?? error} />
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{t("earningsDistribution")}</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {chartReady ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={trendData}>
                <XAxis dataKey="date" stroke="hsl(var(--ui-muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--ui-muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--ui-popover))", border: "1px solid hsl(var(--ui-border))", borderRadius: 8 }} />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--ui-primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : null}
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={filters.status}
          onValueChange={(value) => {
            const nextFilters = { ...filters, status: value };
            setFilters(nextFilters);
            applyFilters(nextFilters);
          }}
          className="w-full lg:w-auto overflow-x-auto"
        >
          <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border/50">
            <TabsTrigger value={ALL_STATUS} className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("allStatuses")}
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("pending")}
            </TabsTrigger>
            <TabsTrigger value="SETTLING" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("settling")}
            </TabsTrigger>
            <TabsTrigger value="SETTLED" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("settled")}
            </TabsTrigger>
            <TabsTrigger value="FAILED" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("invalid")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-[220px]">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("searchEmailOrUsername")}
              value={filters.keyword}
              onChange={(event) => {
                const nextFilters = { ...filters, keyword: event.target.value };
                setFilters(nextFilters);
                applyFilters(nextFilters, 300);
              }}
              className="h-10 pl-9 border-border bg-card text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="relative w-full sm:w-[180px]">
            <Input
              placeholder={t("enterOrderNumber")}
              value={filters.orderNo}
              onChange={(event) => {
                const nextFilters = { ...filters, orderNo: event.target.value };
                setFilters(nextFilters);
                applyFilters(nextFilters, 300);
              }}
              className="h-10 border-border bg-card text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <Select
            value={filters.dateRange}
            onValueChange={(value) => {
              const nextFilters = { ...filters, dateRange: value };
              setFilters(nextFilters);
              applyFilters(nextFilters);
            }}
          >
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
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.profitNo} loading={loading} emptyText={t("noEarningsRecordsYet")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title={t("earningsRecordDetails")} subtitle={(data) => data.profitNo} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
