"use client";

import { useCallback, useState } from "react";
import { Power, PowerOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { disableAdminGpuModel, enableAdminGpuModel, getAdminGpuModels } from "@/api/admin";
import type { AdminCatalogQuery, GpuModelResponse } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { GpuModelForm } from "@/components/admin/CatalogForms";
import { Edit2 } from "lucide-react";

interface Filters {
  status: string;
}

const initialFilters: Filters = { status: "" };
const initialQuery: AdminCatalogQuery = { pageNo: 1, pageSize: 10 };

export default function AdminGpuPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<GpuModelResponse | null>(null);

  const loader = useCallback(async (params: AdminCatalogQuery) => (await getAdminGpuModels(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const openEdit = (row: GpuModelResponse) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const toggle = async (row: GpuModelResponse, enabled: boolean) => {
    setActionError(null);
    try {
      if (enabled) {
        await enableAdminGpuModel(row.id);
      } else {
        await disableAdminGpuModel(row.id);
      }
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<GpuModelResponse>[] = [
    { key: "modelCode", title: "GPU 编码", render: (row) => formatEmpty(row.modelCode) },
    { key: "modelName", title: "GPU 型号", render: (row) => formatEmpty(row.modelName) },
    { key: "sortNo", title: "排序", render: (row) => formatEmpty(row.sortNo) },
    { key: "status", title: "状态", render: (row) => <StatusBadge status={row.status} /> },
    { key: "updatedAt", title: "更新时间", render: (row) => <DateTimeText value={row.updatedAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => openEdit(row)}>
            <Edit2 className="h-4 w-4" />
            编辑
          </Button>
          {row.status === 0 ? (
            <ConfirmActionButton title="启用 GPU 型号" description="启用后产品可关联该 GPU 型号。" onConfirm={() => toggle(row, true)}>
              <Power className="h-4 w-4" />
              启用
            </ConfirmActionButton>
          ) : (
            <ConfirmActionButton title="禁用 GPU 型号" description="禁用后新产品不应继续关联该型号。" onConfirm={() => toggle(row, false)}>
              <PowerOff className="h-4 w-4" />
              禁用
            </ConfirmActionButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CATALOG OPS"
        title="GPU 型号管理"
        description="维护 GPU 型号字典，用于算力产品规格展示和筛选。"
        actions={
          <Button onClick={() => { setEditingRow(null); setFormOpen(true); }} className="bg-[#5e6ad2] font-semibold text-white hover:bg-[#7170ff]">
            <Plus className="mr-2 h-4 w-4" />
            新增型号
          </Button>
        }
      />
      {(error || actionError) ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-500 font-medium">{actionError ?? error}</div> : null}
      <SearchPanel
        onSearch={() => updateParams({ pageNo: 1, pageSize: page.pageSize, status: filters.status ? Number(filters.status) : undefined })}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label>启用状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters({ status: val })}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value="1">已启用</SelectItem>
              <SelectItem value="0">已禁用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.id} loading={loading} emptyText="暂无 GPU 型号" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-xl border-[var(--admin-border)] bg-[var(--admin-panel-strong)] text-[var(--admin-text)] flex flex-col items-stretch">
          <DialogTitle className="sr-only">编辑 GPU 型号</DialogTitle>
          <GpuModelForm
            initialData={editingRow}
            onSuccess={() => { setFormOpen(false); reload(); }}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
