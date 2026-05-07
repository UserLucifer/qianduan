"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { CalendarClock, CheckCircle2, Clock3, PauseCircle, Play, RotateCw, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { runScheduler, getAdminSchedulerLogs } from "@/api/admin";
import type { SchedulerRunResult, SchedulerLogResponse } from "@/api/types";
import { formatEmpty, formatNumber, toErrorMessage } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface SchedulerTask {
  key: string;
  titleKey: string;
  descriptionKey: string;
  icon: typeof Clock3;
}

const tasks: SchedulerTask[] = [
  { key: "activation-timeout-cancel", titleKey: "activationTimeoutCancel", descriptionKey: "cancelRentalOrdersWhoseActivationPaymentHasBeenPendingTooLong", icon: Clock3 },
  { key: "auto-pause", titleKey: "autoPause", descriptionKey: "processApiOrRentalTasksThatMeetAutoPauseConditions", icon: PauseCircle },
  { key: "commission-generate", titleKey: "commissionGeneration", descriptionKey: "generateLevelBasedCommissionRecordsFromEarningsRecords", icon: RotateCw },
  { key: "daily-profit", titleKey: "dailyEarnings", descriptionKey: "generateOrRefreshRentalEarningsRecordsByDay", icon: CalendarClock },
  { key: "expire-settlement", titleKey: "expirySettlement", descriptionKey: "runSettlementForExpiredRentalOrders", icon: CheckCircle2 },
];

export default function AdminSchedulerPage() {
  const t = useTranslations("AdminPages.scheduler");
  const [results, setResults] = useState<Record<string, SchedulerRunResult>>({});
  const [error, setError] = useState<string | null>(null);
  const [alertData, setAlertData] = useState<{ title: string; description: string } | null>(null);
  const [logTask, setLogTask] = useState<string | null>(null);
  
  // Trigger Dialog state
  const [triggerTask, setTriggerTask] = useState<SchedulerTask | null>(null);
  const [triggerParams, setTriggerParams] = useState<string>("{\n  \n}");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const execute = async () => {
    if (!triggerTask) return;
    setError(null);
    setIsSubmitting(true);
    let parsedParams = {};
    try {
      if (triggerParams.trim()) {
        parsedParams = JSON.parse(triggerParams);
      }
    } catch {
      setError(t("invalidParameterFormatEnterValidJSON"));
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await runScheduler(triggerTask.key, parsedParams);
      setResults((current) => ({ ...current, [triggerTask.key]: res.data }));
      setAlertData({
        title: t("executionCompleted"),
        description: t("executionSuccessDetail", { title: t(triggerTask.titleKey), total: res.data.totalCount || 0, success: res.data.successCount || 0, fail: res.data.failCount || 0 }),
      });
      setTriggerTask(null);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="SCHEDULER" title={t("schedulerTasks")} description={t("manuallyRunBuiltInPlatformSchedulerTasksWithOptionalRuntimeParameters")} />
      <ErrorAlert message={error} />
      
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => {
          const Icon = task.icon;
          const result = results[task.key];
          const taskTitle = t(task.titleKey);
          return (
            <Card key={task.key} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between gap-4 shrink-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-4 w-4 text-emerald-500" />
                    {taskTitle}
                  </CardTitle>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{t(task.descriptionKey)}</p>
                </div>
                <StatusBadge status={result?.status ?? "PENDING"} />
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-end">
                <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.025] p-3 text-center">
                  <Metric label={t("total")} value={result?.totalCount} />
                  <Metric label={t("succeeded")} value={result?.successCount} />
                  <Metric label={t("failed")} value={result?.failCount} />
                </div>
                {result?.errorMessage ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-xs text-rose-600 dark:text-rose-200">{result.errorMessage}</div> : null}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                    onClick={() => setLogTask(task.key)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {t("executionHistory")}</Button>
                  <Button 
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                    onClick={() => {
                      setTriggerTask(task);
                      setTriggerParams("{\n  \n}");
                      setError(null);
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {t("runWithParameters")}</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!triggerTask} onOpenChange={(open) => !open && setTriggerTask(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("runSchedulerTask")}{triggerTask ? t(triggerTask.titleKey) : ""}</DialogTitle>
            <DialogDescription>
              {t("thisWillManuallyTriggerTheSchedulerTaskYouMayPassSpecificParametersSupportedByTheBackendSuchAsDateOrStatus")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="params">{t("executionParametersJSON")}</Label>
              <Textarea
                id="params"
                value={triggerParams}
                onChange={(e) => setTriggerParams(e.target.value)}
                placeholder='{"date": "2024-01-01"}'
                className="min-h-[150px] font-mono"
              />
            </div>
            {error && (
              <div className="text-sm text-rose-500 mt-2 font-medium">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTriggerTask(null)} disabled={isSubmitting}>{t("cancel")}</Button>
            <Button onClick={execute} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {t("runTask")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!alertData} onOpenChange={(open: boolean) => !open && setAlertData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              {alertData?.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertData?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setAlertData(null)} 
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {t("gotIt")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {logTask && <SchedulerLogsDrawer taskKey={logTask} open={!!logTask} onClose={() => setLogTask(null)} />}
    </div>
  );
}

function Metric({ label, value }: { label: string; value?: number }) {
  return (
    <div>
      <div className="text-lg font-semibold tabular-nums text-foreground dark:text-zinc-50">{formatNumber(value ?? 0)}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function SchedulerLogsDrawer({ taskKey, open, onClose }: { taskKey: string | null; open: boolean; onClose: () => void }) {
  const t = useTranslations("AdminPages.scheduler");
  const loader = useCallback(
    async (params: { pageNo: number; pageSize: number; taskName?: string }) => {
      if (!taskKey) return { records: [], total: 0, pageNo: 1, pageSize: 10 };
      return (await getAdminSchedulerLogs({ ...params, taskName: taskKey })).data;
    },
    [taskKey]
  );

  const { page, loading, changePage } = usePaginatedResource(loader, { pageNo: 1, pageSize: 10, taskName: taskKey || undefined });

  const columns: DataTableColumn<SchedulerLogResponse>[] = [
    {
      key: "id",
      title: "ID",
      render: (row) => <span className="text-muted-foreground font-mono">{row.id}</span>,
    },
    {
      key: "status",
      title: t("status"),
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "startedAt",
      title: t("executedAt"),
      render: (row) => (
        <div className="space-y-1">
          <DateTimeText value={row.startedAt} />
          {row.finishedAt && (
            <div className="text-xs text-muted-foreground">
              {t("to")}<DateTimeText value={row.finishedAt} />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "counts",
      title: t("executionStatistics"),
      render: (row) => (
        <div className="flex gap-3 text-xs">
          <span className="text-slate-600 dark:text-zinc-300">{t("total2")}{row.totalCount}</span>
          <span className="text-emerald-600 dark:text-emerald-400">{t("succeeded2")}{row.successCount}</span>
          <span className="text-rose-600 dark:text-rose-400">{t("failed2")}{row.failCount}</span>
        </div>
      ),
    },
    {
      key: "errorMessage",
      title: t("detailedLogs"),
      render: (row) => (
        <div className="max-w-xs truncate text-xs font-mono text-rose-600 dark:text-rose-300" title={row.errorMessage}>
          {formatEmpty(row.errorMessage)}
        </div>
      ),
    },
  ];

  return (
    <Drawer open={open} onOpenChange={(val) => !val && onClose()}>
      <DrawerContent className="flex h-[90vh] flex-col">
        <DrawerHeader className="mx-auto w-full max-w-6xl flex-shrink-0 border-b border-border px-4 pb-4 sm:px-6">
          <DrawerTitle className="text-xl">{t("executionHistory2")}{taskKey}</DrawerTitle>
          <DrawerDescription>{t("historicalExecutionRecordsForThisSchedulerTask")}</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-auto p-4 sm:p-6 w-full max-w-6xl mx-auto">
          <DataTable
            columns={columns}
            data={page.records}
            rowKey={(row) => row.id.toString()}
            loading={loading}
            emptyText={t("noExecutionHistoryYet")}
            pageNo={page.pageNo}
            pageSize={page.pageSize}
            total={page.total}
            onPageChange={changePage}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
