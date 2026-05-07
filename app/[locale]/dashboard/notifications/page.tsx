"use client";

import { useCallback, useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { 
  CheckCheck, 
  Bell, 
  Cpu, 
  Package, 
  Wallet, 
  Megaphone, 
  AlertTriangle, 
  TrendingUp,
  Inbox,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
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
import { toast } from "sonner";
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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SYSTEM": return <Cpu className="h-4 w-4" />;
      case "ANNOUNCEMENT": return <Megaphone className="h-4 w-4" />;
      case "ALERT": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "ORDER": return <Package className="h-4 w-4" />;
      case "FINANCE": return <CreditCardIcon className="h-4 w-4" />;
      case "PROFIT": return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case "WALLET": return <Wallet className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const CreditCardIcon = ({ className }: { className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );

  const readAll = async () => {
    try {
      await markAllAsRead();
      await reload();
    } catch (err) {
      toast.error(toErrorMessage(err));
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
        toast.error(toErrorMessage(err));
      }
    }
  };

  const handleStatusTabChange = (val: string) => {
    const status = val === "ALL" ? undefined : Number(val);
    const newParams = { ...filters, read_status: status, pageNo: 1 };
    setFilters(newParams);
    updateParams(newParams);
  };

  const handleTypeChange = (val: string) => {
    const type = val === "ALL" ? undefined : val;
    const newParams = { ...filters, notification_type: type, pageNo: 1 };
    setFilters(newParams);
    updateParams(newParams);
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        eyebrow={t("header.eyebrow")}
        title={t("header.title")}
        description={t("header.description")}
        actions={
          <Button size="sm" onClick={() => void readAll()} className="h-9">
            <CheckCheck className="h-4 w-4 mr-2" />
            {t("header.readAll")}
          </Button>
        }
      />
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
        <Tabs 
          value={filters.read_status === undefined ? "ALL" : filters.read_status.toString()} 
          onValueChange={handleStatusTabChange} 
          className="w-full md:w-auto"
        >
          <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border/50">
            <TabsTrigger value="ALL" className="rounded-md px-4 py-1 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              {t("filters.allStatus")}
            </TabsTrigger>
            <TabsTrigger value="0" className="rounded-md px-4 py-1 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              {t("filters.unread")}
            </TabsTrigger>
            <TabsTrigger value="1" className="rounded-md px-4 py-1 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              {t("filters.read")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select value={filters.notification_type || "ALL"} onValueChange={handleTypeChange}>
            <SelectTrigger className="h-9 w-[160px] bg-card border-border text-xs font-medium">
              <SelectValue placeholder={t("filters.allTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("filters.allTypes")}</SelectItem>
              <SelectItem value="SYSTEM">{t("filters.system")}</SelectItem>
              <SelectItem value="ORDER">{t("filters.order")}</SelectItem>
              <SelectItem value="WALLET">{t("filters.wallet")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="min-h-[400px]">
        {loading && page.records.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{t("loading")}</span>
          </div>
        ) : page.records.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/30">
            <Inbox className="h-10 w-10 text-muted-foreground/40" />
            <span className="text-sm font-medium text-muted-foreground">{t("empty")}</span>
          </div>
        ) : (
          <Accordion type="single" collapsible onValueChange={handleAccordionChange} className="space-y-3">
            {page.records.map((row) => {
              const isUnread = row.readStatus === 0;
              return (
                <AccordionItem 
                  key={row.id} 
                  value={row.id.toString()} 
                  className={cn(
                    "group border rounded-xl bg-card text-card-foreground shadow-sm transition-all hover:bg-muted/30 overflow-hidden",
                    isUnread ? "border-primary/20 bg-primary/5" : "border-border"
                  )}
                >
                  <AccordionTrigger className="hover:no-underline py-4 px-5 group-data-[state=open]:bg-muted/30">
                    <div className="flex flex-1 items-center justify-between gap-4 pr-4">
                      <div className="flex items-center gap-4 text-left">
                        <div className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isUnread ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border text-muted-foreground"
                        )}>
                          {getNotificationIcon(row.type)}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {isUnread && <div className="h-2 w-2 rounded-full bg-primary" />}
                            <span className={cn(
                              "text-sm tracking-tight transition-colors",
                              isUnread ? "font-bold text-foreground" : "text-muted-foreground font-medium"
                            )}>
                              {row.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            <span>{t(`types.${row.type}`)}</span>
                            <span>•</span>
                            <DateTimeText value={row.createdAt} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 border-t border-border/50">
                    <div className="p-5 space-y-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed text-sm text-foreground/90 bg-muted/40 p-4 rounded-lg border border-border/50">
                          {row.content}
                        </p>
                      </div>
                      {row.bizId && (
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono bg-muted/20 w-fit px-2 py-1 rounded">
                          <span className="opacity-60">{t("bizId")}</span>
                          <span className="font-bold">{row.bizId}</span>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
      
      {page.total > page.pageSize && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-border pt-6 gap-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t("pagination.summary", { 
              pageNo: page.pageNo, 
              pageCount: Math.ceil(page.total / page.pageSize), 
              total: page.total 
            })}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page.pageNo <= 1}
              onClick={() => changePage(page.pageNo - 1)}
            >
              {t("pagination.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page.pageNo >= Math.ceil(page.total / page.pageSize)}
              onClick={() => changePage(page.pageNo + 1)}
            >
              {t("pagination.next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
