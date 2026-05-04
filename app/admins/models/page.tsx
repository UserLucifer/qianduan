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
import { MoneyText } from "@/components/shared/MoneyText";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { disableAdminAiModel, enableAdminAiModel, getAdminAiModels } from "@/api/admin";
import type { AdminCatalogQuery, AiModelResponse } from "@/api/types";
import { formatEmpty, formatNumber, toErrorMessage } from "@/lib/format";
import { AiModelForm } from "@/components/admin/CatalogForms";
import { Edit2 } from "lucide-react";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface Filters {
  modelCode: string;
  status: string;
}

const initialFilters: Filters = { modelCode: "", status: "" };
const initialQuery: AdminCatalogQuery = { pageNo: 1, pageSize: 10 };

export default function AdminModelsPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<AiModelResponse | null>(null);

  const loader = useCallback(async (params: AdminCatalogQuery) => (await getAdminAiModels(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: Filters): AdminCatalogQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    model_code: nextFilters.modelCode || undefined,
    status: nextFilters.status ? Number(nextFilters.status) : undefined,
  });

  const openEdit = (row: AiModelResponse) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const toggle = async (row: AiModelResponse, enabled: boolean) => {
    setActionError(null);
    try {
      if (enabled) {
        await enableAdminAiModel(row.modelCode);
      } else {
        await disableAdminAiModel(row.modelCode);
      }
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<AiModelResponse>[] = [
    { key: "modelCode", title: "模型编码", render: (row) => formatEmpty(row.modelCode) },
    { key: "modelName", title: "AI 模型", render: (row) => formatEmpty(row.modelName) },
    { key: "vendorName", title: "厂商", render: (row) => formatEmpty(row.vendorName) },
    { key: "monthlyTokenConsumptionTrillion", title: "月 Token 消耗", render: (row) => `${formatNumber(row.monthlyTokenConsumptionTrillion)} T` },
    { key: "tokenUnitPrice", title: "Token 单价", render: (row) => <MoneyText value={row.tokenUnitPrice} /> },
    { key: "deployTechFee", title: "部署技术费", render: (row) => <MoneyText value={row.deployTechFee} /> },
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
            <ConfirmActionButton title="启用 AI 模型" description="启用后租赁下单可选择该模型。" onConfirm={() => toggle(row, true)}>
              <Power className="h-4 w-4" />
              启用
            </ConfirmActionButton>
          ) : (
            <ConfirmActionButton title="禁用 AI 模型" description="禁用后新订单将不能选择该模型。" onConfirm={() => toggle(row, false)}>
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
        title="AI 模型管理"
        description="维护可部署的 AI 模型、Token 成本和部署技术费。"
        actions={
          <Button onClick={() => { setEditingRow(null); setFormOpen(true); }} className="bg-[#5e6ad2] font-semibold text-white hover:bg-[#7170ff]">
            <Plus className="mr-2 h-4 w-4" />
            新增模型
          </Button>
        }
      />
      <ErrorAlert message={actionError ?? error} />
      <SearchPanel
        onSearch={() => updateParams(buildQuery(filters))}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="modelCode">模型编码</Label>
          <Input id="modelCode" placeholder="输入编码" value={filters.modelCode} onChange={(event) => setFilters((current) => ({ ...current, modelCode: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>启用状态</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
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
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.modelCode} loading={loading} emptyText="暂无 AI 模型" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="flex max-w-xl flex-col items-stretch">
          <DialogTitle className="sr-only">编辑 AI 模型</DialogTitle>
          <AiModelForm
            initialData={editingRow}
            onSuccess={() => { setFormOpen(false); reload(); }}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
