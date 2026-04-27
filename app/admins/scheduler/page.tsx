"use client";

import { useState } from "react";
import { CalendarClock, CheckCircle2, Clock3, PauseCircle, Play, RotateCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";
import { runScheduler } from "@/api/admin";
import type { SchedulerRunResult } from "@/api/types";
import { formatNumber, toErrorMessage } from "@/lib/format";

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

  const execute = async (task: SchedulerTask) => {
    setError(null);
    try {
      const res = await runScheduler(task.key);
      setResults((current) => ({ ...current, [task.key]: res.data }));
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="SCHEDULER" title="调度任务" description="手动执行平台内置调度任务。每个任务执行前必须二次确认。" />
      {error ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</div> : null}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => {
          const Icon = task.icon;
          const result = results[task.key];
          return (
            <Card key={task.key} className="border-white/10 bg-[#18181b]/80 text-zinc-100">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-4 w-4 text-[#9aa2ff]" />
                    {task.title}
                  </CardTitle>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{task.description}</p>
                </div>
                <StatusBadge status={result?.status ?? "PENDING"} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-white/[0.025] p-3 text-center">
                  <Metric label="总数" value={result?.totalCount} />
                  <Metric label="成功" value={result?.successCount} />
                  <Metric label="失败" value={result?.failCount} />
                </div>
                {result?.errorMessage ? <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-xs text-rose-200">{result.errorMessage}</div> : null}
                <ConfirmActionButton title={`执行${task.title}`} description="该操作会触发后端调度任务，请确认当前环境允许手动执行。" onConfirm={() => execute(task)}>
                  <Play className="h-4 w-4" />
                  执行任务
                </ConfirmActionButton>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value?: number }) {
  return (
    <div>
      <div className="text-lg font-semibold tabular-nums text-zinc-50">{formatNumber(value ?? 0)}</div>
      <div className="mt-1 text-[11px] text-zinc-500">{label}</div>
    </div>
  );
}
