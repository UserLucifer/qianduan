"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Languages, Power, PowerOff, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { deleteAdminRechargeChannel, getAdminRechargeChannels, updateAdminRechargeChannel } from "@/api/admin";
import type { AdminRechargeChannelQuery, AdminRechargeChannelResponse, UpdateRechargeChannelRequest } from "@/api/types";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import { RechargeChannelForm, RechargeChannelTranslationForm } from "@/components/admin/RechargeForms";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface Filters {
  status: string;
}

const initialFilters: Filters = { status: "" };
const initialQuery: AdminRechargeChannelQuery = { pageNo: 1, pageSize: 10 };

export default function RechargeChannelsPage() {
  const t = useTranslations("AdminPages.rechargeChannels");
  const tTranslations = useTranslations("AdminTranslations");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<AdminRechargeChannelResponse | null>(null);
  const [translationRow, setTranslationRow] = useState<AdminRechargeChannelResponse | null>(null);

  const loader = useCallback(async (params: AdminRechargeChannelQuery) => (await getAdminRechargeChannels(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: Filters): AdminRechargeChannelQuery => ({
    pageNo: 1,
    pageSize: page.pageSize,
    status: nextFilters.status ? Number(nextFilters.status) : undefined,
  });

  const openEdit = (row: AdminRechargeChannelResponse) => {
    setEditingRow(row);
    setFormOpen(true);
  };

  const toggleStatus = async (row: AdminRechargeChannelResponse, enabled: boolean) => {
    setActionError(null);
    try {
      const data: UpdateRechargeChannelRequest = {
        channelCode: row.channelCode,
        channelName: row.channelName,
        network: row.network,
        displayUrl: row.displayUrl,
        accountName: row.accountName,
        accountNo: row.accountNo,
        minAmount: row.minAmount,
        maxAmount: row.maxAmount,
        feeRate: row.feeRate,
        sortNo: row.sortNo,
        status: enabled ? 1 : 0,
      };
      await updateAdminRechargeChannel(row.channelId, data);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const handleDelete = async (row: AdminRechargeChannelResponse) => {
    setActionError(null);
    try {
      await deleteAdminRechargeChannel(row.channelId);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<AdminRechargeChannelResponse>[] = [
    { key: "channelCode", title: t("channelCode"), render: (row) => formatEmpty(row.channelCode) },
    { key: "channelName", title: t("channelName"), render: (row) => formatEmpty(row.channelName) },
    { key: "network", title: t("network"), render: (row) => formatEmpty(row.network) },
    { key: "accountNo", title: t("receivingAccountAddress"), render: (row) => <div className="max-w-[200px] truncate font-mono text-xs">{formatEmpty(row.accountNo)}</div> },
    { key: "feeRate", title: t("feeRate"), render: (row) => `${(row.feeRate * 100).toFixed(2)}%` },
    { key: "sortNo", title: t("sort"), render: (row) => row.sortNo },
    { key: "status", title: t("status"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "updatedAt", title: t("updatedAt"), render: (row) => <DateTimeText value={row.updatedAt} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => openEdit(row)}>
            <Edit2 className="h-3.5 w-3.5 mr-1" />
            {t("edit")}</Button>
          <Button variant="ghost" size="sm" className="font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => setTranslationRow(row)}>
            <Languages className="h-3.5 w-3.5 mr-1" />
            {tTranslations("button")}
          </Button>
          {row.status === 0 ? (
            <ConfirmActionButton title={t("enableChannel")} description={t("afterEnablingUsersCanSeeThisChannelOnTheTopUpPage")} onConfirm={() => toggleStatus(row, true)}>
              <Power className="h-3.5 w-3.5 mr-1" />
              {t("enable")}</ConfirmActionButton>
          ) : (
            <ConfirmActionButton title={t("disableChannel")} description={t("afterDisablingUsersCannotTopUpThroughThisChannel")} onConfirm={() => toggleStatus(row, false)}>
              <PowerOff className="h-3.5 w-3.5 mr-1" />
              {t("disabled")}</ConfirmActionButton>
          )}
          <ConfirmActionButton title={t("deleteChannel")} description={t("deleteThisTopUpChannelThisActionCannotBeUndone")} variant="destructive" onConfirm={() => handleDelete(row)}>
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            {t("delete")}</ConfirmActionButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="FINANCE OPS"
        title={t("topUpChannelManagement")}
        description={t("maintainSupportedPaymentChannelsAndReceivingAccountInformation")}
        actions={
          <Button onClick={() => { setEditingRow(null); setFormOpen(true); }} className="bg-[#5e6ad2] font-semibold text-white hover:bg-[#7170ff]">
            <Plus className="mr-2 h-4 w-4" />
            {t("newChannel")}</Button>
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
          <Label>{t("status")}</Label>
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

      <DataTable
        columns={columns}
        data={page.records}
        rowKey={(row) => row.channelId}
        loading={loading}
        emptyText={t("noSYet")}
        pageNo={page.pageNo}
        pageSize={page.pageSize}
        total={page.total}
        onPageChange={changePage}
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="flex max-w-2xl flex-col items-stretch">
          <DialogTitle className="text-xl font-semibold mb-2">
            {editingRow ? t("editTopUpChannel") : t("newTopUpChannel")}
          </DialogTitle>
          <RechargeChannelForm
            initialData={editingRow}
            onSuccess={() => { setFormOpen(false); reload(); }}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(translationRow)} onOpenChange={(open) => !open && setTranslationRow(null)}>
        <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col items-stretch overflow-y-auto">
          <DialogTitle className="sr-only">{tTranslations("rechargeChannelTitle")}</DialogTitle>
          {translationRow ? (
            <RechargeChannelTranslationForm
              channelId={translationRow.channelId}
              onSuccess={() => void reload()}
              onCancel={() => setTranslationRow(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
