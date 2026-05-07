"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Languages, Megaphone, Plus, XCircle } from "lucide-react";
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
import { cancelAdminNotification, getAdminNotifications } from "@/api/admin";
import type { NotificationQueryRequest, SysNotification } from "@/api/types";
import { notificationTypeLabel } from "@/lib/status";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { NotificationForm, NotificationTranslationForm } from "@/components/admin/NotificationForms";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface Filters {
  readStatus: string;
  notificationType: string;
  bizType: string;
  startTime: string;
  endTime: string;
}

const initialFilters: Filters = { readStatus: "", notificationType: "", bizType: "", startTime: "", endTime: "" };
const initialQuery: NotificationQueryRequest = { pageNo: 1, pageSize: 10 };

export default function AdminNotificationsPage() {
  const t = useTranslations("AdminPages.notifications");
  const tTranslations = useTranslations("AdminTranslations");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [translationRow, setTranslationRow] = useState<SysNotification | null>(null);

  const loader = useCallback(async (params: NotificationQueryRequest) => (await getAdminNotifications(params)).data, []);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialQuery);

  const buildQuery = (nextFilters: Filters): NotificationQueryRequest => ({
    pageNo: 1,
    pageSize: page.pageSize,
    read_status: nextFilters.readStatus ? Number(nextFilters.readStatus) : undefined,
    notification_type: nextFilters.notificationType || undefined,
    biz_type: nextFilters.bizType || undefined,
    start_time: nextFilters.startTime || undefined,
    end_time: nextFilters.endTime || undefined,
  });

  const cancelNotice = async (id: number) => {
    try {
      await cancelAdminNotification(id);
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const columns: DataTableColumn<SysNotification>[] = [
    { key: "id", title: "ID", render: (row) => <span className="font-mono text-xs text-muted-foreground">{formatEmpty(row.id)}</span> },
    { key: "userId", title: t("userID"), render: (row) => <span className="font-medium">{formatEmpty(row.userId)}</span> },
    { key: "title", title: t("title"), render: (row) => <span className="line-clamp-1 max-w-[260px] font-medium text-foreground">{row.title}</span> },
    { key: "type", title: t("type"), render: (row) => <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs">{notificationTypeLabel(row.type)}</span> },
    { key: "bizType", title: t("business"), render: (row) => <span className="text-muted-foreground">{formatEmpty(row.bizType)}</span> },
    { key: "readStatus", title: t("status"), render: (row) => <StatusBadge status={row.readStatus === 1 ? t("read") : t("unread")} label={row.readStatus === 1 ? t("read") : t("unread")} /> },
    { key: "status", title: t("publish"), render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: t("time"), render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="font-medium text-blue-500 hover:bg-blue-500/10" onClick={() => setTranslationRow(row)}>
            <Languages className="mr-1 h-3.5 w-3.5" />
            {tTranslations("button")}
          </Button>
          <ConfirmActionButton title={t("cancelNotification")} description={t("afterCancellationThisNotificationWillNoLongerRemainActive")} onConfirm={() => cancelNotice(row.id)}>
            <XCircle className="h-4 w-4" />
            {t("cancel")}</ConfirmActionButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="NOTIFICATION OPS"
        title={t("notificationManagement")}
        description={t("createUserSpecificOrBroadcastNotificationsAndFilterThemByTypeBusinessContextAndReadStatus")}
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => { setIsBroadcast(false); setFormOpen(true); }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("personalNotification")}</Button>
            <Button 
              onClick={() => { setIsBroadcast(true); setFormOpen(true); }}
            >
              <Megaphone className="mr-2 h-4 w-4" />
              {t("broadcastNotification")}</Button>
          </div>
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
          <Label>{t("readStatus")}</Label>
          <Select value={filters.readStatus} onValueChange={(val) => setFilters((current) => ({ ...current, readStatus: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allStatuses")}</SelectItem>
              <SelectItem value="1">{t("read")}</SelectItem>
              <SelectItem value="0">{t("unread")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("notificationType")}</Label>
          <Select value={filters.notificationType} onValueChange={(val) => setFilters((current) => ({ ...current, notificationType: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder={t("allTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("allTypes")}</SelectItem>
              <SelectItem value="SYSTEM">{t("systemNotification")}</SelectItem>
              <SelectItem value="ORDER">{t("orderNotification")}</SelectItem>
              <SelectItem value="WALLET">{t("fundsNotification")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bizType">{t("businessType")}</Label>
          <Input id="bizType" placeholder={t("enterType")} value={filters.bizType} onChange={(event) => setFilters((current) => ({ ...current, bizType: event.target.value }))} className="h-9 w-[130px] bg-background text-foreground" />
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="flex max-w-xl flex-col items-stretch">
          <DialogTitle className="sr-only">
            {isBroadcast ? t("publishBroadcastNotification") : t("sendPersonalNotification")}
          </DialogTitle>
          <NotificationForm
            isBroadcast={isBroadcast}
            onSuccess={() => { setFormOpen(false); reload(); }}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(translationRow)} onOpenChange={(open) => !open && setTranslationRow(null)}>
        <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col items-stretch overflow-y-auto">
          <DialogTitle className="sr-only">{tTranslations("notificationTitle")}</DialogTitle>
          {translationRow ? (
            <NotificationTranslationForm
              notificationId={translationRow.id}
              onSuccess={() => void reload()}
              onCancel={() => setTranslationRow(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
