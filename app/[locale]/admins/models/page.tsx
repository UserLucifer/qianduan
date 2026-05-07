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
import { MoneyText } from "@/components/shared/MoneyText";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  disableAdminAiModel,
  enableAdminAiModel,
  getAdminAiModelTranslations,
  getAdminAiModels,
  updateAdminAiModelTranslation,
} from "@/api/admin";
import type { AdminCatalogQuery, AiModelResponse } from "@/api/types";
import { formatEmpty, formatNumber, toErrorMessage } from "@/lib/format";
import { AiModelForm } from "@/components/admin/CatalogForms";
import { AdminTranslationEditor } from "@/components/admin/AdminTranslationEditor";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface Filters {
  modelCode: string;
  status: string;
}

const initialFilters: Filters = { modelCode: "", status: "" };
const initialQuery: AdminCatalogQuery = { pageNo: 1, pageSize: 10 };

export default function AdminModelsPage() {
  const t = useTranslations("AdminPages.models");
  const tTranslations = useTranslations("AdminTranslations");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<AiModelResponse | null>(null);
  const [translationRow, setTranslationRow] = useState<AiModelResponse | null>(null);

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
    { key: "modelCode", title: t("modelCode"), render: (row) => formatEmpty(row.modelCode) },
    { key: "modelName", title: t("aIModel"), render: (row) => formatEmpty(row.modelName) },
    { key: "vendorName", title: t("vendor"), render: (row) => formatEmpty(row.vendorName) },
    { key: "monthlyTokenConsumptionTrillion", title: t("monthlyTokenUsage"), render: (row) => `${formatNumber(row.monthlyTokenConsumptionTrillion)} T` },
    { key: "tokenUnitPrice", title: t("tokenPrice"), render: (row) => <MoneyText value={row.tokenUnitPrice} /> },
    { key: "deployTechFee", title: t("deploymentServiceFee"), render: (row) => <MoneyText value={row.deployTechFee} /> },
    { key: "status", title: t("status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "updatedAt", title: t("updatedAt"), render: (row) => <DateTimeText value={row.updatedAt} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => openEdit(row)}>
            <Edit2 className="h-4 w-4" />
            {t("edit")}</Button>
          <Button variant="ghost" size="sm" className="font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => setTranslationRow(row)}>
            <Languages className="h-4 w-4" />
            {tTranslations("button")}
          </Button>
          {row.status === 0 ? (
            <ConfirmActionButton title={t("enableAIModel")} description={t("afterEnablingThisModelCanBeSelectedWhenPlacingRentalOrders")} onConfirm={() => toggle(row, true)}>
              <Power className="h-4 w-4" />
              {t("enable")}</ConfirmActionButton>
          ) : (
            <ConfirmActionButton title={t("disableAIModel")} description={t("afterDisablingNewOrdersCannotSelectThisModel")} onConfirm={() => toggle(row, false)}>
              <PowerOff className="h-4 w-4" />
              {t("disabled")}</ConfirmActionButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CATALOG OPS"
        title={t("aIModelManagement")}
        description={t("maintainDeployableAIModelsTokenCostsAndDeploymentServiceFees")}
        actions={
          <Button onClick={() => { setEditingRow(null); setFormOpen(true); }} className="bg-[#5e6ad2] font-semibold text-white hover:bg-[#7170ff]">
            <Plus className="mr-2 h-4 w-4" />
            {t("newModel")}</Button>
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
          <Label htmlFor="modelCode">{t("modelCode")}</Label>
          <Input id="modelCode" placeholder={t("enterCode")} value={filters.modelCode} onChange={(event) => setFilters((current) => ({ ...current, modelCode: event.target.value }))} className="h-9 w-[180px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>{t("enabledStatus")}</Label>
          <Select value={filters.status} onValueChange={(val) => setFilters((current) => ({ ...current, status: val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allStatuses")}</SelectItem>
              <SelectItem value="1">{t("enabled")}</SelectItem>
              <SelectItem value="0">{t("disabled2")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.modelCode} loading={loading} emptyText={t("noAISYet")} pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="flex max-w-xl flex-col items-stretch">
          <DialogTitle className="sr-only">{t("editAIModel")}</DialogTitle>
          <AiModelForm
            initialData={editingRow}
            onSuccess={() => { setFormOpen(false); reload(); }}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(translationRow)} onOpenChange={(open) => !open && setTranslationRow(null)}>
        <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col items-stretch overflow-y-auto">
          <DialogTitle className="sr-only">{tTranslations("aiModelTitle")}</DialogTitle>
          {translationRow ? (
            <AdminTranslationEditor
              title={tTranslations("aiModelTitle")}
              resourceKey={translationRow.modelCode}
              fields={[
                { key: "modelName", label: tTranslations("modelName") },
                { key: "vendorName", label: tTranslations("vendorName") },
              ]}
              load={() => getAdminAiModelTranslations(translationRow.modelCode)}
              save={(locale, values) => updateAdminAiModelTranslation(translationRow.modelCode, {
                locale,
                modelName: values.modelName,
                vendorName: values.vendorName,
              })}
              onSuccess={() => void reload()}
              onCancel={() => setTranslationRow(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
