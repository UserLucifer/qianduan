"use client";

import { useCallback, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { 
  CircleDollarSign, 
  Users, 
  Award, 
  ShieldCheck, 
  Loader2, 
  FileText,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { MoneyText } from "@/components/shared/MoneyText";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getCommissionRecords, getCommissionSummary } from "@/api/commission";
import type { CommissionRecordQueryRequest, CommissionRecordResponse, CommissionSummaryResponse, PageResult } from "@/api/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { cn } from "@/lib/utils";

const initialParams: CommissionRecordQueryRequest = { pageNo: 1, pageSize: 12 };

export default function CommissionsPage() {
  const t = useTranslations("DashboardCommissions");
  const dt = useTranslations("DataTable");

  const summaryLoader = useCallback(async (): Promise<CommissionSummaryResponse> => {
    const res = await getCommissionSummary();
    return res.data;
  }, []);

  const loader = useCallback(async (params: CommissionRecordQueryRequest): Promise<PageResult<CommissionRecordResponse>> => {
    const res = await getCommissionRecords(params);
    return res.data;
  }, []);


  const summary = useAsyncResource(summaryLoader);
  const records = usePaginatedResource(loader, initialParams);
  
  const [activeTab, setActiveTab] = useState("ALL");
  const [dateRange, setDateRange] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (records.error) toast.error(records.error);
    if (summary.error) toast.error(summary.error);
  }, [records.error, summary.error]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    triggerSearch(val, dateRange, statusFilter, keyword);
  };

  const handleDateRangeChange = (val: string) => {
    setDateRange(val);
    triggerSearch(activeTab, val, statusFilter, keyword);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    triggerSearch(activeTab, dateRange, val, keyword);
  };

  const handleSearch = () => {
    triggerSearch(activeTab, dateRange, statusFilter, keyword);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const triggerSearch = (tab: string, dateOption: string, statusOpt: string, searchKey: string) => {
    const levelNo = tab === "ALL" ? undefined : Number(tab);
    const status = statusOpt === "ALL" ? undefined : statusOpt;
    const username = searchKey.trim() || undefined;
    
    let startTime: string | undefined = undefined;
    if (dateOption === "3D") {
      const d = new Date();
      d.setDate(d.getDate() - 3);
      startTime = d.toISOString().split("T")[0] + " 00:00:00";
    } else if (dateOption === "7D") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      startTime = d.toISOString().split("T")[0] + " 00:00:00";
    } else if (dateOption === "30D") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      startTime = d.toISOString().split("T")[0] + " 00:00:00";
    }

    records.updateParams({ 
      ...records.page, 
      pageNo: 1, 
      levelNo,
      status,
      startTime,
      username,
      endTime: undefined
    });
  };


  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1: return <Award className="h-4 w-4" />;
      case 2: return <ShieldCheck className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "text-amber-500 group-hover:bg-amber-500/10";
      case 2: return "text-slate-400 group-hover:bg-slate-500/10";
      default: return "text-muted-foreground group-hover:bg-primary/10";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} description={t("header.description")} />
      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <StatsCard title={t("stats.total")} value={<MoneyText value={summary.data?.totalCommission} />} description={t("stats.totalDesc")} icon={CircleDollarSign} loading={summary.loading} status="good" />
        <StatsCard title={t("stats.today")} value={<MoneyText value={summary.data?.todayCommission} />} description={t("stats.todayDesc")} icon={CircleDollarSign} loading={summary.loading} />
        <StatsCard title={t("stats.level1")} value={<MoneyText value={summary.data?.level1Commission} />} description={t("stats.level1Desc")} icon={Users} loading={summary.loading} />
        <StatsCard title={t("stats.level2")} value={<MoneyText value={summary.data?.level2Commission} />} description={t("stats.level2Desc")} icon={Users} loading={summary.loading} />
      </div>

      <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full lg:w-auto overflow-x-auto">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border/50">
            <TabsTrigger value="ALL" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("filters.allLevels")}
            </TabsTrigger>
            <TabsTrigger value="1" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("filters.level1")}
            </TabsTrigger>
            <TabsTrigger value="2" className="rounded-md px-4 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap">
              {t("filters.level2")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-[180px]">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("filters.searchUsername")}
              className="h-10 pl-9 border-border bg-card text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="h-10 w-[120px] bg-card border-border text-xs font-medium">
              <SelectValue placeholder={t("filters.allTime")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("filters.allTime")}</SelectItem>
              <SelectItem value="3D">{t("filters.last3Days")}</SelectItem>
              <SelectItem value="7D">{t("filters.last7Days")}</SelectItem>
              <SelectItem value="30D">{t("filters.last30Days")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-10 w-[120px] bg-card border-border text-xs font-medium">
              <SelectValue placeholder={t("filters.allStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("filters.allStatus")}</SelectItem>
              <SelectItem value="PENDING">{t("filters.pending")}</SelectItem>
              <SelectItem value="SETTLED">{t("filters.settled")}</SelectItem>
              <SelectItem value="CANCELLED">{t("filters.canceled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="min-h-[400px]">
        {records.loading && records.page.records.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{dt("loading")}</span>
          </div>
        ) : records.page.records.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/30">
            <FileText className="h-10 w-10 text-muted-foreground/40" />
            <span className="text-sm font-medium text-muted-foreground">{t("empty")}</span>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {records.page.records.map((row) => (
              <div
                key={row.commissionNo}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/20 hover:bg-muted/30 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 transition-colors",
                      getLevelColor(row.levelNo)
                    )}>
                      {getLevelIcon(row.levelNo)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">
                        {t("columns.levelValue", { level: row.levelNo })}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        #{row.commissionNo.slice(-8)}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={row.status} />
                </div>

                <div className="space-y-3 border-t border-border/50 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t("columns.sourceUser")}</span>
                    <span className="font-mono text-xs font-medium">{t("columns.sourceUserValue", { id: row.sourceUserId })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t("columns.order")}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{row.sourceOrderId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t("columns.rate")}</span>
                    <span className="text-xs font-semibold text-primary">
                      {(row.commissionRateSnapshot * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">{t("columns.amount")}</span>
                    <MoneyText value={row.commissionAmount} signed className="text-sm font-black text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t("columns.createdAt")}</span>
                    <div className="text-[10px] text-muted-foreground">
                      <DateTimeText value={row.createdAt} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {records.page.total > records.page.pageSize && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-border pt-6 gap-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {dt("pageSummary", {
              pageNo: records.page.pageNo,
              pageCount: Math.ceil(records.page.total / records.page.pageSize),
              total: records.page.total
            })}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={records.page.pageNo <= 1}
              onClick={() => records.changePage(records.page.pageNo - 1)}
            >
              {dt("previousPage")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={records.page.pageNo >= Math.ceil(records.page.total / records.page.pageSize)}
              onClick={() => records.changePage(records.page.pageNo + 1)}
            >
              {dt("nextPage")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
