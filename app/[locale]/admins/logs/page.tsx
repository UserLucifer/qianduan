"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSectionDef } from "@/components/shared/DetailDrawer";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAdminLogDetail, getAdminLogs } from "@/api/admin";
import type { AdminLogQuery, SysAdminLog } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface LogFilters {
  adminId: string;
  action: string;
  bizType: string;
  dateRange: string;
}

const initialFilters: LogFilters = { adminId: "", action: "ALL", bizType: "ALL", dateRange: "ALL" };
const initialQuery: AdminLogQuery = { pageNo: 1, pageSize: 10 };

const ACTION_MAP: Record<string, string> = {
  CREATE: "actionCreate",
  UPDATE: "actionUpdate",
  DELETE: "actionDelete",
  ENABLE: "actionEnable",
  DISABLE: "actionDisable",
  APPROVE: "actionApprove",
  REJECT: "actionReject",
  LOGIN: "actionLogin",
  LOGOUT: "actionLogout",
  PUBLISH: "actionPublish",
  UNPUBLISH: "actionUnpublish",
  RUN: "actionRun",
  CANCEL: "actionCancel",
};

const BIZ_TYPE_MAP: Record<string, string> = {
  sys_admin: "bizSystemAdmin",
  users: "bizUsers",
  rental_orders: "bizRentalOrders",
  user_wallets: "bizUserWallets",
  wallet_transactions: "bizWalletTransactions",
  recharge_orders: "bizTopUpOrders",
  withdraw_orders: "bizWithdrawalOrders",
  products: "bizComputeProducts",
  regions: "bizRegions",
  gpu_models: "bizGpuModels",
  ai_models: "bizAiModels",
  rental_cycle_rules: "bizRentalCycleRules",
  sys_configs: "bizSystemConfigs",
  notifications: "bizNotifications",
  blog_categories: "bizBlogCategories",
  blog_tags: "bizBlogTags",
  blog_posts: "bizBlogPosts",
  api_credentials: "bizApiCredentials",
  api_deploy_orders: "bizApiDeployOrders",
  commission_records: "bizCommissionRecords",
  profit_records: "bizEarningsRecords",
  settlement_orders: "bizSettlementOrders",
};

const translateAction = (action: string, t: (key: string) => string) => {
  const key = ACTION_MAP[action?.toUpperCase()];
  return key ? t(key) : action;
};
const translateBizType = (type: string, t: (key: string) => string) => {
  const key = BIZ_TYPE_MAP[type?.toLowerCase()];
  return key ? t(key) : type;
};
const getStartTimeByDateRange = (dateRange: string) => {
  if (dateRange === "ALL") return undefined;

  const days = Number(dateRange);
  if (!Number.isFinite(days)) return undefined;

  const d = new Date();
  d.setDate(d.getDate() - days);
  return `${d.toISOString().split("T")[0]} 00:00:00`;
};

export default function AdminLogsPage() {
  const t = useTranslations("AdminPages.logs");
  const [filters, setFilters] = useState<LogFilters>(initialFilters);
  const [detail, setDetail] = useState<SysAdminLog | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const filtersInitialized = useRef(false);

  const loader = useCallback(async (params: AdminLogQuery) => (await getAdminLogs(params)).data, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: LogFilters): AdminLogQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    admin_id: nextFilters.adminId ? Number(nextFilters.adminId) : undefined,
    action: nextFilters.action === "ALL" ? undefined : nextFilters.action,
    biz_type: nextFilters.bizType === "ALL" ? undefined : nextFilters.bizType,
    start_time: getStartTimeByDateRange(nextFilters.dateRange),
  });

  useEffect(() => {
    if (!filtersInitialized.current) {
      filtersInitialized.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      updateParams(buildQuery(filters));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [filters, page.pageSize]);

  const openDetail = async (id: number) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminLogDetail(id);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<SysAdminLog>[] = [
    { key: "id", title: t("logID"), render: (row) => formatEmpty(row.id) },
    { key: "operatorName", title: t("operator"), render: (row) => formatEmpty(row.operatorName || row.adminId) },
    { key: "action", title: t("action"), render: (row) => row.actionName || translateAction(row.action, t) },
    { key: "targetTable", title: t("businessType"), render: (row) => translateBizType(row.targetTable, t) },
    { key: "targetId", title: t("targetID"), render: (row) => formatEmpty(row.targetId) },
    { key: "ip", title: "IP", render: (row) => formatEmpty(row.ip) },
    { key: "createdAt", title: t("time"), render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDetail(row.id)}>
          <Eye className="h-4 w-4" />
          {t("details")}</Button>
      ),
    },
  ];

  const detailSections: DetailSectionDef<SysAdminLog>[] = [
        {
          title: t("logInformation"),
          fields: [
            { label: t("logID"), render: (detail) => detail.id },
            { label: t("operator"), render: (detail) => formatEmpty(detail.operatorName || detail.adminId) },
            { label: t("action"), render: (detail) => detail.actionName || translateAction(detail.action, t) },
            { label: "IP", render: (detail) => detail.ip },
          ],
        },
        {
          title: t("businessObject"),
          fields: [
            { label: t("businessType"), render: (detail) => translateBizType(detail.targetTable, t) },
            { label: t("targetID"), render: (detail) => detail.targetId },
            { label: t("notes"), render: (detail) => formatEmpty(detail.remark) },
            { label: t("time"), render: (detail) => <DateTimeText value={detail.createdAt} /> },
          ],
        },
        {
          title: t("changes"),
          fields: [
            { label: t("before"), render: (detail) => <pre className="whitespace-pre-wrap break-all text-xs text-muted-foreground">{formatEmpty(detail.beforeValue)}</pre> },
            { label: t("after"), render: (detail) => <pre className="whitespace-pre-wrap break-all text-xs text-muted-foreground">{formatEmpty(detail.afterValue)}</pre> },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="AUDIT LOG" title={t("adminOperationLogs")} description={t("auditKeyAdminOperationsTargetObjectsAndChangeDetails")} />
      <ErrorAlert message={actionError ?? error} />
      <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full sm:w-[180px]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="adminId"
            placeholder={t("searchAdminId")}
            value={filters.adminId}
            onChange={(event) => setFilters((current) => ({ ...current, adminId: event.target.value }))}
            className="h-10 pl-9 border-border bg-card text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={filters.action} onValueChange={(value) => setFilters((current) => ({ ...current, action: value }))}>
            <SelectTrigger className="h-10 w-[150px] bg-card border-border text-xs font-medium">
              <SelectValue placeholder={t("allActions")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allActions")}</SelectItem>
              {Object.entries(ACTION_MAP).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {t(label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.bizType} onValueChange={(value) => setFilters((current) => ({ ...current, bizType: value }))}>
            <SelectTrigger className="h-10 w-[170px] bg-card border-border text-xs font-medium">
              <SelectValue placeholder={t("allBusinessTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allBusinessTypes")}</SelectItem>
              {Object.entries(BIZ_TYPE_MAP).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {t(label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.dateRange} onValueChange={(value) => setFilters((current) => ({ ...current, dateRange: value }))}>
            <SelectTrigger className="h-10 w-[120px] bg-card border-border text-xs font-medium">
              <SelectValue placeholder={t("allTime")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allTime")}</SelectItem>
              <SelectItem value="3">{t("last3Days")}</SelectItem>
              <SelectItem value="7">{t("last7Days")}</SelectItem>
              <SelectItem value="30">{t("last30Days")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.id} loading={loading} emptyText={t("noSYet")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title={t("operationLogDetails")} subtitle={(data) => data ? `#${data.id}` : undefined} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
