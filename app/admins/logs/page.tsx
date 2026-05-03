"use client";

import { useCallback, useState } from "react";
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
  CREATE: "创建",
  UPDATE: "更新",
  DELETE: "删除",
  ENABLE: "启用",
  DISABLE: "禁用",
  APPROVE: "审核通过",
  REJECT: "审核驳回",
  LOGIN: "登录",
  LOGOUT: "登出",
  PUBLISH: "发布",
  UNPUBLISH: "撤回",
  RUN: "执行",
  CANCEL: "取消",
};

const BIZ_TYPE_MAP: Record<string, string> = {
  sys_admin: "系统管理员",
  users: "用户",
  rental_orders: "租赁订单",
  user_wallets: "用户钱包",
  wallet_transactions: "钱包流水",
  recharge_orders: "充值订单",
  withdraw_orders: "提现订单",
  products: "算力产品",
  regions: "地区管理",
  gpu_models: "GPU型号",
  ai_models: "AI模型",
  rental_cycle_rules: "周期规则",
  sys_configs: "系统配置",
  notifications: "通知公告",
  blog_categories: "博文分类",
  blog_tags: "博文标签",
  blog_posts: "博文文章",
  api_credentials: "API凭证",
  api_deploy_orders: "部署订单",
  commission_records: "佣金记录",
  profit_records: "收益记录",
  settlement_orders: "结算订单",
};

const translateAction = (action: string) => ACTION_MAP[action?.toUpperCase()] || action;
const translateBizType = (type: string) => BIZ_TYPE_MAP[type?.toLowerCase()] || type;

export default function AdminLogsPage() {
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
    { key: "id", title: "日志 ID", render: (row) => formatEmpty(row.id) },
    { key: "operatorName", title: "操作人", render: (row) => formatEmpty(row.operatorName || row.adminId) },
    { key: "action", title: "动作", render: (row) => row.actionName || translateAction(row.action) },
    { key: "targetTable", title: "业务类型", render: (row) => translateBizType(row.targetTable) },
    { key: "targetId", title: "目标 ID", render: (row) => formatEmpty(row.targetId) },
    { key: "ip", title: "IP", render: (row) => formatEmpty(row.ip) },
    { key: "createdAt", title: "时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDetail(row.id)}>
          <Eye className="h-4 w-4" />
          详情
        </Button>
      ),
    },
  ];

  const detailSections: DetailSectionDef<SysAdminLog>[] = [
        {
          title: "日志信息",
          fields: [
            { label: "日志 ID", render: (detail) => detail.id },
            { label: "操作人", render: (detail) => formatEmpty(detail.operatorName || detail.adminId) },
            { label: "动作", render: (detail) => detail.actionName || translateAction(detail.action) },
            { label: "IP", render: (detail) => detail.ip },
          ],
        },
        {
          title: "业务对象",
          fields: [
            { label: "业务类型", render: (detail) => translateBizType(detail.targetTable) },
            { label: "目标 ID", render: (detail) => detail.targetId },
            { label: "备注", render: (detail) => formatEmpty(detail.remark) },
            { label: "时间", render: (detail) => <DateTimeText value={detail.createdAt} /> },
          ],
        },
        {
          title: "变更内容",
          fields: [
            { label: "变更前", render: (detail) => <pre className="whitespace-pre-wrap break-all text-xs text-muted-foreground">{formatEmpty(detail.beforeValue)}</pre> },
            { label: "变更后", render: (detail) => <pre className="whitespace-pre-wrap break-all text-xs text-muted-foreground">{formatEmpty(detail.afterValue)}</pre> },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="AUDIT LOG" title="管理员操作日志" description="审计管理端关键操作、目标对象和变更内容。" />
      {(error || actionError) ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
          {actionError ?? error}
        </div>
      ) : null}
      <SearchPanel
        onSearch={() => updateParams(buildQuery(filters))}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="adminId">管理员 ID</Label>
          <Input id="adminId" placeholder="输入 ID" value={filters.adminId} onChange={(event) => setFilters((current) => ({ ...current, adminId: event.target.value }))} className="h-9 w-[120px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="action">操作动作</Label>
          <Select value={filters.action || "ALL"} onValueChange={(value) => setFilters((current) => ({ ...current, action: value === "ALL" ? "" : value }))}>
            <SelectTrigger id="action" className="h-9 w-[150px] bg-background text-foreground">
              <SelectValue placeholder="全部动作" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部动作</SelectItem>
              {Object.entries(ACTION_MAP).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bizType">业务类型</Label>
          <Input id="bizType" placeholder="输入表名" value={filters.bizType} onChange={(event) => setFilters((current) => ({ ...current, bizType: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>开始日期</Label>
          <Input type="date" value={filters.startTime} onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>结束日期</Label>
          <Input type="date" value={filters.endTime} onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
      </SearchPanel>
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.id} loading={loading} emptyText="暂无操作日志" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer data={detail} open={detailOpen} title="操作日志详情" subtitle={(data) => data ? `#${data.id}` : undefined} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
