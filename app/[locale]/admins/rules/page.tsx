"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Edit2, Languages, Power, PowerOff, Plus } from "lucide-react";
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
import {
  disableAdminCycleRule,
  enableAdminCycleRule,
  getAdminCycleRuleTranslations,
  getAdminCycleRules,
  updateAdminCycleRuleTranslation,
} from "@/api/admin";
import type { AdminCatalogQuery, RentalCycleRuleResponse } from "@/api/types";
import { formatEmpty, formatPercent, toErrorMessage } from "@/lib/format";
import { CycleRuleForm } from "@/components/admin/CatalogForms";
import { AdminTranslationEditor } from "@/components/admin/AdminTranslationEditor";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface Filters {
  cycleCode: string;
  status: string;
}

const initialFilters: Filters = { cycleCode: "", status: "" };
const initialQuery: AdminCatalogQuery = { pageNo: 1, pageSize: 10 };

export default function AdminRulesPage() {
  const tTranslations = useTranslations("AdminTranslations");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<RentalCycleRuleResponse | null>(null);
  const [translationRow, setTranslationRow] = useState<RentalCycleRuleResponse | null>(null);

  const loader = useCallback(async (params: AdminCatalogQuery) => (await getAdminCycleRules(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: Filters): AdminCatalogQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    cycle_code: nextFilters.cycleCode || undefined,
    status: nextFilters.status ? Number(nextFilters.status) : undefined,
  });

  const openEdit = (row: RentalCycleRuleResponse) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const toggle = async (row: RentalCycleRuleResponse, enabled: boolean) => {
    setActionError(null);
    try {
      if (enabled) {
        await enableAdminCycleRule(row.cycleCode);
      } else {
        await disableAdminCycleRule(row.cycleCode);
      }
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<RentalCycleRuleResponse>[] = [
    { key: "cycleCode", title: "周期编码", render: (row) => formatEmpty(row.cycleCode) },
    { key: "cycleName", title: "租赁周期", render: (row) => formatEmpty(row.cycleName) },
    { key: "cycleDays", title: "周期天数", render: (row) => `${row.cycleDays} 天` },
    { key: "yieldMultiplier", title: "收益倍率", render: (row) => formatPercent(row.yieldMultiplier) },
    { key: "earlyPenaltyRate", title: "提前结算违约率", render: (row) => formatPercent(row.earlyPenaltyRate) },
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
          <Button variant="ghost" size="sm" className="font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => setTranslationRow(row)}>
            <Languages className="h-4 w-4" />
            {tTranslations("button")}
          </Button>
          {row.status === 0 ? (
            <ConfirmActionButton title="启用租赁周期" description="启用后用户可选择该租赁周期。" onConfirm={() => toggle(row, true)}>
              <Power className="h-4 w-4" />
              启用
            </ConfirmActionButton>
          ) : (
            <ConfirmActionButton title="禁用租赁周期" description="禁用后新订单将不能选择该周期。" onConfirm={() => toggle(row, false)}>
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
        title="租赁周期规则"
        description="维护租赁周期、收益倍率和提前结算违约参数。"
        actions={
          <Button onClick={() => { setEditingRow(null); setFormOpen(true); }} className="bg-[#5e6ad2] font-semibold text-white hover:bg-[#7170ff]">
            <Plus className="mr-2 h-4 w-4" />
            新增规则
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
          <Label htmlFor="cycleCode">周期编码</Label>
          <Input id="cycleCode" placeholder="输入编码" value={filters.cycleCode} onChange={(event) => setFilters((current) => ({ ...current, cycleCode: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
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
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.cycleCode} loading={loading} emptyText="暂无租赁周期规则" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="flex max-w-xl flex-col items-stretch">
          <DialogTitle className="sr-only">编辑周期规则</DialogTitle>
          <CycleRuleForm
            initialData={editingRow}
            onSuccess={() => { setFormOpen(false); reload(); }}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(translationRow)} onOpenChange={(open) => !open && setTranslationRow(null)}>
        <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col items-stretch overflow-y-auto">
          <DialogTitle className="sr-only">{tTranslations("cycleRuleTitle")}</DialogTitle>
          {translationRow ? (
            <AdminTranslationEditor
              title={tTranslations("cycleRuleTitle")}
              resourceKey={translationRow.cycleCode}
              fields={[{ key: "cycleName", label: tTranslations("cycleName") }]}
              load={() => getAdminCycleRuleTranslations(translationRow.cycleCode)}
              save={(locale, values) => updateAdminCycleRuleTranslation(translationRow.cycleCode, { locale, cycleName: values.cycleName })}
              onSuccess={() => void reload()}
              onCancel={() => setTranslationRow(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
