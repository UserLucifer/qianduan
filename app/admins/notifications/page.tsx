"use client";

import { useCallback, useState } from "react";
import { Megaphone, Plus, XCircle } from "lucide-react";
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
import { broadcastAdminNotification, cancelAdminNotification, createAdminNotification, getAdminNotifications } from "@/api/admin";
import type { NotificationQueryRequest, SysNotification } from "@/api/types";
import { notificationTypeLabel } from "@/lib/status";
import { formatEmpty, toErrorMessage } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { NotificationForm } from "@/components/admin/NotificationForms";

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
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isBroadcast, setIsBroadcast] = useState(false);

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
    { key: "userId", title: "用户 ID", render: (row) => <span className="font-medium">{formatEmpty(row.userId)}</span> },
    { key: "title", title: "标题", render: (row) => <span className="line-clamp-1 max-w-[260px] font-medium text-foreground">{row.title}</span> },
    { key: "type", title: "类型", render: (row) => <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs">{notificationTypeLabel(row.type)}</span> },
    { key: "bizType", title: "业务", render: (row) => <span className="text-muted-foreground">{formatEmpty(row.bizType)}</span> },
    { key: "readStatus", title: "状态", render: (row) => <StatusBadge status={row.readStatus === 1 ? "已读" : "未读"} label={row.readStatus === 1 ? "已读" : "未读"} /> },
    { key: "status", title: "发布", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: "时间", render: (row) => <DateTimeText value={row.createdAt} /> },
    {
      key: "actions",
      title: "操作",
      render: (row) => (
        <ConfirmActionButton title="取消通知" description="取消后该通知将不再继续生效。" onConfirm={() => cancelNotice(row.id)}>
          <XCircle className="h-4 w-4" />
          取消
        </ConfirmActionButton>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="NOTIFICATION OPS"
        title="通知管理"
        description="创建单用户通知、广播通知，并按类型、业务和已读状态检索。"
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => { setIsBroadcast(false); setFormOpen(true); }}
            >
              <Plus className="mr-2 h-4 w-4" />
              个人通知
            </Button>
            <Button 
              onClick={() => { setIsBroadcast(true); setFormOpen(true); }}
            >
              <Megaphone className="mr-2 h-4 w-4" />
              广播通知
            </Button>
          </div>
        }
      />
      {(error || actionError) ? (
        <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-500 font-medium">
          {actionError ?? error}
        </div>
      ) : null}

      <SearchPanel
        onSearch={() => updateParams(buildQuery(filters))}
        onReset={() => {
          setFilters(initialFilters);
          updateParams(initialQuery);
        }}
      >
        <div className="space-y-2">
          <Label>已读状态</Label>
          <Select value={filters.readStatus} onValueChange={(val) => setFilters((current) => ({ ...current, readStatus: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部状态</SelectItem>
              <SelectItem value="1">已读</SelectItem>
              <SelectItem value="0">未读</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>通知类型</Label>
          <Select value={filters.notificationType} onValueChange={(val) => setFilters((current) => ({ ...current, notificationType: val }))}>
            <SelectTrigger className="h-9 w-[130px] bg-background text-foreground">
              <SelectValue placeholder="全部类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">全部类型</SelectItem>
              <SelectItem value="SYSTEM">系统通知</SelectItem>
              <SelectItem value="ORDER">订单通知</SelectItem>
              <SelectItem value="WALLET">资金通知</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bizType">业务类型</Label>
          <Input id="bizType" placeholder="输入类型" value={filters.bizType} onChange={(event) => setFilters((current) => ({ ...current, bizType: event.target.value }))} className="h-9 w-[130px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>开始日期</Label>
          <Input type="date" value={filters.startTime} onChange={(event) => setFilters((current) => ({ ...current, startTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>结束日期</Label>
          <Input type="date" value={filters.endTime} onChange={(event) => setFilters((current) => ({ ...current, endTime: event.target.value }))} className="h-9 w-[150px] bg-background text-foreground" />
        </div>
      </SearchPanel>
      
      <DataTable columns={columns} data={page.records} rowKey={(row) => row.id} loading={loading} emptyText="暂无通知数据" pageNo={page.pageNo} pageSize={page.pageSize} total={page.total} onPageChange={changePage} />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="flex max-w-xl flex-col items-stretch">
          <DialogTitle className="sr-only">
            {isBroadcast ? "发布广播通知" : "发送个人通知"}
          </DialogTitle>
          <NotificationForm
            isBroadcast={isBroadcast}
            onSuccess={() => { setFormOpen(false); reload(); }}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
