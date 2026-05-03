"use client";

import { useState, useCallback } from "react";
import { CalendarClock, CheckCircle2, Clock3, PauseCircle, Play, RotateCw, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { runScheduler, getAdminSchedulerLogs } from "@/api/admin";
import type { SchedulerRunResult, SchedulerLogResponse } from "@/api/types";
import { formatEmpty, formatNumber, toErrorMessage } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import { DateTimeText } from "@/components/shared/DateTimeText";

interface SchedulerTask {
  key: string;
  title: string;
  description: string;
  icon: typeof Clock3;
}

const tasks: SchedulerTask[] = [
  { key: "activation-timeout-cancel", title: "激活超时取消", description: "取消长时间未完成激活支付的租赁订单。", icon: Clock3 },
  { key: "auto-pause", title: "自动暂停", description: "处理达到自动暂停条件的 API 或租赁任务。", icon: PauseCircle },
  { key: "commission-generate", title: "佣金生成", description: "根据收益记录生成对应层级的佣金记录。", icon: RotateCw },
  { key: "daily-profit", title: "每日收益", description: "按日生成或刷新租赁收益记录。", icon: CalendarClock },
  { key: "expire-settlement", title: "过期结算", description: "对已到期租赁订单执行结算流程。", icon: CheckCircle2 },
];

export default function AdminSchedulerPage() {
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
    } catch (e) {
      setError("参数格式不正确，必须为有效 JSON");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await runScheduler(triggerTask.key, parsedParams);
      setResults((current) => ({ ...current, [triggerTask.key]: res.data }));
      setAlertData({
        title: "执行成功",
        description: `调度任务 [${triggerTask.title}] 执行完成。总数: ${res.data.totalCount || 0}, 成功: ${res.data.successCount || 0}, 失败: ${res.data.failCount || 0}`,
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
      <PageHeader eyebrow="SCHEDULER" title="调度任务" description="手动执行平台内置调度任务，允许动态传入特定参数执行。" />
      {error && !triggerTask ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-600 dark:text-rose-200">{error}</div> : null}
      
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => {
          const Icon = task.icon;
          const result = results[task.key];
          return (
            <Card key={task.key} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between gap-4 shrink-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-4 w-4 text-emerald-500" />
                    {task.title}
                  </CardTitle>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{task.description}</p>
                </div>
                <StatusBadge status={result?.status ?? "PENDING"} />
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-end">
                <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.025] p-3 text-center">
                  <Metric label="总数" value={result?.totalCount} />
                  <Metric label="成功" value={result?.successCount} />
                  <Metric label="失败" value={result?.failCount} />
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
                    执行历史
                  </Button>
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
                    传参执行
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!triggerTask} onOpenChange={(open) => !open && setTriggerTask(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>执行调度任务: {triggerTask?.title}</DialogTitle>
            <DialogDescription>
              此操作会手动触发调度任务执行，可根据后端支持传入特定参数（如特定日期、特定状态等）。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="params">执行参数 (JSON)</Label>
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
            <Button variant="outline" onClick={() => setTriggerTask(null)} disabled={isSubmitting}>取消</Button>
            <Button onClick={execute} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              确认执行
            </Button>
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
              知道了
            </AlertDialogAction>
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
      title: "状态",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "startedAt",
      title: "执行时间",
      render: (row) => (
        <div className="space-y-1">
          <DateTimeText value={row.startedAt} />
          {row.finishedAt && (
            <div className="text-xs text-muted-foreground">
              至 <DateTimeText value={row.finishedAt} />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "counts",
      title: "执行统计",
      render: (row) => (
        <div className="flex gap-3 text-xs">
          <span className="text-slate-600 dark:text-zinc-300">总计: {row.totalCount}</span>
          <span className="text-emerald-600 dark:text-emerald-400">成功: {row.successCount}</span>
          <span className="text-rose-600 dark:text-rose-400">失败: {row.failCount}</span>
        </div>
      ),
    },
    {
      key: "errorMessage",
      title: "详细日志",
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
          <DrawerTitle className="text-xl">执行历史 - {taskKey}</DrawerTitle>
          <DrawerDescription>调度任务的历史执行记录</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-auto p-4 sm:p-6 w-full max-w-6xl mx-auto">
          <DataTable
            columns={columns}
            data={page.records}
            rowKey={(row) => row.id.toString()}
            loading={loading}
            emptyText="暂无执行历史"
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
