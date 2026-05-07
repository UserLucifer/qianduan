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
  startTime: string;
  endTime: string;
}

const initialFilters: LogFilters = { adminId: "", action: "", bizType: "", startTime: "", endTime: "" };
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

export default function AdminLogsPage() {
  const t = useTranslations("AdminPages.logs");
  const [filters, setFilters] = useState<LogFilters>(initialFilters);
  const [detail, setDetail] = useState<SysAdminLog | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: AdminLogQuery) => (await getAdminLogs(params)).data, []);
  const { page, loading, error, updateParams, changePage } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: LogFilters): AdminLogQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    admin_id: nextFilters.adminId ? Number(nextFilters.adminId) : undefined,
    action: nextFilters.action || undefined,
    biz_type: nextFilters.bizType || undefined,
    start_time: nextFilters.startTime || undefined,
    end_time: nextFilters.endTime || undefined,
  });

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
      <SearchPanel
        onSearch={() => updateParams(buildQuery(filters))}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="adminId">{t("adminID")}</Label>
          <Input id="adminId" placeholder={t("enterID")} value={filters.adminId} onChange={(event) => setFilters((current) => ({ ...current, adminId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="action">{t("action2")}</Label>
          <Select value={filters.action || "ALL"} onValueChange={(value) => setFilters((current) => ({ ...current, action: value === "ALL" ? "" : value }))}>
            <SelectTrigger id="action" className="h-9 w-[150px] bg-background text-foreground">
              <SelectValue placeholder={t("allActions")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allActions")}</SelectItem>
              {Object.entries(ACTION_MAP).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bizType">{t("businessType")}</Label>
          <Input id="bizType" placeholder={t("enterTableName")} value={filters.bizType} onChange={(event) => setFilters((current) => ({ ...current, bizType: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
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
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.id} loading={loading} emptyText={t("noSYet")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title={t("operationLogDetails")} subtitle={(data) => data ? `#${data.id}` : undefined} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
