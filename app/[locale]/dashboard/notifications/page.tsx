"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchPanel } from "@/components/shared/SearchPanel";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { getUserNotifications, markAllAsRead, markAsRead } from "@/api/notification";
import type { NotificationQueryRequest, PageResult, SysNotification } from "@/api/types";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { toErrorMessage } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { normalizeLocale } from "@/i18n/locales";

const initialParams: NotificationQueryRequest = { pageNo: 1, pageSize: 10 };

export default function NotificationsPage() {
  const t = useTranslations("DashboardNotifications");
  const locale = normalizeLocale(useLocale());
  const loader = useCallback(async (params: NotificationQueryRequest): Promise<PageResult<SysNotification>> => {
    const res = await getUserNotifications({ ...params, language: locale });
    return res.data;
  }, [locale]);
  const { page, loading, error, updateParams, changePage, reload } = usePaginatedResource(loader, initialParams);
  const [filters, setFilters] = useState<NotificationQueryRequest>(initialParams);
  const [actionError, setActionError] = useState<string | null>(null);

  const getNotificationTypeLabel = (type: string | null | undefined) => {
    if (!type) return "-";
    const key = `types.${type}`;
    return t.has(key) ? t(key) : type;
  };

  const readAll = async () => {
    setActionError(null);
    try {
      await markAllAsRead();
      await reload();
    } catch (err) {
      setActionError(toErrorMessage(err));
    }
  };

  const handleAccordionChange = async (value: string) => {
    if (!value) return;
    const id = Number(value);
    const notification = page.records.find((n) => n.id === id);
    if (notification && notification.readStatus === 0) {
      try {
        await markAsRead(id, { language: locale });
        await reload();
      } catch (err) {
        setActionError(toErrorMessage(err));
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("header.eyebrow")}
        title={t("header.title")}
        description={t("header.description")}
        actions={
          <Button onClick={() => void readAll()}>
            <CheckCheck className="h-4 w-4 mr-2" />
            {t("header.readAll")}</Button>
        }
      />
      
      <SearchPanel
        onSearch={() => updateParams({ ...filters, pageNo: 1 })}
        onReset={() => {
          setFilters(initialParams);
          updateParams(initialParams);
        }}
      >
        <div className="space-y-2">
          <Label>{t("filters.readStatus")}</Label>
          <Select value={filters.read_status?.toString()} onValueChange={(val) => setFilters((current) => ({ ...current, read_status: val === " " ? undefined : Number(val) }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder={t("filters.allStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("filters.allStatus")}</SelectItem>
              <SelectItem value="1">{t("filters.read")}</SelectItem>
              <SelectItem value="0">{t("filters.unread")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("filters.type")}</Label>
          <Select value={filters.notification_type} onValueChange={(val) => setFilters((current) => ({ ...current, notification_type: val === " " ? undefined : val }))}>
            <SelectTrigger className="h-9 w-[180px] bg-background text-foreground">
              <SelectValue placeholder={t("filters.allTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("filters.allTypes")}</SelectItem>
              <SelectItem value="SYSTEM">{t("filters.system")}</SelectItem>
              <SelectItem value="ORDER">{t("filters.order")}</SelectItem>
              <SelectItem value="WALLET">{t("filters.wallet")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SearchPanel>
      
      <ErrorAlert message={error ?? actionError} />

      <div className="space-y-4">
        {loading && page.records.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">{t("loading")}</div>
        ) : page.records.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">{t("empty")}</div>
        ) : (
          <Accordion type="single" collapsible onValueChange={handleAccordionChange} className="space-y-3">
            {page.records.map((row) => {
              const isUnread = row.readStatus === 0;
              return (
                <AccordionItem 
                  key={row.id} 
                  value={row.id.toString()} 
                  className={cn(
                    "border rounded-lg bg-card text-card-foreground shadow-sm px-4",
                    isUnread ? "border-l-4 border-l-blue-500" : ""
                  )}
                >
                  <AccordionTrigger className="hover:no-underline py-4 group">
                    <div className="flex flex-1 items-center justify-between gap-4 pr-4">
                      <div className="flex items-center gap-3">
                        {isUnread && <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                        <span className={cn(
                          "text-left transition-colors",
                          isUnread ? "font-semibold text-foreground" : "text-muted-foreground font-medium opacity-80"
                        )}>
                          {row.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 mr-2">
                        <span className={cn("text-xs", isUnread ? "opacity-100" : "opacity-70")}>
                          {getNotificationTypeLabel(row.type)}
                        </span>
                        <div className={cn("text-xs", isUnread ? "opacity-100" : "opacity-70")}>
                          <DateTimeText value={row.createdAt} />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-4">
                    <div className="rounded-md bg-muted/30 p-4 text-muted-foreground">
                      <div className="mb-3 text-xs opacity-70 font-mono">
                        {t("bizId")}{row.bizId || "-"}
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed text-sm text-foreground/90">
                        {row.content}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
      
      {page.total > 0 && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-4 text-xs text-muted-foreground shadow-sm">
          <span className="font-medium">
            {t("pagination.summary", { pageNo: page.pageNo, pageCount: Math.max(1, Math.ceil(page.total / page.pageSize)), total: page.total })}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 font-medium"
              disabled={page.pageNo <= 1}
              onClick={() => changePage(page.pageNo - 1)}
            >
              {t("pagination.previous")}</Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 font-medium"
              disabled={page.pageNo >= Math.ceil(page.total / page.pageSize)}
              onClick={() => changePage(page.pageNo + 1)}
            >
              {t("pagination.next")}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
