"use client";

import { useCallback, useState } from "react";
import { Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer, type DetailSection } from "@/components/shared/DetailDrawer";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { getAdminSysConfigDetail, getAdminSysConfigs, updateAdminSysConfig } from "@/api/admin";
import type { AdminSysConfigQueryRequest, AdminSysConfigResponse } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";

interface Filters {
  configKey: string;
}

const initialFilters: Filters = { configKey: "" };
const initialQuery: AdminSysConfigQueryRequest = { pageNo: 1, pageSize: 10 };

export default function AdminConfigPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [detail, setDetail] = useState<AdminSysConfigResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loader = useCallback(async (params: AdminSysConfigQueryRequest) => (await getAdminSysConfigs(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const openDetail = async (configKey: string) => {
    setActionError(null);
    setDetailOpen(true);
    try {
      const res = await getAdminSysConfigDetail(configKey);
      setDetail(res.data);
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const updateConfig = async (row: AdminSysConfigResponse) => {
    const configValue = window.prompt("请输入新的配置值", row.configValue);
    if (configValue === null) return;
    const configDesc = window.prompt("配置说明（可选）", row.configDesc ?? "") ?? undefined;
    try {
      await updateAdminSysConfig(row.configKey, { configValue, configDesc });
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<AdminSysConfigResponse>[] = [
    { key: "configKey", title: "配置键", render: (row) => formatEmpty(row.configKey) },
    { key: "configValue", title: "配置值", render: (row) => <span className="line-clamp-1 max-w-[360px] text-zinc-300">{formatEmpty(row.configValue)}</span> },
    { key: "configDesc", title: "说明", render: (row) => formatEmpty(row.configDesc) },
    { key: "updatedAt", title: "更新时间", render: (row) => <DateTimeText value={row.updatedAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-zinc-300 hover:bg-white/5" onClick={() => void openDetail(row.configKey)}>
            <Eye className="h-4 w-4" />
            详情
          </Button>
          <ConfirmActionButton title="修改系统配置" description="配置变更可能影响钱包、提现、收益或系统开关，请确认已核对值。" onConfirm={() => updateConfig(row)}>
            <Save className="h-4 w-4" />
            修改
          </ConfirmActionButton>
        </div>
      ),
    },
  ];

  const detailSections: DetailSection[] = detail
    ? [
        {
          title: "配置详情",
          fields: [
            { label: "配置键", value: detail.configKey },
            { label: "配置值", value: <pre className="whitespace-pre-wrap break-all text-xs text-zinc-300">{detail.configValue}</pre> },
            { label: "说明", value: formatEmpty(detail.configDesc) },
            { label: "创建时间", value: <DateTimeText value={detail.createdAt} /> },
            { label: "更新时间", value: <DateTimeText value={detail.updatedAt} /> },
          ],
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="SYSTEM CONFIG" title="系统配置" description="按配置键查看和修改钱包、提现、收益、佣金与系统开关配置。" />
      {(error || actionError) ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{actionError ?? error}</div> : null}
      <SearchPanel
        onSearch={() => updateParams({ pageNo: 1, pageSize: page.pageSize, configKey: filters.configKey || undefined })}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="configKey">配置键</Label>
          <Input id="configKey" placeholder="输入键名" value={filters.configKey} onChange={(event) => setFilters({ configKey: event.target.value })} className="h-9 w-[240px] bg-background text-foreground" />
        </div>
      </SearchPanel>
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.configKey} loading={loading} emptyText="暂无系统配置" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />
      <DetailDrawer open={detailOpen} title="系统配置详情" subtitle={detail?.configKey} sections={detailSections} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
