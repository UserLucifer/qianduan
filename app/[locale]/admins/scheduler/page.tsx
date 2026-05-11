"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { CalendarClock, Check, CheckCircle2, Clock3, Copy, FileText, Info, PauseCircle, Play, RotateCw, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { getAdminSchedulerConfig, runScheduler, getAdminSchedulerLogs } from "@/api/admin";
import type { SchedulerConfigResponse, SchedulerLogResponse } from "@/api/types";
import { formatEmpty, formatNumber, toErrorMessage } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { DateTimeText } from "@/components/shared/DateTimeText";
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface SchedulerTask {
  runKey: string;
  logTaskName: string;
  titleKey: string;
  descriptionKey: string;
  configKey: keyof SchedulerConfigResponse;
  delayConfigKey?: keyof SchedulerConfigResponse;
  icon: typeof Clock3;
}

const tasks: SchedulerTask[] = [
  { runKey: "deploy-fee-timeout-cancel", logTaskName: "deploy_fee_timeout_cancel", titleKey: "activationTimeoutCancel", descriptionKey: "cancelRentalOrdersWhoseDeploymentFeeHasBeenPendingTooLong", configKey: "deployFeeTimeoutCancelCron", icon: Clock3 },
  { runKey: "auto-pause", logTaskName: "auto_pause", titleKey: "autoPause", descriptionKey: "autoPauseRunningAssetsAfterDeploymentFeePaidForTwentyFourHours", configKey: "autoPauseCron", delayConfigKey: "autoPauseDelay", icon: PauseCircle },
  { runKey: "daily-profit", logTaskName: "daily_profit", titleKey: "dailyEarnings", descriptionKey: "generateDailyEarningsForRunningAssets", configKey: "dailyProfitCron", icon: CalendarClock },
  { runKey: "expire-settlement", logTaskName: "expire_settlement", titleKey: "expirySettlement", descriptionKey: "settleExpiredRentalOrdersAutomatically", configKey: "orderExpireSettleCron", icon: CheckCircle2 },
  { runKey: "commission-generate", logTaskName: "commission_generate", titleKey: "commissionGeneration", descriptionKey: "generateUplineCommissionsFromSettledEarnings", configKey: "commissionGenerateCron", icon: RotateCw },
];

export default function AdminSchedulerPage() {
  const t = useTranslations("AdminPages.scheduler");
  const [latestLogs, setLatestLogs] = useState<Record<string, SchedulerLogResponse | null>>({});
  const [latestLoading, setLatestLoading] = useState(true);
  const [schedulerConfig, setSchedulerConfig] = useState<SchedulerConfigResponse | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertData, setAlertData] = useState<{ title: string; description: string } | null>(null);
  const [logTask, setLogTask] = useState<SchedulerTask | null>(null);
  const [triggerTask, setTriggerTask] = useState<SchedulerTask | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);

  const loadLatestLogs = useCallback(async () => {
    setLatestLoading(true);
    try {
      const entries = await Promise.all(
        tasks.map(async (task) => {
          const res = await getAdminSchedulerLogs({ taskName: task.logTaskName, pageNo: 1, pageSize: 1 });
          return [task.logTaskName, res.data.records[0] ?? null] as const;
        }),
      );
      setLatestLogs(Object.fromEntries(entries));
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLatestLoading(false);
    }
  }, []);

  const loadSchedulerConfig = useCallback(async () => {
    setConfigLoading(true);
    try {
      const res = await getAdminSchedulerConfig();
      setSchedulerConfig(res.data);
    } catch {
      setSchedulerConfig(null);
    } finally {
      setConfigLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLatestLogs();
  }, [loadLatestLogs, refreshVersion]);

  useEffect(() => {
    void loadSchedulerConfig();
  }, [loadSchedulerConfig]);

  const execute = async () => {
    if (!triggerTask) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await runScheduler(triggerTask.runKey);
      setAlertData({
        title: t("executionCompleted"),
        description: t("executionSuccessDetail", { title: t(triggerTask.titleKey), total: res.data.totalCount || 0, success: res.data.successCount || 0, fail: res.data.failCount || 0 }),
      });
      setTriggerTask(null);
      setRefreshVersion((current) => current + 1);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="SCHEDULER" title={t("automatedTaskMonitoring")} description={t("systemRunsTheseTasksAutomaticallyManualRunsAreOnlyForOperationalRecoveryOrTechnicalTroubleshooting")} />
      <ErrorAlert message={error} />
      <Alert className="border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-100">
        <Info className="h-4 w-4" />
        <AlertDescription>{t("theseTasksAreScheduledAutomaticallyMonitoringOnlyManualRunsReservedForOperationalRecovery")}</AlertDescription>
      </Alert>
      
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => {
          const Icon = task.icon;
          const latestLog = latestLogs[task.logTaskName] ?? null;
          const taskTitle = t(task.titleKey);
          return (
            <Card key={task.logTaskName} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between gap-4 shrink-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-4 w-4 text-emerald-500" />
                    {taskTitle}
                  </CardTitle>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{t(task.descriptionKey)}</p>
                </div>
                <StatusBadge status={latestLog?.status ?? "PENDING"} label={latestLoading ? t("loading") : latestLog ? undefined : t("noRecentExecution")} />
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-end">
                <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-xs">
                  <InfoRow label={t("automaticFrequency")} value={formatSchedulerFrequency(task, schedulerConfig, configLoading, t)} />
                  <InfoRow
                    label={t("latestExecutionTime")}
                    value={latestLog?.startedAt ? <DateTimeText value={latestLog.startedAt} /> : formatEmpty(undefined)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.025] p-3 text-center">
                  <Metric label={t("total")} value={latestLog?.totalCount} />
                  <Metric label={t("succeeded")} value={latestLog?.successCount} />
                  <Metric label={t("failed")} value={latestLog?.failCount} />
                </div>
                {latestLog?.errorMessage ? <CopyableErrorMessage value={latestLog.errorMessage} /> : null}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                    onClick={() => setLogTask(task)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {t("executionHistory")}</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={!!triggerTask} onOpenChange={(open: boolean) => !open && !isSubmitting && setTriggerTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("manualRecoveryRun")}</AlertDialogTitle>
            <AlertDialogDescription>
              {triggerTask ? `${t(triggerTask.titleKey)} - ` : ""}
              {t("manualRecoveryRunConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>{t("cancel")}</AlertDialogCancel>
            <Button onClick={execute} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {t("confirmRun")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      {logTask && (
        <SchedulerLogsDrawer
          key={`${logTask.logTaskName}-${refreshVersion}`}
          task={logTask}
          open={!!logTask}
          onClose={() => setLogTask(null)}
          onRunRecovery={(task) => {
            setError(null);
            setTriggerTask(task);
          }}
        />
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

function formatSchedulerFrequency(
  task: SchedulerTask,
  config: SchedulerConfigResponse | null,
  loading: boolean,
  t: ReturnType<typeof useTranslations<"AdminPages.scheduler">>,
) {
  if (loading) return t("loading");
  const cron = config?.[task.configKey];
  if (!cron) return t("currentConfig");
  const description = describeCronExpression(cron, t);
  const delay = task.delayConfigKey ? config?.[task.delayConfigKey] : null;

  return (
    <span className="block space-y-1">
      <span className="block">{description}</span>
      {delay ? (
        <span className="block text-xs font-normal text-muted-foreground">
          {t("pauseDelayHint", { delay: formatDelay(delay, t) })}
        </span>
      ) : null}
      <span className="block font-mono text-[11px] font-normal text-muted-foreground">
        {t("cronRaw", { cron })}
      </span>
    </span>
  );
}

function describeCronExpression(
  cron: string,
  t: ReturnType<typeof useTranslations<"AdminPages.scheduler">>,
) {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 6) return t("cronConfigured");

  const [, minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  const runsEveryDay = dayOfMonth === "*" && month === "*" && dayOfWeek === "*";

  if (hour === "*" && runsEveryDay) {
    if (minute === "*") return t("everyMinuteReadable");
    const minuteInterval = minute.match(/^\*\/(\d+)$/)?.[1];
    if (minuteInterval) return t("everyMinutesReadable", { minutes: Number(minuteInterval) });
  }

  if (/^\d+$/.test(hour) && /^\d+$/.test(minute) && runsEveryDay) {
    return t("dailyAtReadable", {
      time: `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`,
    });
  }

  return t("cronConfigured");
}

function formatDelay(
  value: string,
  t: ReturnType<typeof useTranslations<"AdminPages.scheduler">>,
) {
  const match = value.trim().match(/^(\d+)\s*([mhd])$/i);
  if (!match) return value;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === "m") return t("delayMinutes", { value: amount });
  if (unit === "h") return t("delayHours", { value: amount });
  return t("delayDays", { value: amount });
}

function Metric({ label, value }: { label: string; value?: number }) {
  return (
    <div>
      <div className="text-lg font-semibold tabular-nums text-foreground dark:text-zinc-50">{value == null ? formatEmpty(undefined) : formatNumber(value)}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function CopyableErrorMessage({ value }: { value: string }) {
  const t = useTranslations("AdminPages.scheduler");
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="flex items-start gap-2 rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-xs text-rose-600 dark:text-rose-200">
      <span className="min-w-0 flex-1 break-words font-mono">{value}</span>
      <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-rose-600 hover:text-rose-700 dark:text-rose-200 dark:hover:text-rose-100" onClick={copyValue} aria-label={t("copyErrorMessage")}>
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}

function SchedulerLogsDrawer({
  task,
  open,
  onClose,
  onRunRecovery,
}: {
  task: SchedulerTask;
  open: boolean;
  onClose: () => void;
  onRunRecovery: (task: SchedulerTask) => void;
}) {
  const t = useTranslations("AdminPages.scheduler");
  const loader = useCallback(
    async (params: { pageNo: number; pageSize: number; taskName?: string }) => {
      return (await getAdminSchedulerLogs({ ...params, taskName: task.logTaskName })).data;
    },
    [task.logTaskName]
  );

  const { page, loading, changePage } = usePaginatedResource(loader, { pageNo: 1, pageSize: 10, taskName: task.logTaskName });

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
        row.errorMessage ? (
          <CopyableErrorMessage value={row.errorMessage} />
        ) : (
          <span className="text-xs text-muted-foreground">{formatEmpty(row.errorMessage)}</span>
        )
      ),
    },
  ];

  return (
    <Drawer open={open} onOpenChange={(val) => !val && onClose()}>
      <DrawerContent className="flex h-[90vh] flex-col">
        <DrawerHeader className="mx-auto w-full max-w-6xl flex-shrink-0 border-b border-border px-4 pb-4 sm:px-6">
          <DrawerTitle className="text-xl">{t("executionHistory2")}{t(task.titleKey)}</DrawerTitle>
          <DrawerDescription>{t("historicalExecutionRecordsForThisSchedulerTask")}</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-auto p-4 sm:p-6 w-full max-w-6xl mx-auto space-y-4">
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
          <Accordion type="single" collapsible className="rounded-lg border border-border px-4">
            <AccordionItem value="advanced-actions" className="border-b-0">
              <AccordionTrigger className="hover:no-underline">
                <span className="inline-flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  {t("advancedActions")}
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground">
                <p>{t("recoveryRunHint")}</p>
                <Button variant="outline" size="sm" onClick={() => onRunRecovery(task)}>
                  <Play className="mr-2 h-4 w-4" />
                  {t("manualRecoveryRun")}
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
