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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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

  // Edit State
  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<AdminSysConfigResponse | null>(null);
  const [newValue, setNewValue] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const startEdit = (row: AdminSysConfigResponse) => {
    setEditingRow(row);
    setNewValue(row.configValue);
    setNewDesc(row.configDesc ?? "");
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingRow) return;
    setSubmitting(true);
    setActionError(null);
    try {
      await updateAdminSysConfig(editingRow.configKey, {
        configValue: newValue,
        configDesc: newDesc || undefined
      });
      setEditOpen(false);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const columns: DataTableColumn<AdminSysConfigResponse>[] = [
    { key: "configKey", title: "配置键", render: (row) => formatEmpty(row.configKey) },
    { key: "configValue", title: "配置值", render: (row) => <span className="line-clamp-1 max-w-[360px] text-muted-foreground">{formatEmpty(row.configValue)}</span> },
    { key: "configDesc", title: "说明", render: (row) => formatEmpty(row.configDesc) },
    { key: "updatedAt", title: "更新时间", render: (row) => <DateTimeText value={row.updatedAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-white/5" onClick={() => void openDetail(row.configKey)}>
            <Eye className="h-4 w-4" />
            详情
          </Button>
          <ConfirmActionButton title="修改系统配置" description="配置变更可能影响钱包、提现、收益或系统开关，请确认已核对值。" onConfirm={() => startEdit(row)}>
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
          { label: "配置值", value: <pre className="whitespace-pre-wrap break-all text-xs text-muted-foreground">{detail.configValue}</pre> },
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
      {(error || actionError) ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-destructive">{actionError ?? error}</div> : null}
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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl border-[var(--admin-border)] bg-[var(--admin-panel-strong)] text-[var(--admin-text)] flex flex-col items-stretch">
          <DialogTitle className="sr-only">修改系统配置</DialogTitle>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 w-full">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">配置键</Label>
              <Input value={editingRow?.configKey || ""} disabled className="h-9 bg-[var(--admin-panel-soft)] text-[var(--admin-muted)]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">配置值</Label>
              <Input
                value={newValue || ""}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="输入配置内容"
                className="h-9 bg-background text-[var(--admin-text)] focus-visible:ring-[#5e6ad2]"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-sm font-semibold">配置说明</Label>
              <Textarea
                value={newDesc || ""}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="输入用途或变更说明"
                className="min-h-[80px] bg-background text-[var(--admin-text)] focus-visible:ring-[#5e6ad2] text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-[var(--admin-border)] mt-4 justify-end gap-3">
            <Button variant="ghost" onClick={() => setEditOpen(false)} disabled={submitting}>取消</Button>
            <Button onClick={handleUpdate} disabled={submitting} className="bg-[#5e6ad2] text-white hover:bg-[#7170ff] shadow-lg shadow-indigo-500/20">
              {submitting ? "提交中..." : "确认修改"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
